using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Data.Repositories.Interfaces;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class PruebaController : ControllerBase
{
    private readonly IPruebaRepository _pruebaRepository;

    public PruebaController(IPruebaRepository pruebaRepository)
    {
        _pruebaRepository = pruebaRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _pruebaRepository.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _pruebaRepository.GetById(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] PruebaRequest request)
    {
        await _pruebaRepository.Insert(request.Nombre, request.Descripcion);
        return Created("", null);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PruebaRequest request)
    {
        var updated = await _pruebaRepository.Update(id, request.Nombre, request.Descripcion);
        if (!updated) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _pruebaRepository.Delete(id);
        if (!deleted) return NotFound();
        return Ok();
    }
}

public record PruebaRequest(string Nombre, string Descripcion);