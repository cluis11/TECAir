using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IBoletoRepository
{
    Task<ReservaResponseDTO> GetByReserva(int idReserva);
    Task<CheckinResponseDTO> UpdateCheckin(int idBoleto, int idAsiento);
    Task<IEnumerable<string>> GetByPasaporteCheckin(string pasaporte);
    Task<PaseAbordarDTO?> GetPaseAbordar(int idBoleto);
    Task<IEnumerable<string>> GetPasajerosPorItinerario(int idItinerario);
}