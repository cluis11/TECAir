namespace TECAirAPI.DTOs;

public class VueloItinerarioDTO
{
    public int idItinerario { get; set; }
    public int idVuelo { get; set; }
    public string CiudadOrigen { get; set; } = string.Empty;
    public string CiudadDestino { get; set; } = string.Empty;
    public DateOnly Fecha { get; set; }
    public TimeSpan Salida { get; set; }
    public TimeSpan Llegada { get; set; }
    public string PuertaEmbarque { get; set; } = string.Empty;
    public int AsientosLibres { get; set; }
}