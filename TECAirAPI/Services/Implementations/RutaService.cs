using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.DTOs;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Services.Implementations;

public class RutaService : IRutaService
{
    private readonly IRutaRepository _rutaRepo;

    public RutaService(IRutaRepository rutaRepo)
    {
        _rutaRepo = rutaRepo;
    }

    public async Task<IEnumerable<Ruta>> GetAll() => await _rutaRepo.GetAll();
    public async Task<IEnumerable<Ruta>> GetById(int idRuta) => await _rutaRepo.GetById(idRuta);
    public async Task<IEnumerable<Ruta>> GetRutas(int origen, int destino) => await _rutaRepo.GetRutas(origen, destino);
    public async Task<IEnumerable<RutaResultadoDTO>> GetAllParaPromo() => await _rutaRepo.GetAllParaPromo();
    public async Task<Ruta> CrearRuta(Ruta ruta) => await _rutaRepo.PostRuta(ruta);
    public async Task<Ruta> ActualizarRuta(int id_ruta, Ruta ruta) => await _rutaRepo.PutRuta(id_ruta, ruta);
    public async Task<IEnumerable<Vuelo>> GetVuelo(int idVuelo) => await _rutaRepo.GetVuelo(idVuelo);

    public async Task<bool> EliminarRuta(int idRuta)
    {
        return await _rutaRepo.DeleteRuta(idRuta);
    }

    public async Task<Vuelo> AgregarVuelo(int idRuta, Vuelo vuelo)
    {
        vuelo.id_ruta = idRuta;
        return await _rutaRepo.InsertVuelo(vuelo);
    }

    public async Task<bool> EliminarVuelo(int idVuelo)
    {
        var vuelos = await _rutaRepo.GetVuelo(idVuelo);
        var vuelo = vuelos.FirstOrDefault();
        if (vuelo == null) return false;
        return await _rutaRepo.DeleteVuelo(idVuelo);
    }
}