using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Interfaces;

public interface IPromocionService
{
    Task<IEnumerable<PromocionDTO>> GetActivas(DateTime fecha);
    Task<IEnumerable<Promocion>> GetAll();
    Task<Promocion> GetById(int idPromocion);
    Task<IEnumerable<Promocion>> CrearPromocion(Promocion promocion);
    Task<Promocion> ActualizarPromocion(int idPromocion, Promocion promocion);
    Task<IEnumerable<Promocion>> EliminarPromocion(int idPromocion);
}