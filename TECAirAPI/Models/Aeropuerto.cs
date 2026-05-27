namespace TECAirAPI.Models;

public class Aeropuerto
{
    public int id_aeropuerto { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Pais { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
}