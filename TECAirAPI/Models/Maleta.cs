namespace TECAirAPI.Models;

public class Maleta
{
    public int IdMaleta { get; set; }
    public string Pasaporte { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public double Peso { get; set; }
}