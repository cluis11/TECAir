using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;

namespace TECAirAPI.Data.Repositories.Implementations;

public class PruebaRepository : IPruebaRepository
{
    private readonly DBConnection _db;

    public PruebaRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<dynamic>> GetAll()
    {
        var results = new List<dynamic>();
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT * FROM prueba", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(new
            {
                id = reader.GetInt32(0),
                nombre = reader.GetString(1),
                descripcion = reader.GetString(2)
            });
        }
        return results;
    }

    public async Task<dynamic?> GetById(int id)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT * FROM prueba WHERE id = @id", conn);
        cmd.Parameters.AddWithValue("id", id);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new
            {
                id = reader.GetInt32(0),
                nombre = reader.GetString(1),
                descripcion = reader.GetString(2)
            };
        }
        return null;
    }

    public async Task Insert(string nombre, string descripcion)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("INSERT INTO prueba (nombre, descripcion) VALUES (@nombre, @descripcion)", conn);
        cmd.Parameters.AddWithValue("nombre", nombre);
        cmd.Parameters.AddWithValue("descripcion", descripcion);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<bool> Update(int id, string nombre, string descripcion)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("UPDATE prueba SET nombre = @nombre, descripcion = @descripcion WHERE id = @id", conn);
        cmd.Parameters.AddWithValue("id", id);
        cmd.Parameters.AddWithValue("nombre", nombre);
        cmd.Parameters.AddWithValue("descripcion", descripcion);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> Delete(int id)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("DELETE FROM prueba WHERE id = @id", conn);
        cmd.Parameters.AddWithValue("id", id);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }
}