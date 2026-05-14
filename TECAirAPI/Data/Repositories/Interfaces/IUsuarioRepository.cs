using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IUsuarioRepository
{
    Task<IEnumerable<Usuario>> GetAll();
    Task<Usuario?> GetById(int id);
    Task<Usuario?> GetByCorreo(string correo);
    Task<bool> ExisteCorreo(string correo);
    Task<bool> ExisteTelefono(string telefono);
    Task Insert(Usuario usuario);
    Task<bool> Update(Usuario usuario);
    Task<bool> Delete(int id);
    Task<Estudiante?> GetEstudiante(int idUsuario);
    Task InsertEstudiante(Estudiante estudiante);
    Task<bool> UpdateEstudiante(Estudiante estudiante);
    Task<bool> AgregarMillas(int idUsuario, float millas);
}