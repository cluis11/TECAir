using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IPromocionRepository
{
    Task<IEnumerable<PromocionDTO>> GetActivas(DateTime fecha);
    Task<IEnumerable<Promocion>> GetAll();
    Task<Promocion> GetById(int id_promo);
    Task<IEnumerable<Promocion>> PostPromocion(Promocion promocion);
    Task<Promocion> PutPromocion(int id_promo, Promocion promocion);
    Task<IEnumerable<Promocion>> DeletePromocion(int id_promo);
}