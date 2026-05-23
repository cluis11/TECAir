namespace TECAirAPI.DTOs;

public class CrearReservaDTO
{
    public int id_usuario { get; set; }
    public string PasaporteTitular { get; set;} = string.Empty;
    public List<PasajeroReservaDTO> Pasajeros { get; set; }
}