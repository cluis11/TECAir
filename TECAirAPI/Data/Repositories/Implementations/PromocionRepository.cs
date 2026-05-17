using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Implementations;

public class PromocionRepository : IPromocionRepository
{
    private readonly DBConnection _db;

    public PromocionRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Promocion>> GetActivas(DateTime fecha)
    {
        var activities = new List<Promocion>();

        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM promocion WHERE fecha_inicio <= @fecha AND fecha_fin >= @fecha", conn);
        cmd.Parameters.AddWithValue("fecha", fecha);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            activities.Add(MapPromocion(reader));
        }
        return activities;
    }

    public async Task<IEnumerable<Promocion>> GetAll()
    {
        var promociones = new List<Promocion>();

        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM promocion", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            promociones.Add(MapPromocion(reader));
        }
        return promociones;
    }

    public async Task<IEnumerable<Promocion>> PostPromocion(Promocion promocion)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = CreatePostCommand(conn, promocion);
        using var reader = await cmd.ExecuteReaderAsync();
        var promociones = new List<Promocion>();
        while (await reader.ReadAsync())
        {
            promociones.Add(MapPromocion(reader));
        }
        return promociones;
    }

    public async Task<IEnumerable<Promocion>> DeletePromocion(int id_promo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "DELETE FROM promocion WHERE id_promocion = @id RETURNING *", conn);
        cmd.Parameters.AddWithValue("id", id_promo);
        using var reader = await cmd.ExecuteReaderAsync();
        var promociones = new List<Promocion>();
        while (await reader.ReadAsync())
        {
            promociones.Add(MapPromocion(reader));
        }
        return promociones;
    }

    private Promocion MapPromocion(NpgsqlDataReader reader)
    {
        return new Promocion
        {
            id_promo = reader.GetInt32(0),
            idRuta = reader.GetInt32(1),
            porcentaje = reader.GetDecimal(2),
            inicio = reader.GetDateTime(3),
            fin = reader.GetDateTime(4),
            imagen = reader.GetString(5)
        };
    }

    private NpgsqlCommand CreatePostCommand(NpgsqlConnection conn, Promocion promocion)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO promocion (id_ruta, porcentaje, fecha_inicio, fecha_fin, imagen) " +
            "VALUES (@idRuta, @porcentaje, @inicio, @fin, @imagen) RETURNING *", conn);
        cmd.Parameters.AddWithValue("idRuta", promocion.idRuta);
        cmd.Parameters.AddWithValue("porcentaje", promocion.porcentaje);
        cmd.Parameters.AddWithValue("inicio", promocion.inicio);
        cmd.Parameters.AddWithValue("fin", promocion.fin);
        cmd.Parameters.AddWithValue("imagen", promocion.imagen);
        return cmd;
    }
}