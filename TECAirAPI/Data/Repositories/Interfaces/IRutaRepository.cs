using TECAirAPI.Models;

namespace TECAirAPI.Data.Repositories.Interfaces;

public interface IRutaRepository
{
    Task<IEnumerable<Ruta>> GetAll();
    Task<IEnumerable<Ruta>> GetById(int idRuta);
    Task<IEnumerable<Ruta>> GetRutas(int origen, int destino);
    Task<Ruta> PostRuta(Ruta ruta);
    Task<bool> DeleteRuta(int idRuta);
    Task<IEnumerable<Vuelo>> GetVuelo(int idVuelo);
}