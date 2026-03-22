using Microsoft.EntityFrameworkCore;
using System.Reflection;
using UserCrud.Abstractions;
using UserCrud.Models;

namespace UserCrud.Persistence
{
    public class AppDbContext : DbContext, IDbContext
    {
        public DbSet<User> Users { get; init; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
