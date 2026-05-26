using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Implementations;

public class ItinerarioService : IItinerarioService
{
    private readonly IItinerarioRepository _itinerarioRepo;

    public ItinerarioService(IItinerarioRepository itinerarioRepo)
    {
        _itinerarioRepo = itinerarioRepo;
    }

    public async Task<IEnumerable<BusquedaResultadoDTO>> BuscarItinerarios(int origen, int destino, DateOnly fecha, int pasajeros)
    {
        return await _itinerarioRepo.Buscar(origen, destino, fecha, pasajeros);
    }

    public async Task<IEnumerable<AsientoDTO>> GetAsientos(int id)
    {
        return await _itinerarioRepo.GetAsientos(id);
    }

    public async Task<IEnumerable<Itinerario>> Abrir(ItinerarioDTO dto)
    {
        return await _itinerarioRepo.AbrirVuelos(dto);
    }

    public async Task Cerrar(int id)
    {
        await _itinerarioRepo.CerrarItinerario(id);
    }

    public async Task<ResumenCierreDTO> GetResumenCierre(int idItinerario)
    {
        return await _itinerarioRepo.GetResumenCierre(idItinerario);
    }
}