namespace AIPGBD.Models;

public class Division
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;   // "Studios" | "Systems"
    public string Slug { get; set; } = string.Empty;   // "studios" | "systems"
}
