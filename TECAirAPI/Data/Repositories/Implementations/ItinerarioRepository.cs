using Npgsql;
using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Implementations;

public class ItinerarioRepository : IItinerarioRepository
{
    private readonly DBConnection _db;
    private readonly IRutaService _rutaService;
    private readonly IAeropuertoService _aeropuertoService;

    public ItinerarioRepository(DBConnection db, IRutaService rutaService, IAeropuertoService aeropuertoService)
    {
        _db = db;
        _rutaService = rutaService;
        _aeropuertoService = aeropuertoService;
    }

    public async Task<IEnumerable<BusquedaResultadoDTO>> Buscar(int origen, int destino, DateOnly fecha, int pasajeros)
    {
        var rutas = await _rutaService.GetRutas(origen, destino);
        var resultados = new List<BusquedaResultadoDTO>();
        var aeropuertos = (await _aeropuertoService.GetAll()).ToList();
        
        foreach (var ruta in rutas)
        {
            var vuelosItinerario = await GetVuelosItinerario(ruta, fecha, aeropuertos);
            if (!vuelosItinerario.Any()) continue;

            var aeropuertoOrigen = aeropuertos.FirstOrDefault(a => a.id_aeropuerto == ruta.id_origen);
            var aeropuertoDestino = aeropuertos.FirstOrDefault(a => a.id_aeropuerto == ruta.id_destino);

            if (ruta.vuelos.Count == 1)
            {
                foreach (var vuelo in vuelosItinerario)
                {
                    if (vuelo.AsientosLibres < pasajeros) continue;
                    resultados.Add(new BusquedaResultadoDTO
                    {
                        Ruta = new RutaResultadoDTO
                        {
                            IdRuta = ruta.id_ruta,
                            CiudadOrigen = aeropuertoOrigen?.Ciudad ?? "",
                            CiudadDestino = aeropuertoDestino?.Ciudad ?? "",
                            Precio = (decimal)ruta.precio
                        },
                        Vuelos = new List<VueloItinerarioDTO> { vuelo }
                    });
                }
            }
            else
            {
                if (vuelosItinerario.Any(v => v.AsientosLibres < pasajeros)) continue;
                resultados.Add(new BusquedaResultadoDTO
                {
                    Ruta = new RutaResultadoDTO
                    {
                        IdRuta = ruta.id_ruta,
                        CiudadOrigen = aeropuertoOrigen?.Ciudad ?? "",
                        CiudadDestino = aeropuertoDestino?.Ciudad ?? "",
                        Precio = (decimal)ruta.precio
                    },
                    Vuelos = vuelosItinerario
                });
            }
        }
        return resultados;
    }

    public async Task<Itinerario> GetById(int idItinerario)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM itinerario WHERE id_itinerario = @idItinerario", conn);
        cmd.Parameters.AddWithValue("idItinerario", idItinerario);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync()) return MapItinerario(reader);
        return null;
    }

    public async Task<Itinerario> GetByVuelo(int idVuelo)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT * FROM itinerario WHERE id_vuelo = @idVuelo AND estado = 'abierto'", conn);
        cmd.Parameters.AddWithValue("idVuelo", idVuelo);
        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync()) return MapItinerario(reader);
        return null;
    }

    public async Task CerrarItinerario(int id)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "UPDATE itinerario SET estado = 'cerrado' WHERE id_itinerario = @id", conn);
        cmd.Parameters.AddWithValue("id", id);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task CerrarPorRuta(int idRuta)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "UPDATE itinerario SET estado = 'cerrado' " +
            "WHERE id_vuelo IN (SELECT id_vuelo FROM vuelo WHERE id_ruta = @idRuta)", conn);
        cmd.Parameters.AddWithValue("idRuta", idRuta);
        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<IEnumerable<AsientoDTO>> GetAsientos(int id)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(
            "SELECT ai.id_asiento, a.fila, a.columna, ai.estado " +
            "FROM asiento_itinerario ai LEFT JOIN asiento a ON ai.id_asiento = a.id_asiento " +
            "WHERE ai.id_itinerario = @id", conn);
        cmd.Parameters.AddWithValue("id", id);
        using var reader = await cmd.ExecuteReaderAsync();
        var asientos = new List<AsientoDTO>();
        while (await reader.ReadAsync())
        {
            asientos.Add(MapAsiento(reader));
        }
        return asientos;
    }

    public async Task<IEnumerable<Itinerario>> AbrirVuelos(ItinerarioDTO dto)
    {
        var itinerariosCreados = new List<Itinerario>();

        foreach (var vuelo in dto.Vuelos)
        {
            int idItinerario;
            string matricula;

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                idItinerario = await CreatePostItinerarioCommand(conn, vuelo);
            }

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                using var cmd = new NpgsqlCommand(
                    "SELECT matricula FROM vuelo WHERE id_vuelo = @idVuelo", conn);
                cmd.Parameters.AddWithValue("idVuelo", vuelo.IdVuelo);
                matricula = (string)await cmd.ExecuteScalarAsync();
            }

            using (var conn = _db.GetConnection())
            {
                await conn.OpenAsync();
                await CreatePostAsientoCommand(conn, idItinerario, matricula);
            }

            itinerariosCreados.Add(new Itinerario
            {
                id_itinerario   = idItinerario,
                id_vuelo        = vuelo.IdVuelo,
                fecha           = vuelo.Fecha,
                salida          = vuelo.Salida.ToTimeSpan(),
                llegada         = vuelo.Llegada.ToTimeSpan(),
                puerta_embarque = vuelo.PuertaEmbarque,
                estado          = "abierto"
            });
        }
        return itinerariosCreados;
    }

    public async Task<ResumenCierreDTO> GetResumenCierre(int idItinerario)
    {
        using var conn = _db.GetConnection();
        await conn.OpenAsync();

        // Info del itinerario
        using var cmdInfo = new NpgsqlCommand(
            @"SELECT i.id_itinerario, ao.ciudad, ad.ciudad, i.fecha, i.salida
              FROM itinerario i
              JOIN vuelo v ON v.id_vuelo = i.id_vuelo
              JOIN aeropuerto ao ON ao.id_aeropuerto = v.id_origen
              JOIN aeropuerto ad ON ad.id_aeropuerto = v.id_destino
              WHERE i.id_itinerario = @id", conn);
        cmdInfo.Parameters.AddWithValue("id", idItinerario);
        using var readerInfo = await cmdInfo.ExecuteReaderAsync();
        if (!await readerInfo.ReadAsync()) return null;

        var resumen = new ResumenCierreDTO
        {
            IdItinerario  = readerInfo.GetInt32(0),
            CiudadOrigen  = readerInfo.GetString(1),
            CiudadDestino = readerInfo.GetString(2),
            Fecha         = readerInfo.GetDateTime(3).ToString("yyyy-MM-dd"),
            Salida        = readerInfo.GetTimeSpan(4).ToString(@"hh\:mm")
        };
        await readerInfo.CloseAsync();

        // Pasajeros chequeados con cantidad de maletas por boleto
        using var cmdPax = new NpgsqlCommand(
            @"SELECT p.pasaporte, p.nombre || ' ' || p.ap1,
                     COUNT(m.id_maleta) AS cant_maletas
              FROM boleto b
              JOIN pasajero p ON p.pasaporte = b.id_pasajero
              LEFT JOIN maleta m ON m.id_boleto = b.id_boleto
              WHERE b.id_itinerario = @id AND b.ya_checkin = true
              GROUP BY p.pasaporte, p.nombre, p.ap1", conn);
        cmdPax.Parameters.AddWithValue("id", idItinerario);
        using var readerPax = await cmdPax.ExecuteReaderAsync();

        while (await readerPax.ReadAsync())
        {
            resumen.Pasajeros.Add(new PasajeroResumenDTO
            {
                Pasaporte       = readerPax.GetString(0),
                Nombre          = readerPax.GetString(1),
                CantidadMaletas = (int)readerPax.GetInt64(2)
            });
        }

        resumen.TotalPasajeros = resumen.Pasajeros.Count;
        resumen.TotalMaletas   = resumen.Pasajeros.Sum(p => p.CantidadMaletas);
        return resumen;
    }

    //----------------------------------------------
    // Parte Interna
    //----------------------------------------------

    private async Task<List<VueloItinerarioDTO>> GetVuelosItinerario(Ruta ruta, DateOnly fecha, List<Aeropuerto> aeropuertos)
    {
        var resultado = new List<VueloItinerarioDTO>();

        foreach (var vuelo in ruta.vuelos)
        {
            using var conn = _db.GetConnection();
            await conn.OpenAsync();
            using var cmd = new NpgsqlCommand(
                "SELECT i.id_itinerario, i.id_vuelo, i.fecha, i.salida, i.llegada, i.puerta_embarque, i.estado, " +
                "COUNT(CASE WHEN ai.estado = 'libre' THEN 1 END) AS asientos_libres " +
                "FROM itinerario i LEFT JOIN asiento_itinerario ai ON ai.id_itinerario = i.id_itinerario " +
                "WHERE i.id_vuelo = @idVuelo AND i.fecha = @fecha AND i.estado = 'abierto' " +
                "GROUP BY i.id_itinerario", conn);
            cmd.Parameters.AddWithValue("idVuelo", vuelo.id_vuelo);
            cmd.Parameters.AddWithValue("fecha", fecha);

            using var reader = await cmd.ExecuteReaderAsync();
            var aeropuertoOrigen = aeropuertos.FirstOrDefault(a => a.id_aeropuerto == vuelo.id_origen);
            var aeropuertoDestino = aeropuertos.FirstOrDefault(a => a.id_aeropuerto == vuelo.id_destino);

            bool tieneItinerario = false;
            while (await reader.ReadAsync())
            {
                tieneItinerario = true;
                resultado.Add(new VueloItinerarioDTO
                {
                    idItinerario   = reader.GetInt32(0),
                    idVuelo        = reader.GetInt32(1),
                    Fecha          = DateOnly.FromDateTime(reader.GetDateTime(2)),
                    Salida         = reader.GetTimeSpan(3),
                    Llegada        = reader.GetTimeSpan(4),
                    PuertaEmbarque = reader.GetString(5),
                    CiudadOrigen   = aeropuertoOrigen?.Ciudad ?? "",
                    CiudadDestino  = aeropuertoDestino?.Ciudad ?? "",
                    AsientosLibres = reader.GetInt32(7),
                });
            }
            if (!tieneItinerario) return new List<VueloItinerarioDTO>();
        }
        return resultado;
    }

    private Itinerario MapItinerario(NpgsqlDataReader reader)
    {
        return new Itinerario
        {
            id_itinerario   = reader.GetInt32(0),
            id_vuelo        = reader.GetInt32(1),
            fecha           = DateOnly.FromDateTime(reader.GetDateTime(2)),
            salida          = reader.GetTimeSpan(3),
            llegada         = reader.GetTimeSpan(4),
            puerta_embarque = reader.GetString(5),
            estado          = reader.GetString(6)
        };
    }

    private AsientoDTO MapAsiento(NpgsqlDataReader reader)
    {
        return new AsientoDTO
        {
            id_asiento = reader.GetInt32(0),
            fila       = reader.GetString(1),
            columna    = reader.GetString(2),
            estado     = reader.GetString(3),
        };
    }

    private async Task<int> CreatePostItinerarioCommand(NpgsqlConnection conn, VueloAperturaDTO vuelo)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque, estado) " +
            "VALUES (@idVuelo, @fecha, @salida, @llegada, @puerta, 'abierto') " +
            "RETURNING id_itinerario", conn);
        cmd.Parameters.AddWithValue("idVuelo", vuelo.IdVuelo);
        cmd.Parameters.AddWithValue("fecha", vuelo.Fecha);
        cmd.Parameters.AddWithValue("salida", vuelo.Salida.ToTimeSpan());
        cmd.Parameters.AddWithValue("llegada", vuelo.Llegada.ToTimeSpan());
        cmd.Parameters.AddWithValue("puerta", vuelo.PuertaEmbarque);
        return (int)await cmd.ExecuteScalarAsync();
    }

    private async Task CreatePostAsientoCommand(NpgsqlConnection conn, int id, string matricula)
    {
        var cmd = new NpgsqlCommand(
            "INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado) " +
            "SELECT id_asiento, @idItinerario, 'libre' FROM asiento WHERE matricula = @matricula", conn);
        cmd.Parameters.AddWithValue("idItinerario", id);
        cmd.Parameters.AddWithValue("matricula", matricula);
        await cmd.ExecuteNonQueryAsync();
    }
}