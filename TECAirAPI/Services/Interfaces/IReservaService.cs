using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Interfaces;

public interface IReservaService
{
    Task<Reserva> CrearReserva(CrearReservaDTO reserva);
    Task<Reserva> ObtenerReserva(int id);
    Task<IEnumerable<Reserva>> ObtenerPorUsuario(int idUsuario);
}