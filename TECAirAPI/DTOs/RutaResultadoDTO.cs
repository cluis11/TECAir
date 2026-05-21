namespace TECAirAPI.DTOs;

public class RutaResultadoDTO
{
    public int IdRuta { get; set; }
    public string CiudadOrigen { get; set; } = string.Empty;
    public string CiudadDestino { get; set; } = string.Empty;
    public decimal Precio { get; set; }
}