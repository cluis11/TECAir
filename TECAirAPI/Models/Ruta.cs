namespace TECAirAPI.Models;

public class Ruta
{
    public int id_ruta { get; set; }
    public int id_origen { get; set; }
    public int id_destino { get; set; }
    public float precio { get; set; }

    // Necesario para la respuesta JSON
    public List<Vuelo> vuelos { get; set; } = new List<Vuelo>();
}