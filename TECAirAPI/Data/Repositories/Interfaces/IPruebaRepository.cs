namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IPruebaRepository
{
    Task<IEnumerable<dynamic>> GetAll();
    Task<dynamic?> GetById(int id);
    Task Insert(string nombre, string descripcion);
    Task<bool> Update(int id, string nombre, string descripcion);
    Task<bool> Delete(int id);
}