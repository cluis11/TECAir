using TECAirAPI.Data.Connection;
using TECAirAPI.Data.Repositories.Interfaces;
using TECAirAPI.Data.Repositories.Implementations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<DBConnection>();
builder.Services.AddScoped<IPruebaRepository, PruebaRepository>();

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();