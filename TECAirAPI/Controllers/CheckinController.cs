using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class CheckinController : ControllerBase
{
    private readonly ICheckinService _checkintService;

    public CheckinController(ICheckinService checkintService)
    {
        _checkintService = checkintService;
    }

    [HttpGet("reserva/{idReserva}")]
    public async Task<IActionResult> GetByReserva(int idReserva)
    {
        var result = await _checkintService.ObtenerReserva(idReserva);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{idBoleto}")]
    public async Task<IActionResult> Checkin(int idBoleto, [FromBody] CheckinRequestDTO dto)
    {
        var result = await _checkintService.HacerCheckin(idBoleto, dto.IdAsiento);
        if (result == null) return NotFound();
        return Ok(result);
    }

    public record CheckinRequestDTO(int IdAsiento);
}