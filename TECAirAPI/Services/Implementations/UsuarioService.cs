using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Models;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Services.Implementations;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepo;

    public UsuarioService(IUsuarioRepository usuarioRepo)
    {
        _usuarioRepo = usuarioRepo;
    }

    public async Task<IEnumerable<Usuario>> GetAll()
    {
        return await _usuarioRepo.GetAll();
    }

    public async Task<Usuario?> GetById(int id)
    {
        return await _usuarioRepo.GetById(id);
    }

    public async Task<Usuario?> Login(string correo, string contrasena)
    {
        var usuario = await _usuarioRepo.GetByCorreo(correo);
        if (usuario == null || usuario.Contrasena != contrasena) return null;
        return usuario;
    }

    public async Task<Usuario> CrearUsuario(Usuario usuario, Estudiante? estudiante)
    {
        if (await _usuarioRepo.ExisteCorreo(usuario.Correo))
            throw new InvalidOperationException("El correo ya está registrado.");

        if (await _usuarioRepo.ExisteTelefono(usuario.Telefono))
            throw new InvalidOperationException("El teléfono ya está registrado.");

        await _usuarioRepo.Insert(usuario);

        if (estudiante != null)
        {
            estudiante.IdUsuario = usuario.IdUser;
            await _usuarioRepo.InsertEstudiante(estudiante);
        }

        return usuario;
    }

    public async Task<bool> ActualizarUsuario(Usuario usuario)
    {
        var existente = await _usuarioRepo.GetById(usuario.IdUser);
        if (existente == null) return false;

        if (existente.Correo != usuario.Correo && await _usuarioRepo.ExisteCorreo(usuario.Correo))
            throw new InvalidOperationException("El correo ya está en uso.");

        if (existente.Telefono != usuario.Telefono && await _usuarioRepo.ExisteTelefono(usuario.Telefono))
            throw new InvalidOperationException("El teléfono ya está en uso.");

        usuario.Nombre = existente.Nombre;
        usuario.Ap1 = existente.Ap1;
        usuario.Ap2 = existente.Ap2;

        return await _usuarioRepo.Update(usuario);
    }

    public async Task<bool> EliminarUsuario(int id)
    {
        return await _usuarioRepo.Delete(id);
    }

    public async Task<bool> ActualizarEstudiante(Estudiante estudiante)
    {
        var existente = await _usuarioRepo.GetEstudiante(estudiante.IdUsuario);
        if (existente == null) return false;

        if (existente.Universidad != estudiante.Universidad && existente.Carnet == estudiante.Carnet)
            throw new InvalidOperationException("Si cambia la universidad debe cambiar el carnet.");

        return await _usuarioRepo.UpdateEstudiante(estudiante);
    }

    public async Task<bool> AgregarMillas(int idUsuario, float millas)
    {
        return await _usuarioRepo.AgregarMillas(idUsuario, millas);
    }
}