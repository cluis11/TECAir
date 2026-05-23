using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Implementations;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly DBConnection _db;

    public UsuarioRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Usuario>> GetAll()
    {
        var results = new List<Usuario>();
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT * FROM usuario", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            results.Add(MapUsuario(reader));
        }

        // Join con estudiante
        foreach (var usuario in results)
        {
            var estudiante = await GetEstudiante(usuario.IdUser);
            if (estudiante != null)
            {
                usuario.EsEstudiante = true;
                usuario.Estudiante = estudiante;
            }
        }
        return results;
    }

    public async Task<Usuario?> GetById(int id)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT * FROM usuario WHERE id_user = @id", conn);
        cmd.Parameters.AddWithValue("id", id);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            var usuario = MapUsuario(reader);
            var estudiante = await GetEstudiante(usuario.IdUser);
            if (estudiante != null)
            {
                usuario.EsEstudiante = true;
                usuario.Estudiante = estudiante;
            }
            return usuario;
        }
        return null;
    }

    public async Task<Usuario?> GetByCorreo(string correo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT * FROM usuario WHERE correo = @correo", conn);
        cmd.Parameters.AddWithValue("correo", correo);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync()) return MapUsuario(reader);
        return null;
    }

    public async Task<bool> ExisteCorreo(string correo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM usuario WHERE correo = @correo", conn);
        cmd.Parameters.AddWithValue("correo", correo);
        var count = await cmd.ExecuteScalarAsync();
        return Convert.ToInt64(count) > 0;
    }

    public async Task<bool> ExisteTelefono(string telefono)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT COUNT(*) FROM usuario WHERE telefono = @telefono", conn);
        cmd.Parameters.AddWithValue("telefono", telefono);
        var count = await cmd.ExecuteScalarAsync();
        return Convert.ToInt64(count) > 0;
    }

    public async Task Insert(Usuario usuario)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "INSERT INTO usuario (correo, contrasena, nombre, ap1, ap2, telefono) VALUES (@correo, @contrasena, @nombre, @ap1, @ap2, @telefono) RETURNING id_user", conn);
        cmd.Parameters.AddWithValue("correo", usuario.Correo);
        cmd.Parameters.AddWithValue("contrasena", usuario.Contrasena);
        cmd.Parameters.AddWithValue("nombre", usuario.Nombre);
        cmd.Parameters.AddWithValue("ap1", usuario.Ap1);
        cmd.Parameters.AddWithValue("ap2", usuario.Ap2 ?? (object)DBNull.Value);
        cmd.Parameters.AddWithValue("telefono", usuario.Telefono);
        usuario.IdUser = Convert.ToInt32(await cmd.ExecuteScalarAsync());
    }

    public async Task<bool> Update(Usuario usuario)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "UPDATE usuario SET correo = @correo, telefono = @telefono, contrasena = @contrasena WHERE id_user = @id", conn);
        cmd.Parameters.AddWithValue("id", usuario.IdUser);
        cmd.Parameters.AddWithValue("correo", usuario.Correo);
        cmd.Parameters.AddWithValue("telefono", usuario.Telefono);
        cmd.Parameters.AddWithValue("contrasena", usuario.Contrasena);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> Delete(int id)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("DELETE FROM usuario WHERE id_user = @id", conn);
        cmd.Parameters.AddWithValue("id", id);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<Estudiante?> GetEstudiante(int idUsuario)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT * FROM estudiante WHERE id_usuario = @id", conn);
        cmd.Parameters.AddWithValue("id", idUsuario);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            return new Estudiante
            {
                IdUsuario = reader.GetInt32(0),
                Carnet = reader.GetString(1),
                Universidad = reader.GetString(2),
                Millas = reader.GetFloat(3)
            };
        }
        return null;
    }

    public async Task InsertEstudiante(Estudiante estudiante)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "INSERT INTO estudiante (id_usuario, carnet, universidad, millas) VALUES (@id, @carnet, @universidad, @millas)", conn);
        cmd.Parameters.AddWithValue("id", estudiante.IdUsuario);
        cmd.Parameters.AddWithValue("carnet", estudiante.Carnet);
        cmd.Parameters.AddWithValue("universidad", estudiante.Universidad);
        cmd.Parameters.AddWithValue("millas", estudiante.Millas);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<bool> UpdateEstudiante(Estudiante estudiante)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "UPDATE estudiante SET carnet = @carnet, universidad = @universidad WHERE id_usuario = @id", conn);
        cmd.Parameters.AddWithValue("id", estudiante.IdUsuario);
        cmd.Parameters.AddWithValue("carnet", estudiante.Carnet);
        cmd.Parameters.AddWithValue("universidad", estudiante.Universidad);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> AgregarMillas(int idUsuario, float millas)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "UPDATE estudiante SET millas = millas + @millas WHERE id_usuario = @id", conn);
        cmd.Parameters.AddWithValue("id", idUsuario);
        cmd.Parameters.AddWithValue("millas", millas);
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    private static Usuario MapUsuario(NpgsqlDataReader reader)
    {
        return new Usuario
        {
            IdUser = reader.GetInt32(0),
            Correo = reader.GetString(1),
            Contrasena = reader.GetString(2),
            Nombre = reader.GetString(3),
            Ap1 = reader.GetString(4),
            Ap2 = reader.IsDBNull(5) ? null : reader.GetString(5),
            Telefono = reader.GetString(6)
        };
    }
}