namespace UserCrud.Dtos
{
    public sealed class PagedResult<T>
    {
        public IEnumerable<T> Items { get; init; } = Enumerable.Empty<T>();
        public int TotalCount { get; init; }
    }
}
