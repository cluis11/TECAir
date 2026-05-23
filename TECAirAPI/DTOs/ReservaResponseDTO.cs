namespace TECAirAPI.DTOs;

public class ReservaResponseDTO
{
    public int idReserva { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateOnly Fecha { get; set; }
    public string PasaporteTitular { get; set; } = string.Empty;
    public List<BoletoDetalleDTO> Boletos { get; set; }
}