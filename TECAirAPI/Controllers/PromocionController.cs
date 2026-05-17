using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class PromocionController : ControllerBase
{
    private readonly IPromocionService _promocionService;

    public PromocionController(IPromocionService promocionService)
    {
        _promocionService = promocionService;
    }

    [HttpGet("activas")]
    public async Task<IActionResult> GetActivas()
    {
        var result = await _promocionService.GetActivas(DateTime.Now);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _promocionService.GetAll();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(Promocion promocion)
    {
        var result = await _promocionService.CrearPromocion(promocion);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarPromocion(int id)
    {
        var result = await _promocionService.EliminarPromocion(id);
        return Ok(result);
    }
}