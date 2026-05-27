namespace TECAirAPI.DTOs;

public class ItinerarioDTO
{
    public int IdRuta { get; set; }
    public List<VueloAperturaDTO> Vuelos { get; set; }
}

public class VueloAperturaDTO
{
    public int IdVuelo { get; set; }
    public DateOnly Fecha { get; set; }
    public TimeOnly Salida { get; set; }
    public TimeOnly Llegada { get; set; }
    public string PuertaEmbarque { get; set; } = string.Empty;
}