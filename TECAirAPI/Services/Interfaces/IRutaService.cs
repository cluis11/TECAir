using TECAirAPI.Models;
using TECAirAPI.DTOs;


namespace TECAirAPI.Services.Interfaces;

public interface IRutaService
{
    Task<IEnumerable<Ruta>> GetAll();
    Task<IEnumerable<Ruta>> GetById(int idRuta);
    Task<IEnumerable<Ruta>> GetRutas(int origen, int destino);
    Task<Ruta> CrearRuta(Ruta ruta);
    Task<Ruta> ActualizarRuta(int id_ruta, Ruta ruta);
    Task<bool> EliminarRuta(int idRuta);
    Task<IEnumerable<Vuelo>> GetVuelo(int idVuelo);
    Task<IEnumerable<RutaResultadoDTO>> GetAllParaPromo();
}