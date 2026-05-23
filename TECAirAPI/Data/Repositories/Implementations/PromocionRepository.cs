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
            "SELECT * FROM promocion WHERE inicio <= @fecha AND fin >= @fecha", conn);
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

    public async Task<Promocion> GetById(int id_promo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM promocion WHERE id_promo = @id", conn);
        cmd.Parameters.AddWithValue("id", id_promo);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapPromocion(reader);
        }
        return null;
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

    public async Task<Promocion> PutPromocion(int id_promo, Promocion promocion)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = PutCommand(conn, id_promo, promocion);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return MapPromocion(reader);
        }
        return null;
    }

    public async Task<IEnumerable<Promocion>> DeletePromocion(int id_promo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "DELETE FROM promocion WHERE id_promo = @id RETURNING *", conn);
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
            id_ruta = reader.GetInt32(1),
            porcentaje = reader.GetDecimal(2),
            inicio = reader.GetDateTime(3),
            fin = reader.GetDateTime(4),
            imagen = reader.IsDBNull(5) ? null : reader.GetString(5)
        };
    }

    private NpgsqlCommand CreatePostCommand(NpgsqlConnection conn, Promocion promocion)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO promocion (id_ruta, porcentaje, inicio, fin, imagen) " +
            "VALUES (@id_ruta, @porcentaje, @inicio, @fin, @imagen) RETURNING *", conn);
        cmd.Parameters.AddWithValue("id_ruta", promocion.id_ruta);
        cmd.Parameters.AddWithValue("porcentaje", promocion.porcentaje);
        cmd.Parameters.AddWithValue("inicio", promocion.inicio);
        cmd.Parameters.AddWithValue("fin", promocion.fin);
        cmd.Parameters.AddWithValue("imagen", (object?)promocion.imagen ?? DBNull.Value);
        return cmd;
    }

    private NpgsqlCommand PutCommand(NpgsqlConnection conn, int id_promo, Promocion promocion)
    {
        var cmd = new NpgsqlCommand(
            "UPDATE promocion SET id_ruta = @id_ruta, porcentaje = @porcentaje, " +
            "inicio = @inicio, fin = @fin, imagen = @imagen WHERE id_promo = @id RETURNING *", conn);
        cmd.Parameters.AddWithValue("id", id_promo);
        cmd.Parameters.AddWithValue("id_ruta", promocion.id_ruta);
        cmd.Parameters.AddWithValue("porcentaje", promocion.porcentaje);
        cmd.Parameters.AddWithValue("inicio", promocion.inicio);
        cmd.Parameters.AddWithValue("fin", promocion.fin);
        cmd.Parameters.AddWithValue("imagen", (object?)promocion.imagen ?? DBNull.Value);
        return cmd;
    }
}