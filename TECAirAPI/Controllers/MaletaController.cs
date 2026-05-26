using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class MaletaController : ControllerBase
{
    private readonly IMaletaService _maletaService;

    public MaletaController(IMaletaService maletaService)
    {
        _maletaService = maletaService;
    }

    [HttpGet("pasajero/{pasaporte}")]
    public async Task<IActionResult> GetByPasaporte(string pasaporte)
    {
        var result = await _maletaService.GetByPasaporte(pasaporte);
        return Ok(result);
    }

    [HttpGet("reserva/{idReserva}")]
    public async Task<IActionResult> GetPasajerosPorReserva(int idReserva)
    {
        var result = await _maletaService.GetPasajerosPorReserva(idReserva);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Maleta maleta)
    {
        var result = await _maletaService.AsignarMaleta(maleta);
        if (result == null) return BadRequest("El pasajero no ha realizado check-in.");
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _maletaService.EliminarMaleta(id);
        if (!result) return NotFound("Maleta no encontrada.");
        return Ok();
    }
}