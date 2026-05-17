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

// Aerpuerto
builder.Services.AddScoped<IAeropuertoRepository, AeropuertoRepository>();
builder.Services.AddScoped<IAeropuertoService, AeropuertoService>();

// Promocion
builder.Services.AddScoped<IPromocionRepository, PromocionRepository>();
builder.Services.AddScoped<IPromocionService, PromocionService>();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();