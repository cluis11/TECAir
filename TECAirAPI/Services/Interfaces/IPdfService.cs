using TECAirAPI.DTOs;

namespace TECAirAPI.Services.Interfaces;

/// <summary>
/// Servicio para generar documentos PDF del sistema TECAir.
/// No tiene repositorio propio; es llamado por CheckinService.
/// </summary>
public interface IPdfService
{
    /// <summary>
    /// Genera un PDF de pase de abordar con los datos del check-in.
    /// </summary>
    /// <param name="dto">Datos del check-in: pasajero, asiento, puerta, vuelo, hora.</param>
    /// <returns>Arreglo de bytes del PDF generado.</returns>
    byte[] GenerarPaseAbordar(PaseAbordarDTO dto);
}