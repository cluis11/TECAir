namespace TECAirAPI.Models;

public class Pasajero
{
    public string Pasaporte { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Ap1 { get; set; } = string.Empty;
    public string? Ap2 { get; set; } = string.Empty;
    public string Nacionalidad { get; set; } = string.Empty;
    public DateOnly Fecha_Nacimiento { get; set; }
}