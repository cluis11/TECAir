namespace TECAirAPI.DTOs;

/// <summary>
/// DTO con todos los datos necesarios para generar el pase de abordar.
/// Es retornado por CheckinService.HacerCheckin() y también usado por IPdfService.
/// </summary>
public class PaseAbordarDTO
{
    // ── Datos del pasajero ──────────────────────────────────────
    public string NombreCompleto  { get; set; } = string.Empty;
    public string Pasaporte       { get; set; } = string.Empty;

    // ── Datos del vuelo ─────────────────────────────────────────
    public int    IdReserva       { get; set; }
    public int    IdBoleto        { get; set; }
    public string NumeroVuelo     { get; set; } = string.Empty;   // Ej: "TC-201"
    public string CiudadOrigen    { get; set; } = string.Empty;
    public string CiudadDestino   { get; set; } = string.Empty;
    public string CodigoOrigen    { get; set; } = string.Empty;   // IATA, ej: "SJO"
    public string CodigoDestino   { get; set; } = string.Empty;
    public string Fecha           { get; set; } = string.Empty;   // "2025-06-15"
    public string HoraSalida      { get; set; } = string.Empty;   // "08:30"
    public string HoraLlegada     { get; set; } = string.Empty;

    // ── Datos del asiento y puerta ──────────────────────────────
    public string Asiento         { get; set; } = string.Empty;   // "14A"
    public string PuertaEmbarque  { get; set; } = string.Empty;   // "B7"
    public string Clase           { get; set; } = "Económica";
}