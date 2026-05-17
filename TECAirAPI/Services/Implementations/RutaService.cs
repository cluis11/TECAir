using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Services.Implementations;

public class RutaService : IRutaService
{
    private readonly IRutaRepository _rutaRepo;

    public RutaService(IRutaRepository rutaRepo)
    {
        _rutaRepo = rutaRepo;
    }

    public async Task<IEnumerable<Ruta>> GetAll()
    {
        return await _rutaRepo.GetAll();
    }

    public async Task<IEnumerable<Ruta>> GetById(int idRuta)
    {
        return await _rutaRepo.GetById(idRuta);
    }

    public async Task<IEnumerable<Ruta>> GetRutas(int origen, int destino)
    {
        return await _rutaRepo.GetRutas(origen, destino);
    }

    public async Task<Ruta> CrearRuta(Ruta ruta)
    {
        return await _rutaRepo.PostRuta(ruta);
    }

    public async Task<Ruta> ActualizarRuta(int id_ruta, Ruta ruta)
    {
        return await _rutaRepo.PutRuta(id_ruta, ruta);
    }

    public async Task<bool> EliminarRuta(int idRuta)
    {
        return await _rutaRepo.DeleteRuta(idRuta);
    }

    public async Task<IEnumerable<Vuelo>> GetVuelo(int idVuelo)
    {
        return await _rutaRepo.GetVuelo(idVuelo);
    }
}