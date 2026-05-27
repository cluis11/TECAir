using TECAirAPI.Models;

namespace TECAirAPI.Services.Interfaces;

public interface IUsuarioService
{
    Task<IEnumerable<Usuario>> GetAll();
    Task<Usuario?> GetById(int id);
    Task<Usuario?> Login(string correo, string contrasena);
    Task<Usuario> CrearUsuario(Usuario usuario, Estudiante? estudiante);
    Task<bool> ActualizarUsuario(Usuario usuario);
    Task<bool> EliminarUsuario(int id);
    Task<bool> ActualizarEstudiante(Estudiante estudiante);
    Task<bool> AgregarMillas(int idUsuario, float millas);
}