using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Implementations;

public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepo;

    public ReservaService(IReservaRepository reservaRepo)
    {
        _reservaRepo = reservaRepo;
    }

    public async Task<Reserva> CrearReserva(CrearReservaDTO reserva)
    {
        return await _reservaRepo.PostReserva(reserva);
    }

    public async Task<Reserva> ObtenerReserva(int id)
    {
        return await _reservaRepo.GetById(id);
    }

    public async Task<IEnumerable<Reserva>> ObtenerPorUsuario(int idUsuario)
    {
        return await _reservaRepo.GetByUsuario(idUsuario);
    }

    public async Task<bool> PagarReserva(int idReserva)
    {
        return await _reservaRepo.PagarReserva(idReserva);
    }

    public async Task<bool> CancelarReserva(int idReserva)
    {
        return await _reservaRepo.CancelarReserva(idReserva);
    }
}