namespace TECAirAPI.Models;

public class Itinerario
{
    public int id_itinerario { get; set; }
    public int id_vuelo { get; set; }
    public DateOnly fecha { get; set; }
    public TimeSpan salida { get; set; }
    public TimeSpan llegada { get; set; }
    public string puerta_embarque { get; set; } = string.Empty;
    public string estado { get; set; }
}