using TECAirAPI.Models;
using TECAirAPI.DTOs;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IItinerarioRepository
{
    Task<IEnumerable<BusquedaResultadoDTO>> Buscar(int origen, int destino, DateOnly fecha, int pasajeros);
    Task<Itinerario> GetById(int idItinerario);
    Task<Itinerario> GetByVuelo(int idVuelo);
    Task CerrarItinerario(int id);
    Task CerrarPorRuta(int idRuta);
    Task<IEnumerable<AsientoDTO>> GetAsientos(int id);
    Task<IEnumerable<Itinerario>> AbrirVuelos(ItinerarioDTO dto);
    Task<ResumenCierreDTO> GetResumenCierre(int idItinerario);
}