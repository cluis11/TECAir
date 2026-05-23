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

        foreach (var ruta in rutas)
        {
            var vuelos = await GetVuelosRuta(ruta.id_ruta);
            ruta.vuelos = vuelos.ToList();
        }
        return rutas;
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

    public async Task<Ruta> PostRuta(Ruta ruta)
    {
        int idRuta;
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            var cmd = CreatePostRutaCommand(conn, ruta);
            idRuta = (int) await cmd.ExecuteScalarAsync();
        }

        foreach (var vuelo in ruta.vuelos)
        {
            vuelo.id_ruta = idRuta;
            using var conn = _db.GetConnection();
            await conn.OpenAsync();
            using var cmd = CreatePostVueloCommand(conn, vuelo);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                vuelo.id_vuelo = reader.GetInt32(0);
            }
        }
        
        ruta.id_ruta = idRuta;
        return ruta;
    }

    public async Task<Ruta> PutRuta(int id_ruta, Ruta ruta)
    {
        using (var conn = _db.GetConnection())
        {
            await conn.OpenAsync();
            var cmd = PutRutaCommand(conn, id_ruta, ruta);
            await cmd.ExecuteNonQueryAsync();
        }

        ruta.id_ruta = id_ruta;
        return ruta;
    }

    public async Task<bool> DeleteRuta(int idRuta)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();

        // 1 - Cerrar itinerarios activos
        await CerrarItinerariosDeRuta(conn, idRuta);

        // 2 - asiento_itinerario
        using (var cmd = new NpgsqlCommand(
            @"DELETE FROM asiento_itinerario 
              WHERE id_itinerario IN (
                  SELECT i.id_itinerario FROM itinerario i
                  JOIN vuelo v ON i.id_vuelo = v.id_vuelo
                  WHERE v.id_ruta = @idRuta)", conn))
        {
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 3 - boleto
        using (var cmd = new NpgsqlCommand(
            @"DELETE FROM boleto 
              WHERE id_itinerario IN (
                  SELECT i.id_itinerario FROM itinerario i
                  JOIN vuelo v ON i.id_vuelo = v.id_vuelo
                  WHERE v.id_ruta = @idRuta)", conn))
        {
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 4 - itinerario
        using (var cmd = new NpgsqlCommand(
            @"DELETE FROM itinerario 
              WHERE id_vuelo IN (
                  SELECT id_vuelo FROM vuelo WHERE id_ruta = @idRuta)", conn))
        {
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 5 - promocion
        using (var cmd = new NpgsqlCommand(
            "DELETE FROM promocion WHERE id_ruta = @idRuta", conn))
        {
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 6 - vuelo
        using (var cmd = new NpgsqlCommand(
            "DELETE FROM vuelo WHERE id_ruta = @idRuta", conn))
        {
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            await cmd.ExecuteNonQueryAsync();
        }

        // 7 - ruta
        using (var cmd = new NpgsqlCommand(
            "DELETE FROM ruta WHERE id_ruta = @idRuta", conn))
        {
            cmd.Parameters.AddWithValue("idRuta", idRuta);
            var rows = await cmd.ExecuteNonQueryAsync();
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

    public async Task<Vuelo> InsertVuelo(Vuelo vuelo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = CreatePostVueloCommand(conn, vuelo);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            vuelo.id_vuelo = reader.GetInt32(0);
        }
        return vuelo;
    }

    public async Task<bool> DeleteVuelo(int idVuelo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();

        // 1 - Cerrar itinerarios activos del vuelo
        await CerrarItinerariosDeVuelo(conn, idVuelo);

        // 2 - asiento_itinerario
        using (var cmd = new NpgsqlCommand(
            @"DELETE FROM asiento_itinerario 
              WHERE id_itinerario IN (
                  SELECT id_itinerario FROM itinerario WHERE id_vuelo = @idVuelo)", conn))
        {
            cmd.Parameters.AddWithValue("idVuelo", idVuelo);
            await cmd.ExecuteNonQueryAsync();
        }

        // 3 - boleto
        using (var cmd = new NpgsqlCommand(
            @"DELETE FROM boleto 
              WHERE id_itinerario IN (
                  SELECT id_itinerario FROM itinerario WHERE id_vuelo = @idVuelo)", conn))
        {
            cmd.Parameters.AddWithValue("idVuelo", idVuelo);
            await cmd.ExecuteNonQueryAsync();
        }

        // 4 - itinerario
        using (var cmd = new NpgsqlCommand(
            "DELETE FROM itinerario WHERE id_vuelo = @idVuelo", conn))
        {
            cmd.Parameters.AddWithValue("idVuelo", idVuelo);
            await cmd.ExecuteNonQueryAsync();
        }

        // 5 - vuelo
        using (var cmd = new NpgsqlCommand(
            "DELETE FROM vuelo WHERE id_vuelo = @idVuelo", conn))
        {
            cmd.Parameters.AddWithValue("idVuelo", idVuelo);
            var rows = await cmd.ExecuteNonQueryAsync();
            return rows > 0;
        }
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

    private async Task CerrarItinerariosDeRuta(NpgsqlConnection conn, int idRuta)
    {
        using var cmd = new NpgsqlCommand(
            "UPDATE itinerario SET estado = 'cerrado' " +
            "WHERE id_vuelo IN (SELECT id_vuelo FROM vuelo WHERE id_ruta = @idRuta)", conn);
        cmd.Parameters.AddWithValue("idRuta", idRuta);
        await cmd.ExecuteNonQueryAsync();
    }

    private async Task CerrarItinerariosDeVuelo(NpgsqlConnection conn, int idVuelo)
    {
        using var cmd = new NpgsqlCommand(
            "UPDATE itinerario SET estado = 'cerrado' WHERE id_vuelo = @idVuelo", conn);
        cmd.Parameters.AddWithValue("idVuelo", idVuelo);
        await cmd.ExecuteNonQueryAsync();
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
}