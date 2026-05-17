using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class RutaController : ControllerBase
{
    private readonly IRutaService _rutaService;

    public RutaController(IRutaService rutaService)
    {
        _rutaService = rutaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _rutaService.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _rutaService.GetById(id);
        return Ok(result);
    }

    [HttpGet("buscar")]
    public async Task<IActionResult> GetRutas(int origen, int destino)
    {
        var result = await _rutaService.GetRutas(origen, destino);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] Ruta ruta)
    {
        var result = await _rutaService.CrearRuta(ruta);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var result = await _rutaService.EliminarRuta(id);
        return Ok(result);
    }

    [HttpGet("vuelo/{idVuelo}")]
    public async Task<IActionResult> GetVuelo(int idVuelo)
    {
        var result = await _rutaService.GetVuelo(idVuelo);
        return Ok(result);
    }
}