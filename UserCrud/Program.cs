using Microsoft.EntityFrameworkCore;
using UserCrud.Abstractions;
using UserCrud.Cache;
using UserCrud.Extensions;
using UserCrud.Middlewares;
using UserCrud.Persistence;
using UserCrud.Settings;

namespace UserCrud
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.Configure<RedisSettings>(builder.Configuration.GetSection(nameof(RedisSettings)));

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddControllers();

            builder.Services.AddSwaggerConfiguration();

            builder.Services.AddScoped<ICacheService, RedisCacheService>();

            var redisConfig = builder.Configuration.GetSection(nameof(RedisSettings));
            builder.Services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConfig[nameof(RedisSettings.Url)];
                options.InstanceName = redisConfig[nameof(RedisSettings.InstanceName)];
            });

            var connectionStringPostgres = builder.Configuration.GetConnectionString("PostgreSQL");

            builder.Services.AddDbContext<AppDbContext>(optionsBuilder =>
            {
                optionsBuilder.UseNpgsql(connectionStringPostgres);
            });

            builder.Services.AddScoped<IDbContext, AppDbContext>();

            var app = builder.Build();

            app.UseSwaggerUiConfiguration();
            app.UseMiddleware<ExceptionHandlingMiddleware>();

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

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseHttpsRedirection();

            app.MapGet("/ping", () =>
            {
                return Results.Ok("pong");
            });

            app.MapGet("/cicdt", () =>
            {
                return Results.Ok("correct");
            });

            await app.ApplyDatabaseMigrationsAsync();

            app.MapControllers();

            app.Run();
        }
    }
}
