namespace AIPGBD.Models;

public enum LeadStatus { New, Contacted, Qualified, Lost, Won }

public class Lead
{
    public int Id { get; set; }

    public int DivisionId { get; set; }
    public Division Division { get; set; } = null!;

    public string Name    { get; set; } = string.Empty;
    public string Email   { get; set; } = string.Empty;
    public string Phone   { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Budget  { get; set; } = string.Empty;

    public LeadStatus Status { get; set; } = LeadStatus.New;
    public string AdminNote  { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
