using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Implementations;

public class MaletaRepository : IMaletaRepository
{
    private readonly DBConnection _db;

    public MaletaRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Maleta>> GetByPasaporte(string pasaporte)
    {
        var maletas = new List<Maleta>();
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT id_maleta, pasaporte, color, peso FROM maleta WHERE pasaporte = @pasaporte", conn);
        cmd.Parameters.AddWithValue("pasaporte", pasaporte);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            maletas.Add(MapMaleta(reader));
        }
        return maletas;
    }

    public async Task<IEnumerable<PasajeroMaletaDTO>> GetPasajerosPorReserva(int idReserva)
    {
        var pasajeros = new List<PasajeroMaletaDTO>();

        using var conn = _db.GetConnection();
        await conn.OpenAsync();

        // Obtener pasajeros con boletos chequeados e itinerario abierto
        using var cmd = new NpgsqlCommand(
            @"SELECT DISTINCT p.pasaporte, p.nombre, p.ap1, b.id_itinerario
              FROM boleto b
              JOIN pasajero p ON p.pasaporte = b.id_pasajero
              JOIN itinerario i ON i.id_itinerario = b.id_itinerario
              WHERE b.id_reserva = @idReserva
              AND b.ya_checkin = true
              AND i.estado = 'abierto'", conn);
        cmd.Parameters.AddWithValue("idReserva", idReserva);
        using var reader = await cmd.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            pasajeros.Add(new PasajeroMaletaDTO
            {
                Pasaporte     = reader.GetString(0),
                Nombre        = reader.GetString(1),
                Ap1           = reader.GetString(2),
                IdItinerario  = reader.GetInt32(3),
                Maletas       = new List<MaletaDTO>()
            });
        }
        await reader.CloseAsync();

        // Para cada pasajero cargar sus maletas
        foreach (var pasajero in pasajeros)
        {
            using var cmdMaletas = new NpgsqlCommand(
                "SELECT id_maleta, color, peso FROM maleta WHERE pasaporte = @pasaporte", conn);
            cmdMaletas.Parameters.AddWithValue("pasaporte", pasajero.Pasaporte);
            using var readerMaletas = await cmdMaletas.ExecuteReaderAsync();
            while (await readerMaletas.ReadAsync())
            {
                pasajero.Maletas.Add(new MaletaDTO
                {
                    IdMaleta = readerMaletas.GetInt32(0),
                    Color    = readerMaletas.GetString(1),
                    Peso     = readerMaletas.GetDouble(2)
                });
            }
        }

        return pasajeros;
    }

    public async Task<Maleta> Insert(Maleta maleta)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "INSERT INTO maleta (pasaporte, color, peso) " +
            "VALUES (@pasaporte, @color, @peso) RETURNING id_maleta, pasaporte, color, peso", conn);
        cmd.Parameters.AddWithValue("pasaporte", maleta.Pasaporte);
        cmd.Parameters.AddWithValue("color", maleta.Color);
        cmd.Parameters.AddWithValue("peso", maleta.Peso);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapMaleta(reader);
        }
        return null;
    }

    public async Task<bool> Delete(int idMaleta)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "DELETE FROM maleta WHERE id_maleta = @id", conn);
        cmd.Parameters.AddWithValue("id", idMaleta);
        var rows = await cmd.ExecuteNonQueryAsync();
        return rows > 0;
    }

    private Maleta MapMaleta(NpgsqlDataReader reader)
    {
        return new Maleta
        {
            IdMaleta  = reader.GetInt32(0),
            Pasaporte = reader.GetString(1),
            Color     = reader.GetString(2),
            Peso      = reader.GetDouble(3)
        };
    }
}