using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Implementations;

public class ReservaRepository : IReservaRepository
{
    private readonly DBConnection _db;

    public ReservaRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<Reserva> PostReserva(CrearReservaDTO dto)
    {
        // 1 - Insertar cada pasajero (si ya existe por pasaporte, se ignora)
        foreach (var pasajero in dto.Pasajeros)
        {
            using var conn = _db.GetConnection();
            await conn.OpenAsync();
            await CreatePostPasajeroCommand(conn, pasajero);
        }

        // 2 - Insertar la reserva y obtener el id generado
        int idReserva;
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            idReserva = await CreatePostReservaCommand(conn, dto);
        }

        // 3 - Insertar los boletos de cada pasajero
        foreach (var pasajero in dto.Pasajeros)
        {
            foreach (var boleto in pasajero.Boletos)
            {
                using var conn = _db.GetConnection();
                await conn.OpenAsync();
                await CreatePostBoletoCommand(conn, pasajero.Pasaporte, boleto, idReserva);
            }
        }

        // 4 - Retornar la reserva creada
        return await GetById(idReserva);
    }

    public async Task<Reserva> GetById(int id)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM reserva WHERE id_reserva = @idReserva", conn);
        cmd.Parameters.AddWithValue("idReserva", id);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapReserva(reader);
        }
        return null;
    }

    public async Task<IEnumerable<Reserva>> GetByUsuario(int idUsuario)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM reserva WHERE id_user = @idUsuario", conn);
        cmd.Parameters.AddWithValue("idUsuario", idUsuario);
        using var reader = await cmd.ExecuteReaderAsync();
        var reservas = new List<Reserva>();
        while (await reader.ReadAsync())
        {
            reservas.Add(MapReserva(reader));
        }
        return reservas;
    }

    public async Task<bool> PagarReserva(int idReserva)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "UPDATE reserva SET estado = 'pagada' WHERE id_reserva = @idReserva AND estado = 'pendiente'", conn);
        cmd.Parameters.AddWithValue("idReserva", idReserva);
        var rows = await cmd.ExecuteNonQueryAsync();
        return rows > 0;
    }

    public async Task<bool> CancelarReserva(int idReserva)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "UPDATE reserva SET estado = 'cancelada' WHERE id_reserva = @idReserva AND estado = 'pendiente'", conn);
        cmd.Parameters.AddWithValue("idReserva", idReserva);
        var rows = await cmd.ExecuteNonQueryAsync();
        return rows > 0;
    }

    //----------------------------------------------
    // Parte Interna
    //----------------------------------------------

    private async Task CreatePostPasajeroCommand(NpgsqlConnection conn, PasajeroReservaDTO pasajero)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO pasajero (pasaporte, nombre, ap1, ap2, nacionalidad, fecha_nacimiento) " +
            "VALUES (@pasaporte, @nombre, @ap1, @ap2, @nacionalidad, @fechaNacimiento) " +
            "ON CONFLICT (pasaporte) DO NOTHING", conn);
        cmd.Parameters.AddWithValue("pasaporte", pasajero.Pasaporte);
        cmd.Parameters.AddWithValue("nombre", pasajero.Nombre);
        cmd.Parameters.AddWithValue("ap1", pasajero.Ap1);
        cmd.Parameters.AddWithValue("ap2", (object?)pasajero.Ap2 ?? DBNull.Value);
        cmd.Parameters.AddWithValue("nacionalidad", pasajero.Nacionalidad);
        cmd.Parameters.AddWithValue("fechaNacimiento", pasajero.FechaNacimiento);
        await cmd.ExecuteNonQueryAsync();
    }

    private async Task<int> CreatePostReservaCommand(NpgsqlConnection conn, CrearReservaDTO reserva)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO reserva (id_user, pasaporte_titular, fecha) " +
            "VALUES (@id_user, @pasaporte, CURRENT_DATE) " +
            "RETURNING id_reserva", conn);
        cmd.Parameters.AddWithValue("id_user", reserva.id_usuario);
        cmd.Parameters.AddWithValue("pasaporte", reserva.PasaporteTitular);
        return (int)await cmd.ExecuteScalarAsync();
    }

    private async Task CreatePostBoletoCommand(NpgsqlConnection conn, string pasaporte, BoletoReservaDTO boleto, int idReserva)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) " +
            "VALUES (@pasaporte, @idItinerario, @idAsiento, @idReserva, 'pendiente', false)", conn);
        cmd.Parameters.AddWithValue("pasaporte", pasaporte);
        cmd.Parameters.AddWithValue("idItinerario", boleto.id_itinerario);
        cmd.Parameters.AddWithValue("idAsiento", (object?)boleto.id_asiento ?? DBNull.Value);
        cmd.Parameters.AddWithValue("idReserva", idReserva);
        await cmd.ExecuteNonQueryAsync();
    }

    private Reserva MapReserva(NpgsqlDataReader reader)
    {
        return new Reserva
        {
            id_reserva        = reader.GetInt32(0),
            id_user           = reader.GetInt32(1),
            pasaporte_titular = reader.GetString(2),
            fecha             = DateOnly.FromDateTime(reader.GetDateTime(3))
        };
    }
}