using Microsoft.AspNetCore.Mvc;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuarioController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _usuarioService.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _usuarioService.GetById(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _usuarioService.Login(request.Correo, request.Contrasena);
        if (result == null) return Unauthorized();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearUsuarioRequest request)
    {
        try
        {
            var usuario = new Usuario
            {
                Correo = request.Correo,
                Contrasena = request.Contrasena,
                Nombre = request.Nombre,
                Ap1 = request.Ap1,
                Ap2 = request.Ap2,
                Telefono = request.Telefono
            };

            Estudiante? estudiante = null;
            if (request.EsEstudiante && request.Estudiante != null)
            {
                estudiante = new Estudiante
                {
                    Carnet = request.Estudiante.Carnet,
                    Universidad = request.Estudiante.Universidad
                };
            }

            var result = await _usuarioService.CrearUsuario(usuario, estudiante);
            return Created("", result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarUsuarioRequest request)
    {
        try
        {
            var usuario = new Usuario
            {
                IdUser = id,
                Correo = request.Correo,
                Telefono = request.Telefono,
                Contrasena = request.Contrasena
            };

            var result = await _usuarioService.ActualizarUsuario(usuario);
            if (!result) return NotFound();
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/estudiante")]
    public async Task<IActionResult> ActualizarEstudiante(int id, [FromBody] EstudianteRequest request)
    {
        try
        {
            var estudiante = new Estudiante
            {
                IdUsuario = id,
                Carnet = request.Carnet,
                Universidad = request.Universidad
            };

            var result = await _usuarioService.ActualizarEstudiante(estudiante);
            if (!result) return NotFound();
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/millas")]
    public async Task<IActionResult> AgregarMillas(int id, [FromBody] MillasRequest request)
    {
        var result = await _usuarioService.AgregarMillas(id, request.Millas);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        var result = await _usuarioService.EliminarUsuario(id);
        if (!result) return NotFound();
        return Ok();
    }
}

public record LoginRequest(string Correo, string Contrasena);
public record EstudianteRequest(string Carnet, string Universidad);
public record MillasRequest(float Millas);
public record CrearUsuarioRequest(
    string Correo,
    string Contrasena,
    string Nombre,
    string Ap1,
    string? Ap2,
    string Telefono,
    bool EsEstudiante,
    EstudianteRequest? Estudiante
);
public record ActualizarUsuarioRequest(string Correo, string Telefono, string Contrasena);