using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Interfaces;

public interface IMaletaService
{
    Task<IEnumerable<Maleta>> GetByPasaporte(string pasaporte);
    Task<IEnumerable<PasajeroMaletaDTO>> GetPasajerosPorReserva(int idReserva);
    Task<Maleta> AsignarMaleta(Maleta maleta);
    Task<bool> EliminarMaleta(int idMaleta);
}