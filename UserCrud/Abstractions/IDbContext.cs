using Microsoft.EntityFrameworkCore;
using UserCrud.Models;

namespace UserCrud.Abstractions
{
    public interface IDbContext
    {
        DbSet<User> Users { get; }

        Task<int> SaveChangesAsync(CancellationToken ct = default);
    }
}
