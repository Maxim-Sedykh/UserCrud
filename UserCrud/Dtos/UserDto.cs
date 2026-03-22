namespace UserCrud.Dtos
{
    public sealed class UserDto
    {
        public int Id { get; init; }
        public string Login { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public bool IsActive { get; init; }
    }
}
