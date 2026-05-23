namespace TECAirAPI.DTOs;

public class PasajeroReservaDTO
{
    public string Pasaporte { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Ap1 { get; set; } = string.Empty;
    public string? Ap2 { get; set; }
    public string Nacionalidad { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public List<BoletoReservaDTO> Boletos { get; set; }
}