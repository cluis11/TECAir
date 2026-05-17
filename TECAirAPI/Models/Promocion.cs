namespace TECAirAPI.Models;

public class Promocion
{
    public int id_promo { get; set; }
    public int idRuta { get; set; }
    public decimal porcentaje { get; set; }
    public DateTime inicio { get; set; }
    public DateTime fin { get; set; }
    public string imagen { get; set; } = string.Empty;
}