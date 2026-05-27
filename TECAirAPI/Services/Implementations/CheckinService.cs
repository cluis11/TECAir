using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Implementations;

public class CheckinService : ICheckinService
{
    private readonly IBoletoRepository _boletoRepo;

    public CheckinService(IBoletoRepository boletoRepo)
    {
        _boletoRepo = boletoRepo;
    }

    public async Task<ReservaResponseDTO> ObtenerReserva(int idReserva)
    {
        return await _boletoRepo.GetByReserva(idReserva);
    }

    public async Task<CheckinResponseDTO> HacerCheckin(int idBoleto, int idAsiento)
    {
        return await _boletoRepo.UpdateCheckin(idBoleto, idAsiento);
    }

    public async Task<PaseAbordarDTO?> ObtenerPaseAbordar(int idBoleto)
    {
        return await _boletoRepo.GetPaseAbordar(idBoleto);
    public async Task<IEnumerable<string>> GetPasajerosPorItinerario(int idItinerario)
    {
        return await _boletoRepo.GetPasajerosPorItinerario(idItinerario);
    }
}