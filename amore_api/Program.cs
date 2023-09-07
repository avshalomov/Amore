using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using amore_dal.Repositories;
using amore_dal.Context;
using System.Text;

namespace amore_api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configuration for accessing user secrets
            builder.Configuration.AddUserSecrets<Program>();

            // Add services to the container
            builder.Services.AddControllers();

            // Add logging for logfile
            builder.Services.AddSingleton<LoggerService>(LoggerService.Instance);

            // Add repositories
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<ICartItemRepository, CartItemRepository>();

            // Add authentication and authorization
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });

            // Add policy for Admins
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireClaim("UserRole", "Admin"));
            });

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

            // Add DbContext
            builder.Services.AddDbContext<AmoreDbContext>(options =>
            {
                options.UseMySql(builder.Configuration.GetConnectionString("amore_db_string"),
                new MySqlServerVersion(new Version(8, 0, 21)));
            });

            // Add Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                    c.RoutePrefix = string.Empty;
                });
            }

            // Redirect HTTP to HTTPS
            app.UseHttpsRedirection();

            // Add authentication and authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // Apply CORS policy
            app.UseCors("AllowReactApp");

            // Route to controllers
            app.MapControllers();

            app.Run();
        }
    }
}