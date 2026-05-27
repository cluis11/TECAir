using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using TECAirAPI.DTOs;
using TECAirAPI.Services.Interfaces;

namespace TECAirAPI.Services.Implementations;

/// <summary>
/// Implementación de IPdfService usando QuestPDF (licencia gratuita para comunidad).
/// Instalar: dotnet add package QuestPDF
/// </summary>
public class PdfService : IPdfService
{
    public PdfService()
    {
        // Licencia comunitaria gratuita — obligatorio declararlo
        QuestPDF.Settings.License = LicenseType.Community;
    }

    /// <summary>
    /// Genera un PDF de pase de abordar profesional y retorna los bytes.
    /// </summary>
    public byte[] GenerarPaseAbordar(PaseAbordarDTO dto)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                // ── Configuración de página ──────────────────────────
                page.Size(PageSizes.A5.Landscape());
                page.Margin(0);
                page.DefaultTextStyle(x => x.FontFamily("Arial"));

                page.Content().Column(col =>
                {
                    // ══════════════════════════════════════════════════
                    // BANDA SUPERIOR AZUL — Header
                    // ══════════════════════════════════════════════════
                    col.Item().Background("#0d6efd").Padding(20).Row(header =>
                    {
                        // Logo / nombre aerolínea
                        header.RelativeItem().Column(left =>
                        {
                            left.Item()
                                .Text("AIRTec")
                                .FontSize(28).Bold().FontColor("#FFFFFF");

                            left.Item()
                                .Text("PASE DE ABORDAR  /  BOARDING PASS")
                                .FontSize(9).FontColor("#BBDEFB").LetterSpacing(1);
                        });

                        // Número de reserva
                        header.ConstantItem(140).AlignRight().Column(right =>
                        {
                            right.Item()
                                .Text($"Reserva #{dto.IdReserva}")
                                .FontSize(11).Bold().FontColor("#FFFFFF");

                            right.Item()
                                .Text($"Boleto #{dto.IdBoleto}")
                                .FontSize(9).FontColor("#BBDEFB");
                        });
                    });

                    // ══════════════════════════════════════════════════
                    // CUERPO PRINCIPAL
                    // ══════════════════════════════════════════════════
                    col.Item().Background("#FFFFFF").Padding(20).Row(body =>
                    {
                        // ── Sección izquierda (info principal) ────────
                        body.RelativeItem(3).Column(left =>
                        {
                            // Ruta: ORIGEN → DESTINO grande
                            left.Item().Row(ruta =>
                            {
                                ruta.RelativeItem().Column(orig =>
                                {
                                    orig.Item().Text(dto.CodigoOrigen)
                                        .FontSize(36).Bold().FontColor("#0d6efd");
                                    orig.Item().Text(dto.CiudadOrigen)
                                        .FontSize(10).FontColor("#64748B");
                                });

                                ruta.ConstantItem(40).AlignCenter().AlignMiddle()
                                    .Text("→").FontSize(22).FontColor("#94A3B8");

                                ruta.RelativeItem().Column(dest =>
                                {
                                    dest.Item().Text(dto.CodigoDestino)
                                        .FontSize(36).Bold().FontColor("#0d6efd");
                                    dest.Item().Text(dto.CiudadDestino)
                                        .FontSize(10).FontColor("#64748B");
                                });
                            });

                            left.Item().PaddingTop(16).Row(datos =>
                            {
                                // Pasajero
                                datos.RelativeItem().Column(p =>
                                {
                                    p.Item().Text("PASAJERO").FontSize(7).FontColor("#94A3B8").Bold();
                                    p.Item().Text(dto.NombreCompleto).FontSize(12).Bold().FontColor("#1E293B");
                                    p.Item().Text(dto.Pasaporte).FontSize(9).FontColor("#64748B");
                                });
                            });

                            left.Item().PaddingTop(14).Row(info =>
                            {
                                // Vuelo
                                DataCell(info, "VUELO",     dto.NumeroVuelo);
                                DataCell(info, "FECHA",     dto.Fecha);
                                DataCell(info, "CLASE",     dto.Clase);
                            });
                        });

                        // ── Línea de corte punteada ───────────────────
                        body.ConstantItem(1).Background("#CBD5E1");

                        // ── Sección derecha (asiento + puerta) ────────
                        body.ConstantItem(150).Padding(16).Background("#F8FAFC").Column(right =>
                        {
                            right.Item().AlignCenter().Text("ASIENTO").FontSize(8).FontColor("#94A3B8").Bold();
                            right.Item().AlignCenter().Text(dto.Asiento)
                                .FontSize(48).Bold().FontColor("#0d6efd");

                            right.Item().PaddingTop(12).AlignCenter().Text("PUERTA").FontSize(8).FontColor("#94A3B8").Bold();
                            right.Item().AlignCenter().Text(dto.PuertaEmbarque)
                                .FontSize(28).Bold().FontColor("#1E293B");

                            right.Item().PaddingTop(12).Row(horas =>
                            {
                                horas.RelativeItem().Column(s =>
                                {
                                    s.Item().AlignCenter().Text("SALIDA").FontSize(7).FontColor("#94A3B8").Bold();
                                    s.Item().AlignCenter().Text(dto.HoraSalida).FontSize(14).Bold().FontColor("#10B981");
                                });
                                horas.RelativeItem().Column(l =>
                                {
                                    l.Item().AlignCenter().Text("LLEGADA").FontSize(7).FontColor("#94A3B8").Bold();
                                    l.Item().AlignCenter().Text(dto.HoraLlegada).FontSize(14).Bold().FontColor("#64748B");
                                });
                            });
                        });
                    });

                    // ══════════════════════════════════════════════════
                    // BANDA INFERIOR — Código de barras simulado + nota
                    // ══════════════════════════════════════════════════
                    col.Item().Background("#1E293B").Padding(12).Row(footer =>
                    {
                        footer.RelativeItem().AlignCenter().Text(
                            $"{dto.IdReserva:D6}-{dto.Asiento}-{dto.CodigoOrigen}{dto.CodigoDestino}"
                        ).FontFamily("Courier New").FontSize(14).FontColor("#FFFFFF").LetterSpacing(4);
                    });
                });
            });
        });

        return document.GeneratePdf();
    }

    // ── Helper para celdas de datos pequeñas ──────────────────────────────
    private static void DataCell(RowDescriptor row, string label, string value)
    {
        row.RelativeItem().Column(c =>
        {
            c.Item().Text(label).FontSize(7).FontColor("#94A3B8").Bold();
            c.Item().Text(value).FontSize(12).Bold().FontColor("#1E293B");
        });
    }
}