using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Interfaces;

public interface IItinerarioService
{
    Task<IEnumerable<BusquedaResultadoDTO>> BuscarItinerarios(int origen, int destino, DateOnly fecha, int pasajeros);
    Task<IEnumerable<AsientoDTO>> GetAsientos(int id);
    Task<IEnumerable<Itinerario>> Abrir(ItinerarioDTO dto);
    Task Cerrar(int id);
}