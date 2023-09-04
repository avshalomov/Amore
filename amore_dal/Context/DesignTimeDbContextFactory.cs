using System;
using System.IO;
using amore_dal.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AmoreDbContext>
{
    public AmoreDbContext CreateDbContext(string[] args)
    {
        var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        var basePath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../amore_api"));

        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{environmentName}.json", optional: true, reloadOnChange: true)
            .AddUserSecrets("3e9aa055-40a1-415f-ac15-cec5067d1f84")  // if user secrets are specific to amore_api
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<AmoreDbContext>();
        optionsBuilder.UseMySql(configuration.GetConnectionString("amore_db_string"),
            new MySqlServerVersion(new Version(8, 0, 21)));

        return new AmoreDbContext(optionsBuilder.Options);
    }
}
