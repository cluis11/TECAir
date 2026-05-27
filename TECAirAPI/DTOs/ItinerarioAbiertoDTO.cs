namespace TECAirAPI.DTOs;

public class ItinerarioAbiertoDTO
{
    public int IdItinerario { get; set; }
    public string CiudadOrigen { get; set; } = string.Empty;
    public string CiudadDestino { get; set; } = string.Empty;
    public string Fecha { get; set; } = string.Empty;
    public string Salida { get; set; } = string.Empty;
    public string Llegada { get; set; } = string.Empty;
    public string PuertaEmbarque { get; set; } = string.Empty;
    public int AsientosLibres { get; set; }
}