using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.DTOs;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Services.Implementations;

public class PromocionService : IPromocionService
{
    private readonly IPromocionRepository _promocionRepo;

    public PromocionService(IPromocionRepository promocionRepo)
    {
        _promocionRepo = promocionRepo;
    }

    public async Task<IEnumerable<PromocionDTO>> GetActivas(DateTime fecha)
    {
        return await _promocionRepo.GetActivas(fecha);
    }

    public async Task<IEnumerable<Promocion>> GetAll()
    {
        return await _promocionRepo.GetAll();
    }

    public async Task<Promocion> GetById(int idPromocion)
    {
        return await _promocionRepo.GetById(idPromocion);
    }

    public async Task<IEnumerable<Promocion>> CrearPromocion(Promocion promocion)
    {
        return await _promocionRepo.PostPromocion(promocion);
    }

    public async Task<Promocion> ActualizarPromocion(int idPromocion, Promocion promocion)
    {
        return await _promocionRepo.PutPromocion(idPromocion, promocion);
    }

    public async Task<IEnumerable<Promocion>> EliminarPromocion(int idPromocion)
    {
        return await _promocionRepo.DeletePromocion(idPromocion);
    }
}