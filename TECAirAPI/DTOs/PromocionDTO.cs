namespace TECAirAPI.DTOs;

public class PromocionDTO
{
    public int IdPromo { get; set; }
    public int IdRuta { get; set; }
    public string CiudadOrigen { get; set; } = string.Empty;
    public string CiudadDestino { get; set; } = string.Empty;
    public decimal PrecioOriginal { get; set; }
    public decimal PrecioPromocion { get; set; }
    public decimal Porcentaje { get; set; }
    public DateTime Inicio { get; set; }
    public DateTime Fin { get; set; }
    public string? Imagen { get; set; }
}