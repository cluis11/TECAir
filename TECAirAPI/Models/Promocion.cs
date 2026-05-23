namespace TECAirAPI.Models;

public class Promocion
{
    public int id_promo { get; set; }
    public int id_ruta { get; set; }
    public decimal porcentaje { get; set; }
    public DateTime inicio { get; set; }
    public DateTime fin { get; set; }
    public string? imagen { get; set; }
}