using Microsoft.EntityFrameworkCore;
using amore_api.Models;

namespace amore_api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:3000")
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    });
            });

            // Add DbContext to the service container.
            builder.Services.AddDbContext<AmoreDbContext>(options =>
            {
                options.UseMySql(builder.Configuration.GetConnectionString("amore_db_string"),
                new MySqlServerVersion(new Version(8, 0, 21)));
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            // Apply CORS policy
            app.UseCors("AllowReactApp");

            app.MapControllers();

            app.Run();
        }
    }
}