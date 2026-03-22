using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mime;
using UserCrud.Abstractions;
using UserCrud.Dtos;
using UserCrud.Models;

/// Тестовый код, особо не парился
namespace UserCrud.Controllers
{
    [Consumes(MediaTypeNames.Application.Json)]
    [Route("api/users")]
    [ApiController]
    public class UsersController(IDbContext context, ICacheService cacheService) : ControllerBase
    {
        private readonly IDbContext _context = context;
        private readonly ICacheService _cacheService = cacheService;

        [HttpGet("{id}")]
        public async Task<ActionResult<DetailedUserDto>> GetById(int id, CancellationToken ct = default)
        {
            var user = await _cacheService.GetAsync<DetailedUserDto>($"user:{id}", ct);
            if (user is not null)
                return user;

            user = await _context.Users
                .Where(x => x.Id == id)
                .Select(x => MapUserToDetailedDto(x))
                .FirstOrDefaultAsync(ct);

            if (user is null)
            {
                return NotFound();
            }

            await _cacheService.SetAsync($"user:{id}", user, ct: ct);

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateUser(CreateUpdateUserDto dto, CancellationToken ct = default)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Login == dto.Login, ct);
            if (existingUser != null)
            {
                return Conflict(new { message = "Пользователь с таким логином уже существует." });
            }

            var user = new User()
            {
                Login = dto.Login,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Patronymic = dto.Patronymic,
                Age = dto.Age,
                IsActive = true
            };

            await _context.Users.AddAsync(user, ct);

            await _context.SaveChangesAsync(ct);

            return Ok(user.Id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateRole(int id, CreateUpdateUserDto dto, CancellationToken ct = default)
        {
            var user = await _context.Users.FindAsync([id], ct);
            if (user is null)
            {
                return NotFound();
            }

            user.Login = dto.Login;
            user.Email = dto.Email;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Patronymic = dto.Patronymic;
            user.Age = dto.Age;

            await _context.SaveChangesAsync(ct);

            await _cacheService.RemoveAsync($"user:{id}", ct: ct);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRole(int id, CancellationToken ct = default)
        {
            var user = await _context.Users.FindAsync([id], ct);
            if (user is null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync(ct);

            await _cacheService.RemoveAsync($"user:{id}", ct: ct);

            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<UserDto>>> GetAll([FromQuery] Filter filter, CancellationToken ct)
        {
            if (filter.Page < 0) filter.Page = 0;
            if (filter.Limit < 1) filter.Limit = 10;

            var query = _context.Users.AsQueryable();

            var totalCount = await query.CountAsync(ct);

            var users = await query
                .OrderBy(x => x.Id)
                .Skip(filter.Page * filter.Limit)
                .Take(filter.Limit)
                .Select(x => new UserDto()
                {
                    Id = x.Id,
                    Login = x.Login,
                    Email = x.Email,
                    IsActive = x.IsActive,
                })
                .ToArrayAsync(ct);

            return Ok(new PagedResult<UserDto> { Items = users, TotalCount = totalCount });
        }

        [HttpPatch("{id}/activate")]
        public async Task<ActionResult> Activate(int id, CancellationToken ct = default)
        {
            var user = await _context.Users.FindAsync([id], ct);
            if (user is null)
            {
                return NotFound();
            }

            user.IsActive = true;

            await _context.SaveChangesAsync(ct);

            await _cacheService.RemoveAsync($"user:{id}", ct: ct);

            return NoContent();
        }

        [HttpPatch("{id}/deactivate")]
        public async Task<ActionResult> DeActivate(int id, CancellationToken ct = default)
        {
            var user = await _context.Users.FindAsync([id], ct);
            if (user is null)
            {
                return NotFound();
            }

            user.IsActive = false;

            await _context.SaveChangesAsync(ct);

            await _cacheService.RemoveAsync($"user:{id}", ct: ct);

            return NoContent();
        }

        private static DetailedUserDto MapUserToDetailedDto(User user)
        {
            return new DetailedUserDto()
            {
                Id = user.Id,
                Login = user.Login,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Patronymic = user.Patronymic,
                Age = user.Age,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
            };
        }
    }
}
