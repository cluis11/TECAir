namespace TECAirAPI.Models;

public class Estudiante
{
    public int IdUsuario { get; set; }
    public string Carnet { get; set; } = string.Empty;
    public string Universidad { get; set; } = string.Empty;
    public float Millas { get; set; }
}