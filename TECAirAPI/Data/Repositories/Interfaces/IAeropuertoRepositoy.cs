using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IAeropuertoRepository
{
    Task<IEnumerable<Aeropuerto>> GetAll();
    Task<IEnumerable<PuertasAeropuerto>> GetPuertas(int IdAeropuerto);
    Task<IEnumerable<Avion>> GetAviones();
}