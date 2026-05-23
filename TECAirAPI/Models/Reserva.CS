namespace TECAirAPI.Models;

public class Reserva
{
    public int id_reserva { get; set; }
    public int id_user { get; set; }
    public string pasaporte_titular { get; set; }
    public DateOnly fecha { get; set; }
}