namespace TECAirAPI.DTOs;

public class AsientoDTO
{
    public int id_asiento { get; set; }
    public string fila { get; set; } = string.Empty;
    public string columna { get; set; } = string.Empty;
    public string estado { get; set; } = string.Empty;
}