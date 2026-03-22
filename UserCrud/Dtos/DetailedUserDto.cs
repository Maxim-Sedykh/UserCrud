using UserCrud.Abstractions;

namespace UserCrud.Dtos
{
    public sealed class DetailedUserDto
    {
        public int Id { get; init; }
        public string Login { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public string FirstName { get; init; } = string.Empty;
        public string LastName { get; init; } = string.Empty;
        public string Patronymic { get; init; } = string.Empty;
        public int Age { get; init; }
        public bool IsActive { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
