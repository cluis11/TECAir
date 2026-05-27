using TECAirAPI.Models;

namespace TECAirAPI.Services.Interfaces;

public interface IAeropuertoService
{

    Task<IEnumerable<Aeropuerto>> GetAll();
    Task<IEnumerable<PuertasAeropuerto>> GetPuertas(int id_aeropuerto);
    Task<IEnumerable<Avion>> GetAviones();
}