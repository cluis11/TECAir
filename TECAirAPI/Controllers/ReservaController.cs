using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ReservaController : ControllerBase
{
     private readonly IReservaService _reservaService;

    public ReservaController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CrearReservaDTO reserva)
    {
        var result = await _reservaService.CrearReserva(reserva);
        return Ok(result);
    }

    [HttpGet("usuario/{id}")]
    public async Task<IActionResult> GetByUsuario(int id)
    {
        var result = await _reservaService.ObtenerPorUsuario(id);
        return Ok(result);
    }

    [HttpGet("reserva/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _reservaService.ObtenerReserva(id);
        return Ok(result);
    }
}