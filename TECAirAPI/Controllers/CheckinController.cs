using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class CheckinController : ControllerBase
{
    private readonly ICheckinService _checkinService;
    private readonly IPdfService _pdfService;
    private readonly IConfiguration _configuration;

    public CheckinController(ICheckinService checkinService, IPdfService pdfService, IConfiguration configuration)
    {
        _checkinService = checkinService;
        _pdfService = pdfService;
        _configuration = configuration;
    }

    [HttpGet("reserva/{idReserva}")]
    public async Task<IActionResult> GetByReserva(int idReserva)
    {
        var result = await _checkinService.ObtenerReserva(idReserva);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("itinerario/{idItinerario}")]
    public async Task<IActionResult> GetPasajerosPorItinerario(int idItinerario)
    {
        var result = await _checkintService.GetPasajerosPorItinerario(idItinerario);
        return Ok(result);
    }

    [HttpPut("{idBoleto}")]
    public async Task<IActionResult> Checkin(int idBoleto, [FromBody] CheckinRequestDTO dto)
    {
        var result = await _checkinService.HacerCheckin(idBoleto, dto.IdAsiento);
        if (result == null) return NotFound();
        return Ok(result);
    }


    // ── GET /checkin/{idBoleto}/pdf ───────────────────────────────────────
    /// <summary>
    /// Genera y descarga el PDF del pase de abordar para un boleto ya chequeado.
    /// El frontend puede llamar este endpoint para descargar, enviar por correo, etc.
    /// </summary>
    [HttpGet("{idBoleto}/pdf")]
    public async Task<IActionResult> DescargarPdf(int idBoleto)
    {
        // 1 — Obtener los datos del pase (el boleto ya debe estar chequeado)
        var pase = await _checkinService.ObtenerPaseAbordar(idBoleto);
        if (pase == null) return NotFound("Boleto no encontrado o no chequeado.");
 
        // 2 — Generar el PDF
        var pdfBytes = _pdfService.GenerarPaseAbordar(pase);
 
        // 3 — Retornar como descarga de archivo
        var nombreArchivo = $"pase_{pase.IdReserva}_{pase.Asiento}_{pase.CodigoOrigen}{pase.CodigoDestino}.pdf";
        return File(pdfBytes, "application/pdf", nombreArchivo);
    }
 
    /// <summary>
    /// Genera el PDF y lo envía mediante la API HTTP de Brevo para evitar bloqueos de puertos SMTP.
    /// </summary>
    [HttpPost("{idBoleto}/enviar-correo")]
    public async Task<IActionResult> EnviarCorreo(int idBoleto, [FromBody] EnvioCorreoDTO dto)
    {
        var pase = await _checkinService.ObtenerPaseAbordar(idBoleto);
        if (pase == null) return NotFound("Boleto no encontrado o no chequeado.");
 
        var pdfBytes = _pdfService.GenerarPaseAbordar(pase);
        string pdfBase64 = System.Convert.ToBase64String(pdfBytes);
 
        try
        {
            using (var client = new System.Net.Http.HttpClient())
            {
                // Configurar headers obligatorios para Brevo
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                
                // REEMPLAZA ESTO CON TU CLAVE LARGA DE LA PESTAÑA "CLAVES DE API"
                client.DefaultRequestHeaders.Add("api-key", _configuration["BrevoSettings:ApiKey"]);

                // Construir el JSON según la documentación oficial de Brevo v3
                var payload = new
                {
                    sender = new { name = "TECAir Airlines", email = "g.soto.1@estudiantec.cr" },
                    to = new[] { new { email = dto.Correo } },
                    subject = $"Tu pase de abordar — Vuelo {pase.NumeroVuelo}",
                    textContent = $"Hola {pase.NombreCompleto},\n\nAdjuntamos el pase de abordar oficial para tu vuelo {pase.NumeroVuelo}.\n\n¡Gracias por viajar con TECAir!",
                    attachment = new[]
                    {
                        new
                        {
                            content = pdfBase64,
                            name = $"pase_{pase.IdReserva}.pdf"
                        }
                    }
                };

                string jsonString = System.Text.Json.JsonSerializer.Serialize(payload);
                var content = new System.Net.Http.StringContent(jsonString, System.Text.Encoding.UTF8, "application/json");

                // Enviar la solicitud POST a la API REST de Brevo
                var response = await client.PostAsync("https://api.brevo.com/v3/smtp/email", content);

                if (!response.IsSuccessStatusCode)
                {
                    string errorResponse = await response.Content.ReadAsStringAsync();
                    System.Console.WriteLine($"Error devuelto por la API de Brevo: {errorResponse}");
                    return StatusCode((int)response.StatusCode, $"Brevo API Error: {errorResponse}");
                }
            }

            return Ok(new { mensaje = "Correo enviado con éxito directamente vía API de Brevo." });
        }
        catch (System.Exception ex)
        {
            System.Console.WriteLine($"Error crítico en envío por API: {ex.Message}");
            return StatusCode(500, $"Error al enviar el correo por API: {ex.Message}");
        }
    }
 
    // ── DTOs de request ───────────────────────────────────────────────────
    public record CheckinRequestDTO(int IdAsiento);
    public record EnvioCorreoDTO(string Correo, string? Telefono);
}