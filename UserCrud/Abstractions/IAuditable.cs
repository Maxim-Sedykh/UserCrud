namespace UserCrud.Abstractions
{
    public interface IAuditable
    {
        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; }
    }
}
