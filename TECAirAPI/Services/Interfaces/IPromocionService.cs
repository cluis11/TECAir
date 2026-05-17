using TECAirAPI.Models;

namespace TECAirAPI.Services.Interfaces;

public interface IPromocionService
{
    Task<IEnumerable<Promocion>> GetActivas(DateTime fecha);
    Task<IEnumerable<Promocion>> GetAll();
    Task<IEnumerable<Promocion>> CrearPromocion(Promocion promocion);
    Task<IEnumerable<Promocion>> EliminarPromocion(int idPromocion);
}