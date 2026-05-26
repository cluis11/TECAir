namespace TECAirAPI.DTOs;

public class ResumenCierreDTO
{
    public int IdItinerario { get; set; }
    public string CiudadOrigen { get; set; } = string.Empty;
    public string CiudadDestino { get; set; } = string.Empty;
    public string Fecha { get; set; } = string.Empty;
    public string Salida { get; set; } = string.Empty;
    public int TotalPasajeros { get; set; }
    public int TotalMaletas { get; set; }
    public List<PasajeroResumenDTO> Pasajeros { get; set; } = new();
}

public class PasajeroResumenDTO
{
    public string Nombre { get; set; } = string.Empty;
    public string Pasaporte { get; set; } = string.Empty;
    public int CantidadMaletas { get; set; }
}