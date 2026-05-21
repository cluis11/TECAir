using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.DTOs;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ItinerarioController: ControllerBase
{
    private readonly IItinerarioService _itinerarioService;

    public ItinerarioController(IItinerarioService itinerarioService)
    {
        _itinerarioService = itinerarioService;
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> Buscar(int idOrigen, int idDestino, DateOnly fecha, int pasajeros)
    {
        var result = await _itinerarioService.BuscarItinerarios(idOrigen, idDestino, fecha, pasajeros);
        return Ok(result);
    }

    [HttpGet("asiento/{id}")]
    public async Task<IActionResult> GetAsientos(int id)
    {
        var result = await _itinerarioService.GetAsientos(id);
        return Ok(result);
    }

    [HttpPost("abrir")]
    public async Task<IActionResult> Post([FromBody] ItinerarioDTO itinerario)
    {
        var result = await _itinerarioService.Abrir(itinerario);
        return Ok(result);
    }

    [HttpPut("cerrar/{id}")]
    public async Task<IActionResult> Put(int id)
    {
        await _itinerarioService.Cerrar(id);
        return Ok(new { mensaje = "Itinerario cerrado correctamente." });
    }
}