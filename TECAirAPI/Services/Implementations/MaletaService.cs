using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.DTOs;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Services.Implementations;

public class MaletaService : IMaletaService
{
    private readonly IMaletaRepository _maletaRepo;
    private readonly IBoletoRepository _boletoRepo;

    public MaletaService(IMaletaRepository maletaRepo, IBoletoRepository boletoRepo)
    {
        _maletaRepo = maletaRepo;
        _boletoRepo = boletoRepo;
    }

    public async Task<IEnumerable<Maleta>> GetByPasaporte(string pasaporte)
    {
        return await _maletaRepo.GetByPasaporte(pasaporte);
    }

    public async Task<IEnumerable<PasajeroMaletaDTO>> GetPasajerosPorReserva(int idReserva)
    {
        return await _maletaRepo.GetPasajerosPorReserva(idReserva);
    }

    public async Task<Maleta> AsignarMaleta(Maleta maleta)
    {
        // Validar que el boleto exista y tenga ya_checkin = true
        var boletos = await _boletoRepo.GetByPasaporteCheckin(maleta.Pasaporte);
        if (boletos == null || !boletos.Any())
            return null;

        return await _maletaRepo.Insert(maleta);
    }

    public async Task<bool> EliminarMaleta(int idMaleta)
    {
        return await _maletaRepo.Delete(idMaleta);
    }
}