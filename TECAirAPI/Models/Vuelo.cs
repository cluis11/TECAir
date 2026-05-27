namespace TECAirAPI.Models;

public class Vuelo
{
    public int id_vuelo { get; set; }
    public int id_ruta { get; set; }
    public int id_origen { get; set; }
    public int id_destino { get; set; }
    public string matricula { get; set; } = string.Empty;
}