using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Interfaces;

public interface ICheckinService
{
    Task<ReservaResponseDTO> ObtenerReserva(int idReserva);
    Task<CheckinResponseDTO> HacerCheckin(int idBoleto, int idAsiento);
    Task<PaseAbordarDTO?> ObtenerPaseAbordar(int idBoleto);
}