using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.DTOs;

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

    public async Task<Ruta> PutRuta(int id_ruta, Ruta ruta)
    {
        // 1 - Actualizar la ruta
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            var cmd = PutRutaCommand(conn, id_ruta, ruta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 2 - Borrar todos los vuelos actuales de la ruta
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            var cmd = new NpgsqlCommand(
                "DELETE FROM vuelo WHERE id_ruta = @idRuta", conn);
            cmd.Parameters.AddWithValue("idRuta", id_ruta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 3 - Reinsertar los vuelos actualizados
        foreach (var vuelo in ruta.vuelos)
        {
            vuelo.id_ruta = id_ruta; // Asegurar que el id_ruta esté correcto
            using var conn = _db.GetConnection();
            await conn.OpenAsync();
            using var cmd = CreatePostVueloCommand(conn, vuelo);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                vuelo.id_vuelo = reader.GetInt32(0); // Lee el id generado
            }
        }

        // 4 - Retornar la ruta actualizada con sus vuelos
        ruta.id_ruta = id_ruta;
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

    // PUT Rutas y Vuelos
    private NpgsqlCommand PutRutaCommand(NpgsqlConnection conn, int idRuta, Ruta ruta)
    {
        var cmd = new NpgsqlCommand(
            "UPDATE ruta SET id_origen = @origen, id_destino = @destino, precio = @precio " +
            "WHERE id_ruta = @idRuta", conn);
        cmd.Parameters.AddWithValue("origen", ruta.id_origen);
        cmd.Parameters.AddWithValue("destino", ruta.id_destino);
        cmd.Parameters.AddWithValue("precio", ruta.precio);
        cmd.Parameters.AddWithValue("idRuta", idRuta);
        return cmd;
    }

    private NpgsqlCommand PutVueloCommand(NpgsqlConnection conn, int idVuelo, Vuelo vuelo)
    {
        var cmd = new NpgsqlCommand(
            "UPDATE vuelo SET id_ruta = @idRuta, id_origen = @idOrigen, id_destino = @idDestino, matricula = @matricula " +
            "WHERE id_vuelo = @idVuelo", conn);
        cmd.Parameters.AddWithValue("idRuta", vuelo.id_ruta);
        cmd.Parameters.AddWithValue("idOrigen", vuelo.id_origen);
        cmd.Parameters.AddWithValue("idDestino", vuelo.id_destino);
        cmd.Parameters.AddWithValue("matricula", vuelo.matricula);
        cmd.Parameters.AddWithValue("idVuelo", idVuelo);
        return cmd;
    }

   public async Task<IEnumerable<RutaResultadoDTO>> GetAllParaPromo()
    {
        var rutas = new List<RutaResultadoDTO>();

        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            @"SELECT r.id_ruta, a1.ciudad AS ciudad_origen, a2.ciudad AS ciudad_destino, r.precio,
                    COUNT(v.id_vuelo) AS cantidad_vuelos
            FROM ruta r
            JOIN aeropuerto a1 ON r.id_origen = a1.id_aeropuerto
            JOIN aeropuerto a2 ON r.id_destino = a2.id_aeropuerto
            LEFT JOIN vuelo v ON v.id_ruta = r.id_ruta
            GROUP BY r.id_ruta, a1.ciudad, a2.ciudad, r.precio", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            rutas.Add(new RutaResultadoDTO
            {
                IdRuta = reader.GetInt32(0),
                CiudadOrigen = reader.GetString(1),
                CiudadDestino = reader.GetString(2),
                Precio = reader.GetDecimal(3),
                CantidadVuelos = reader.GetInt32(4)
            });
        }
        return rutas;
    }
}