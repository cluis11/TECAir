using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Data.Repositories.Implementations;
using TECAirAPI.Services.Interfaces;
using TECAirAPI.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<DBConnection>();
builder.Services.AddScoped<IPruebaRepository, PruebaRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

// Aeropuerto
builder.Services.AddScoped<IAeropuertoRepository, AeropuertoRepository>();
builder.Services.AddScoped<IAeropuertoService, AeropuertoService>();

// Promocion
builder.Services.AddScoped<IPromocionRepository, PromocionRepository>();
builder.Services.AddScoped<IPromocionService, PromocionService>();

// Rutas y vuelos
builder.Services.AddScoped<IRutaRepository, RutaRepository>();
builder.Services.AddScoped<IRutaService, RutaService>();

// Itinerarios
builder.Services.AddScoped<IItinerarioRepository, ItinerarioRepository>();
builder.Services.AddScoped<IItinerarioService, ItinerarioService>();

// Reservas
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<IReservaService, ReservaService>();

// Check-In
builder.Services.AddScoped<IBoletoRepository, BoletoRepository>();
builder.Services.AddScoped<ICheckinService, CheckinService>();

// PDF
builder.Services.AddScoped<IPdfService, PdfService>();

// Maletas
builder.Services.AddScoped<IMaletaRepository, MaletaRepository>();
builder.Services.AddScoped<IMaletaService, MaletaService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Crear carpeta wwwroot/imagenes si no existe
var imagenesPath = Path.Combine(app.Environment.WebRootPath ?? 
    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "imagenes");
if (!Directory.Exists(imagenesPath))
    Directory.CreateDirectory(imagenesPath);

app.UseCors("AllowAll");
app.UseStaticFiles();
app.UseHttpsRedirection();
app.MapControllers();

app.Run();