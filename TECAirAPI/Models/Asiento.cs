namespace TECAirAPI.Models;

public class Asiento
{
    public int id_asiento { get; set;}
    public string Matricula { get; set;} = string.Empty;
    public string Fila { get; set;} = string.Empty;
    public string Columna { get; set;} = string.Empty;
}