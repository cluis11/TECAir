using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Implementations;

public class AeropuertoRepository : IAeropuertoRepository
{
    private readonly DBConnection _db;

    public AeropuertoRepository(DBConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Aeropuerto>> GetAll()
    {
        var aeropuertos = new List<Aeropuerto>();

        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand("SELECT * FROM aeropuerto", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            aeropuertos.Add(MapAeropuerto(reader));
        }
        return aeropuertos;
    }

    public async Task <IEnumerable<PuertasAeropuerto>> GetPuertas(int idAeropuerto)
    {
        var puertas = new List<PuertasAeropuerto>();

        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM puertas_aeropuerto AS p WHERE p.id_aeropuerto = @id", conn);
        cmd.Parameters.AddWithValue("id", idAeropuerto);
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            puertas.Add(MapPuerta(reader));
        }
        return puertas;
    }

    public async Task<IEnumerable<Avion>> GetAviones()
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM avion", conn);
        using var reader = await cmd.ExecuteReaderAsync();
        var aviones = new List<Avion>();
        while (await reader.ReadAsync())        
        {
            aviones.Add(MapAvion(reader));
        }
        return aviones;
    }

    private static Aeropuerto MapAeropuerto(NpgsqlDataReader reader)
    {
        return new Aeropuerto
        {
            idAeropuerto = reader.GetInt32(0),
            Nombre = reader.GetString(1),
            Codigo = reader.GetString(2),
            Ciudad = reader.GetString(3),
            Pais = reader.GetString(4)
        };
    }

    private PuertasAeropuerto MapPuerta(NpgsqlDataReader reader)
    {
        return new PuertasAeropuerto
        {
            id_aeropuerto = reader.GetInt32(0),
            PuertaEmbarque = reader.GetString(1)
        };
    }

    private static Avion MapAvion(NpgsqlDataReader reader)
    {
        return new Avion
        {
            Matricula = reader.GetString(0),
            Capacidad = reader.GetInt32(1)
        };
    }
}