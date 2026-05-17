using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Services.Implementations;

public class AeropuertoService : IAeropuertoService
{
    private readonly IAeropuertoRepository _aeropuertoRepo;

    public AeropuertoService(IAeropuertoRepository aeropuertoRepo)
    {
        _aeropuertoRepo = aeropuertoRepo;
    }

    public async Task<IEnumerable<Aeropuerto>> GetAll()
    {
        return await _aeropuertoRepo.GetAll();
    }

   public async Task<IEnumerable<PuertasAeropuerto>> GetPuertas(int id_aeropuerto)
    {
        return await _aeropuertoRepo.GetPuertas(id_aeropuerto);
    }

    public async Task<IEnumerable<Avion>> GetAviones()
    {
        return await _aeropuertoRepo.GetAviones();
    }
}