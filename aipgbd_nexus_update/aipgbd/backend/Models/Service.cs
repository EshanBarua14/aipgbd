namespace AIPGBD.Models;

public class Service
{
    public int Id { get; set; }

    public int DivisionId { get; set; }
    public Division Division { get; set; } = null!;

    public string Title       { get; set; } = string.Empty;
    public string Slug        { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon        { get; set; } = string.Empty; // emoji or icon name
    public decimal? PriceFrom { get; set; }
    public string   Currency  { get; set; } = "USD";
    public int      SortOrder { get; set; } = 0;
    public bool     IsActive  { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
