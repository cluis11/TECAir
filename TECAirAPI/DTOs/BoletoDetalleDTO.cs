namespace TECAirAPI.DTOs;

public class BoletoDetalleDTO
{
    public int idBoleto { get; set; }
    public string Pasaporte { get; set; } = string.Empty;
    public string NombrePasajero { get; set; } = string.Empty;
    public int idItinerario { get; set; }
    public string CiudadOrigen { get; set; } = string.Empty;
    public string CiudadDestino { get; set; } = string.Empty;
    public TimeSpan Salida { get; set; }
    public int? idAsiento { get; set; }
    public string Fila { get; set; } = string.Empty;
    public string Columna { get; set; } = string.Empty;
    public string PuertaEmbarque { get; set; } = string.Empty;
    public bool YaCheckin { get; set; }
}