using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class PromocionController : ControllerBase
{
    private readonly IPromocionService _promocionService;
    private readonly IWebHostEnvironment _env;

    public PromocionController(IPromocionService promocionService, IWebHostEnvironment env)
    {
        _promocionService = promocionService;
        _env = env;
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
        promocion.imagen = await GuardarImagen(promocion.imagen, 0);
        var result = await _promocionService.CrearPromocion(promocion);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, Promocion promocion)
    {
        promocion.imagen = await GuardarImagen(promocion.imagen, id);
        var result = await _promocionService.ActualizarPromocion(id, promocion);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var result = await _promocionService.EliminarPromocion(id);
        return Ok(result);
    }

    // Guarda la imagen base64 en wwwroot/imagenes y retorna la URL relativa
    private async Task<string?> GuardarImagen(string? imagenBase64, int idPromo)
    {
        if (string.IsNullOrEmpty(imagenBase64)) return null;

        // Si ya es una URL (no base64), devolverla tal cual
        if (imagenBase64.StartsWith("http") || imagenBase64.StartsWith("/imagenes"))
            return imagenBase64;

        try
        {
            // Extraer el tipo y los datos del base64
            var partes = imagenBase64.Split(',');
            var datos = partes.Length > 1 ? partes[1] : partes[0];
            var extension = "jpg";
            if (partes.Length > 1)
            {
                if (partes[0].Contains("png")) extension = "png";
                else if (partes[0].Contains("gif")) extension = "gif";
                else if (partes[0].Contains("webp")) extension = "webp";
                else if (partes[0].Contains("jpeg") || partes[0].Contains("jpg")) extension = "jpg";
            }

            var bytes = Convert.FromBase64String(datos);
            var nombreArchivo = $"promo_{idPromo}_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}.{extension.TrimStart('.').ToLower()}";

            var wwwroot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var carpeta = Path.Combine(wwwroot, "imagenes");
            if (!Directory.Exists(carpeta)) Directory.CreateDirectory(carpeta);

            var rutaCompleta = Path.Combine(carpeta, nombreArchivo);
            await System.IO.File.WriteAllBytesAsync(rutaCompleta, bytes);

            return $"/imagenes/{nombreArchivo}";
        }
        catch
        {
            return null;
        }
    }
}