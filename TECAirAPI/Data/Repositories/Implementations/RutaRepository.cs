using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Implementations;

public class RutaRepository : IRutaRepository
{
    private readonly DBConnection _db;

    public RutaRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Ruta>> GetAll()
    {
        var rutas = new List<Ruta>(); 

        using var conn = _db.GetConnection();
        {
            await conn.OpenAsync();
            using var cmd = new NpgsqlCommand("SELECT * FROM ruta", conn);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                rutas.Add(MapRuta(reader));
            }
        }

        // Agregar los vuelos a cada ruta
        foreach (var ruta in rutas)
        {
            var vuelos = await GetVuelosRuta(ruta.id_ruta);
            ruta.vuelos = vuelos.ToList();
        }
        return rutas;   
    }

    public async Task<IEnumerable<Ruta>> GetById(int idRuta)
    {
        var rutas = new List<Ruta>();

        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            using var cmd = new NpgsqlCommand(
                "SELECT * FROM ruta WHERE id_ruta = @idRuta", conn);
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                rutas.Add(MapRuta(reader));
            }
        }

        // Agregar los vuelos a cada ruta
        foreach (var ruta in rutas)
        {
            var vuelos = await GetVuelosRuta(ruta.id_ruta);
            ruta.vuelos = vuelos.ToList();
        }
        return rutas;
    }

    public async Task<IEnumerable<Ruta>> GetRutas(int origen, int destino)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM ruta " +
            "WHERE id_origen = @origen AND id_destino = @destino", conn);
                cmd.Parameters.AddWithValue("origen", origen);
                cmd.Parameters.AddWithValue("destino", destino);
        using var reader = await cmd.ExecuteReaderAsync();
        var rutas = new List<Ruta>();
        while (await reader.ReadAsync())
        {
            rutas.Add(MapRuta(reader));
        }

        // Agregar los vuelos a cada ruta
        foreach (var ruta in rutas)
        {
            var vuelos = await GetVuelosRuta(ruta.id_ruta);
            ruta.vuelos = vuelos.ToList();
        }
        return rutas;
    }

    public async Task<Ruta> PostRuta(Ruta ruta)
    {
        // 1 - Insertar la ruta y obtener el id_ruta generado
        int idRuta;
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            var cmd = CreatePostRutaCommand(conn, ruta);
            idRuta = (int) await cmd.ExecuteScalarAsync();
        }

        // 2 - Insertar los vuelos asociados a la ruta
        foreach (var vuelo in ruta.vuelos)
        {
            vuelo.id_ruta = idRuta; // Obtener el id_ruta generado
            using var conn = _db.GetConnection();
            await conn.OpenAsync();
            using var cmd = CreatePostVueloCommand(conn, vuelo);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                vuelo.id_vuelo = reader.GetInt32(0); // Lee el id generado
            }
        }
        
        // 3 - Retornar la ruta completa con sus vuelos
        ruta.id_ruta = idRuta;
        return ruta;
    }

    public async Task<bool> DeleteRuta(int idRuta)
    {

        // 1 - Eliminar asiento_itinerario
        // 2 - Eliminar boletos
        // 3 - Eliminar itinerarios
        // 4 - Eliminar Promociones
        // 5 - Eliminar vuelos
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            var cmd = new NpgsqlCommand(
                "DELETE FROM vuelo WHERE id_ruta = @idRuta", conn);
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 6 - Eliminar la ruta
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            using var cmdRuta = new NpgsqlCommand(
                "DELETE FROM ruta WHERE id_ruta = @idRuta", conn);
            cmdRuta.Parameters.AddWithValue("idRuta", idRuta);
            var rows = await cmdRuta.ExecuteNonQueryAsync();
            return rows > 0;
        }
    }

    public async Task<IEnumerable<Vuelo>> GetVuelo(int idVuelo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM vuelo WHERE id_vuelo = @idVuelo", conn);
        cmd.Parameters.AddWithValue("idVuelo", idVuelo);
        using var reader = await cmd.ExecuteReaderAsync();
        var vuelos = new List<Vuelo>();
        while (await reader.ReadAsync())
        {
            vuelos.Add(MapVuelo(reader));
        }
        return vuelos;
    }

    //----------------------------------------------
    // Parte Interna
    //----------------------------------------------

    private async Task<IEnumerable<Vuelo>> GetVuelosRuta(int idRuta)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM vuelo WHERE id_ruta = @idRuta", conn);
        cmd.Parameters.AddWithValue("idRuta", idRuta);
        using var reader = await cmd.ExecuteReaderAsync();
        var vuelos = new List<Vuelo>();
        while (await reader.ReadAsync())
        {
            vuelos.Add(MapVuelo(reader));
        }
        return vuelos;
    }




    private Ruta MapRuta(NpgsqlDataReader reader)
    {
        return new Ruta
        {
            id_ruta = reader.GetInt32(0),
            id_origen = reader.GetInt32(1),
            id_destino = reader.GetInt32(2),
            precio = reader.GetFloat(3)
        };
    }

    private Vuelo MapVuelo(NpgsqlDataReader reader)
    {
        return new Vuelo
        {
            id_vuelo = reader.GetInt32(0),
            id_ruta = reader.GetInt32(1),
            id_origen = reader.GetInt32(2),
            id_destino = reader.GetInt32(3),
            matricula = reader.GetString(4)
        };
    }

    // POST Rutas y Vuelos
    private NpgsqlCommand CreatePostRutaCommand(NpgsqlConnection conn, Ruta ruta)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO ruta (id_origen, id_destino, precio) " +
            "VALUES (@origen, @destino, @precio) RETURNING id_ruta", conn);
        cmd.Parameters.AddWithValue("origen", ruta.id_origen);
        cmd.Parameters.AddWithValue("destino", ruta.id_destino);
        cmd.Parameters.AddWithValue("precio", ruta.precio);
        return cmd;
    }

    private NpgsqlCommand CreatePostVueloCommand(NpgsqlConnection conn, Vuelo vuelo)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) " +
            "VALUES (@idRuta, @idOrigen, @idDestino, @matricula) RETURNING *", conn);
        cmd.Parameters.AddWithValue("idRuta", vuelo.id_ruta);
        cmd.Parameters.AddWithValue("idOrigen", vuelo.id_origen);
        cmd.Parameters.AddWithValue("idDestino", vuelo.id_destino);
        cmd.Parameters.AddWithValue("matricula", vuelo.matricula);
        return cmd;
    }
}