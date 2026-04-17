namespace AIPGBD.Models;

public class Portfolio
{
    public int Id { get; set; }

    // Which division owns this item
    public int DivisionId { get; set; }
    public Division Division { get; set; } = null!;

    public string Title       { get; set; } = string.Empty;
    public string Slug        { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ThumbnailUrl{ get; set; } = string.Empty;
    public string MediaUrl    { get; set; } = string.Empty; // video/image
    public string Tags        { get; set; } = string.Empty; // comma-separated
    public bool   IsFeatured  { get; set; } = false;
    public bool   IsPublished { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
