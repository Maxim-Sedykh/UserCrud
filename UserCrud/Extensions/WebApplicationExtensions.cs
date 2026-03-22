using Microsoft.EntityFrameworkCore;
using UserCrud.Persistence;

namespace UserCrud.Extensions
{
    public static class WebApplicationExtensions
    {
        /// <summary>
        /// Настроить SwaggerUI
        /// </summary>
        /// <param name="app">Приложение</param>
        public static void UseSwaggerUiConfiguration(this WebApplication app)
        {
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "UserCrud Swagger v1.0");
                    c.SwaggerEndpoint("/swagger/v2/swagger.json", "UserCrud Swagger v2.0");
                    c.RoutePrefix = string.Empty;
                });
            }
        }

        /// <summary>
        /// Применить все миграции и настройки БД.
        /// </summary>
        /// <param name="app">Приложение</param>
        public static async Task ApplyDatabaseMigrationsAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;

            try
            {
                var context = services.GetRequiredService<AppDbContext>();

                if ((await context.Database.GetPendingMigrationsAsync()).Any())
                {
                    await context.Database.MigrateAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Error while migrating database");

                throw;
            }
        }
    }
}
