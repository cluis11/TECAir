using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Implementations;

public class BoletoRepository : IBoletoRepository
{
    private readonly DBConnection _db;

    public BoletoRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<ReservaResponseDTO> GetByReserva(int idReserva)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmdReserva = new NpgsqlCommand(
            "SELECT * FROM reserva WHERE id_reserva = @id", conn);
        cmdReserva.Parameters.AddWithValue("id", idReserva);
        using var readerReserva = await cmdReserva.ExecuteReaderAsync();
        if (!await readerReserva.ReadAsync()) return null;

        var reserva = new ReservaResponseDTO
        {
            idReserva        = readerReserva.GetInt32(0),
            Estado           = readerReserva.GetString(5),
            Fecha            = DateOnly.FromDateTime(readerReserva.GetDateTime(3)),
            PasaporteTitular = readerReserva.GetString(2),
            Boletos          = new List<BoletoDetalleDTO>()
        };
        await readerReserva.CloseAsync();

        reserva.Boletos = await GetBoletosDetalle(idReserva, conn);
        return reserva;
    }

    public async Task<CheckinResponseDTO> UpdateCheckin(int idBoleto, int idAsiento)
    {
        // 1 - Marcar asiento como ocupado
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            using var cmd = new NpgsqlCommand(
                "UPDATE asiento_itinerario ai SET estado = 'ocupado' " +
                "FROM boleto b " +
                "WHERE b.id_boleto = @idBoleto " +
                "AND ai.id_asiento = @idAsiento " +
                "AND ai.id_itinerario = b.id_itinerario", conn);
            cmd.Parameters.AddWithValue("idAsiento", idAsiento);
            cmd.Parameters.AddWithValue("idBoleto", idBoleto);
            await cmd.ExecuteNonQueryAsync();
        }

        // 2 - Actualizar boleto
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            using var cmd = new NpgsqlCommand(
                "UPDATE boleto SET id_asiento = @idAsiento, ya_checkin = true " +
                "WHERE id_boleto = @idBoleto", conn);
            cmd.Parameters.AddWithValue("idAsiento", idAsiento);
            cmd.Parameters.AddWithValue("idBoleto", idBoleto);
            await cmd.ExecuteNonQueryAsync();
        }

        // 3 - Retornar pase de abordar
        using var conn2 = _db.GetConnection();
        await conn2.OpenAsync();
        using var cmdPase = new NpgsqlCommand(
            "SELECT b.id_boleto, b.ya_checkin, a.fila, a.columna, " +
            "i.puerta_embarque, i.salida " +
            "FROM boleto b " +
            "JOIN asiento a ON a.id_asiento = b.id_asiento " +
            "JOIN itinerario i ON i.id_itinerario = b.id_itinerario " +
            "WHERE b.id_boleto = @idBoleto", conn2);
        cmdPase.Parameters.AddWithValue("idBoleto", idBoleto);
        using var reader = await cmdPase.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new CheckinResponseDTO
            {
                idBoleto       = reader.GetInt32(0),
                YaCheckin      = reader.GetBoolean(1),
                Fila           = reader.GetString(2),
                Columna        = reader.GetString(3),
                PuertaEmbarque = reader.GetString(4),
                Salida         = reader.GetTimeSpan(5).ToString(@"hh\:mm"),
            };
        }
        return null;
    }

    public async Task<IEnumerable<string>> GetByPasaporteCheckin(string pasaporte)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT id_boleto::text FROM boleto WHERE id_pasajero = @pasaporte AND ya_checkin = true", conn);
        cmd.Parameters.AddWithValue("pasaporte", pasaporte);
        using var reader = await cmd.ExecuteReaderAsync();
        var boletos = new List<string>();
        while (await reader.ReadAsync())
            boletos.Add(reader.GetString(0));
        return boletos;
    }

    // -----------------------------------------------
    // Parte interna
    // -----------------------------------------------
    private async Task<List<BoletoDetalleDTO>> GetBoletosDetalle(int idReserva, NpgsqlConnection conn)
    {
        using var cmd = new NpgsqlCommand(
            "SELECT b.id_boleto, b.id_pasajero, p.nombre || ' ' || p.ap1 AS nombre_pasajero, " +
            "b.id_itinerario, b.id_asiento, " +
            "a.fila, a.columna, " +
            "i.salida, i.puerta_embarque, " +
            "ao.ciudad AS ciudad_origen, ad.ciudad AS ciudad_destino, " +
            "b.ya_checkin " +
            "FROM boleto b " +
            "JOIN pasajero p ON p.pasaporte = b.id_pasajero " +
            "JOIN itinerario i ON i.id_itinerario = b.id_itinerario " +
            "JOIN vuelo v ON v.id_vuelo = i.id_vuelo " +
            "JOIN aeropuerto ao ON ao.id_aeropuerto = v.id_origen " +
            "JOIN aeropuerto ad ON ad.id_aeropuerto = v.id_destino " +
            "LEFT JOIN asiento a ON a.id_asiento = b.id_asiento " +
            "WHERE b.id_reserva = @idReserva AND b.estado = 'pagado' AND b.ya_checkin = false", conn);
        cmd.Parameters.AddWithValue("idReserva", idReserva);
        using var reader = await cmd.ExecuteReaderAsync();

        var boletos = new List<BoletoDetalleDTO>();
        while (await reader.ReadAsync())
        {
            boletos.Add(new BoletoDetalleDTO
            {
                idBoleto       = reader.GetInt32(0),
                Pasaporte      = reader.GetString(1),
                NombrePasajero = reader.GetString(2),
                idItinerario   = reader.GetInt32(3),
                idAsiento      = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                Fila           = reader.IsDBNull(5) ? "" : reader.GetString(5),
                Columna        = reader.IsDBNull(6) ? "" : reader.GetString(6),
                Salida         = reader.GetTimeSpan(7),
                PuertaEmbarque = reader.GetString(8),
                CiudadOrigen   = reader.GetString(9),
                CiudadDestino  = reader.GetString(10),
                YaCheckin      = reader.GetBoolean(11),
            });
        }
        return boletos;
    }
}