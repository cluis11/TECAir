using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class AeropuertoController : ControllerBase
{
    private readonly IAeropuertoService _aeropuertoService;

    public AeropuertoController(IAeropuertoService aeropuertoService)
    {
        _aeropuertoService = aeropuertoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _aeropuertoService.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}/puertas")]
    public async Task<IActionResult> GetPuertas(int id)
    {
        var result = await _aeropuertoService.GetPuertas(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("aviones")]
    public async Task<IActionResult> GetAviones()
    {
        var result = await _aeropuertoService.GetAviones();
        return Ok(result);
    }
}