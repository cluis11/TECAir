using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IMaletaRepository
{
    Task<IEnumerable<Maleta>> GetByPasaporte(string pasaporte);
    Task<IEnumerable<PasajeroMaletaDTO>> GetPasajerosPorReserva(int idReserva);
    Task<Maleta> Insert(Maleta maleta);
    Task<bool> Delete(int idMaleta);
}