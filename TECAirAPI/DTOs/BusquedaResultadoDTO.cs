namespace TECAirAPI.DTOs;

public class BusquedaResultadoDTO
{
    public RutaResultadoDTO Ruta { get; set; } = new();
    public List<VueloItinerarioDTO> Vuelos { get; set; } = new();
}