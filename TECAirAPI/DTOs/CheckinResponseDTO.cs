namespace TECAirAPI.DTOs;

public class CheckinResponseDTO
{
    public int idBoleto { get; set; }
    public bool YaCheckin { get; set; }
    public string Fila { get; set; } = string.Empty;
    public string Columna { get; set; } = string.Empty;
    public string PuertaEmbarque { get; set; } = string.Empty;
    public string Salida { get; set; } = string.Empty;
}