using Npgsql;

namespace TECAirAPI.Data.Connection;

public class DBConnection
{
    private readonly string _connectionString;

    public DBConnection(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    public NpgsqlConnection GetConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }
}