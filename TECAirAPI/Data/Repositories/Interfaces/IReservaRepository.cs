using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IReservaRepository
{
    Task<Reserva> PostReserva(CrearReservaDTO dto);
    Task<Reserva> GetById(int id);
    Task<IEnumerable<Reserva>> GetByUsuario(int idUsuario);
}