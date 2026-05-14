namespace TECAirAPI.Models;

public class Usuario
{
    public int IdUser { get; set; }
    public string Correo { get; set; } = string.Empty;
    public string Contrasena { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Ap1 { get; set; } = string.Empty;
    public string? Ap2 { get; set; }
    public string Telefono { get; set; } = string.Empty;
}