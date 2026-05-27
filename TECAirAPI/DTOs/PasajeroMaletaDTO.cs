namespace TECAirAPI.DTOs;

public class PasajeroMaletaDTO
{
    public string Pasaporte { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Ap1 { get; set; } = string.Empty;
    public int IdItinerario { get; set; }
    public int IdBoleto { get; set; }
    public List<MaletaDTO> Maletas { get; set; } = new();
}

public class MaletaDTO
{
    public int IdMaleta { get; set; }
    public string Color { get; set; } = string.Empty;
    public double Peso { get; set; }
}