using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IPromocionRepository
{
    Task<IEnumerable<Promocion>> GetActivas(DateTime fecha);
    Task<IEnumerable<Promocion>> GetAll();
    Task<IEnumerable<Promocion>> PostPromocion(Promocion promocion);
    Task<IEnumerable<Promocion>> DeletePromocion(int id_promo);
}