namespace AIPGBD.Models;

[Flags]
public enum SocialPlatform
{
    None      = 0,
    Facebook  = 1,
    Instagram = 2,
    YouTube   = 4,
    LinkedIn  = 8,
}

public enum PostStatus { Draft, Scheduled, Published, Failed }

public class SocialPost
{
    public int Id { get; set; }

    public int DivisionId { get; set; }
    public Division Division { get; set; } = null!;

    public string Caption   { get; set; } = string.Empty;
    public string MediaUrl  { get; set; } = string.Empty; // S3/Azure blob URL
    public string MediaType { get; set; } = "image";       // image | video

    // Bitmask: which platforms to post to
    public SocialPlatform Platforms { get; set; } = SocialPlatform.None;

    public PostStatus  Status      { get; set; } = PostStatus.Draft;
    public DateTime?   ScheduledAt { get; set; }
    public DateTime?   PublishedAt { get; set; }

    // Platform-specific post IDs (populated after publish)
    public string? FacebookPostId  { get; set; }
    public string? InstagramPostId { get; set; }
    public string? YouTubeVideoId  { get; set; }
    public string? LinkedInPostId  { get; set; }

    public string? ErrorDetails { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
