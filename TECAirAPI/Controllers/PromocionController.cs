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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _promocionService.GetById(id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Crear(Promocion promocion)
    {
        var result = await _promocionService.CrearPromocion(promocion);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, Promocion promocion)
    {
        var result = await _promocionService.ActualizarPromocion(id, promocion);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var result = await _promocionService.EliminarPromocion(id);
        return Ok(result);
    }
}