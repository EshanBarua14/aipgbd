using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using AIPGBD.Data;
using AIPGBD.Models;

namespace AIPGBD.Services;

public class SocialMediaService
{
    private readonly AppDbContext   _db;
    private readonly IConfiguration _cfg;
    private readonly HttpClient     _http;
    private readonly ILogger<SocialMediaService> _log;

    public SocialMediaService(
        AppDbContext db,
        IConfiguration cfg,
        IHttpClientFactory factory,
        ILogger<SocialMediaService> log)
    {
        _db   = db;
        _cfg  = cfg;
        _http = factory.CreateClient("social");
        _log  = log;
    }

    // ─── Schedule or publish immediately ──────────────────────────────────────

    public async Task<SocialPost> ScheduleAsync(SocialPost post)
    {
        post.Status    = post.ScheduledAt.HasValue ? PostStatus.Scheduled : PostStatus.Draft;
        post.CreatedAt = DateTime.UtcNow;
        post.UpdatedAt = DateTime.UtcNow;
        _db.SocialPosts.Add(post);
        await _db.SaveChangesAsync();

        if (post.ScheduledAt.HasValue)
        {
            // Hangfire delayed job — fires at ScheduledAt
            BackgroundJob.Schedule<SocialMediaService>(
                s => s.PublishAsync(post.Id),
                post.ScheduledAt.Value - DateTime.UtcNow
            );
        }

        return post;
    }

    public async Task PublishNowAsync(int postId)
    {
        var post = await _db.SocialPosts.FindAsync(postId)
            ?? throw new Exception($"Post {postId} not found");

        post.ScheduledAt = null;
        await _db.SaveChangesAsync();
        await PublishAsync(postId);
    }

    // ─── Core publish method (called by Hangfire) ─────────────────────────────

    [AutomaticRetry(Attempts = 2)]
    public async Task PublishAsync(int postId)
    {
        var post = await _db.SocialPosts.FindAsync(postId)
            ?? throw new Exception($"Post {postId} not found");

        post.Status    = PostStatus.Published;
        post.UpdatedAt = DateTime.UtcNow;

        var tasks = new List<Task>();

        if (post.Platforms.HasFlag(SocialPlatform.Facebook))
            tasks.Add(PostToFacebookAsync(post));

        if (post.Platforms.HasFlag(SocialPlatform.Instagram))
            tasks.Add(PostToInstagramAsync(post));

        if (post.Platforms.HasFlag(SocialPlatform.YouTube))
            tasks.Add(PostToYouTubeAsync(post));

        if (post.Platforms.HasFlag(SocialPlatform.LinkedIn))
            tasks.Add(PostToLinkedInAsync(post));

        try
        {
            await Task.WhenAll(tasks);
            post.PublishedAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            post.Status       = PostStatus.Failed;
            post.ErrorDetails = ex.Message;
            _log.LogError(ex, "Publish failed for post {Id}", postId);
        }

        await _db.SaveChangesAsync();
    }

    // ─── Facebook Graph API ───────────────────────────────────────────────────

    private async Task PostToFacebookAsync(SocialPost post)
    {
        var token   = _cfg["Social:Facebook:PageAccessToken"]!;
        var pageId  = _cfg["Social:Facebook:PageId"]!;

        var payload = new Dictionary<string, string>
        {
            ["message"]      = post.Caption,
            ["access_token"] = token,
        };

        if (!string.IsNullOrEmpty(post.MediaUrl))
            payload["link"] = post.MediaUrl;

        var res = await _http.PostAsync(
            $"https://graph.facebook.com/v19.0/{pageId}/feed",
            new FormUrlEncodedContent(payload));

        res.EnsureSuccessStatusCode();
        var json = await JsonDocument.ParseAsync(await res.Content.ReadAsStreamAsync());
        post.FacebookPostId = json.RootElement.GetProperty("id").GetString();
    }

    // ─── Instagram (2-step container flow) ───────────────────────────────────

    private async Task PostToInstagramAsync(SocialPost post)
    {
        var token     = _cfg["Social:Instagram:AccessToken"]!;
        var accountId = _cfg["Social:Instagram:AccountId"]!;

        // Step 1 – create media container
        var containerPayload = new Dictionary<string, string>
        {
            ["caption"]      = post.Caption,
            ["access_token"] = token,
        };

        if (post.MediaType == "video")
        {
            containerPayload["media_type"] = "REELS";
            containerPayload["video_url"]  = post.MediaUrl;
        }
        else
        {
            containerPayload["image_url"] = post.MediaUrl;
        }

        var containerRes = await _http.PostAsync(
            $"https://graph.facebook.com/v19.0/{accountId}/media",
            new FormUrlEncodedContent(containerPayload));

        containerRes.EnsureSuccessStatusCode();
        var containerJson = await JsonDocument.ParseAsync(
            await containerRes.Content.ReadAsStreamAsync());
        var containerId = containerJson.RootElement.GetProperty("id").GetString();

        // Step 2 – publish container
        var publishRes = await _http.PostAsync(
            $"https://graph.facebook.com/v19.0/{accountId}/media_publish",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["creation_id"]  = containerId!,
                ["access_token"] = token,
            }));

        publishRes.EnsureSuccessStatusCode();
        var publishJson = await JsonDocument.ParseAsync(
            await publishRes.Content.ReadAsStreamAsync());
        post.InstagramPostId = publishJson.RootElement.GetProperty("id").GetString();
    }

    // ─── YouTube Data API v3 (resumable upload) ───────────────────────────────

    private async Task PostToYouTubeAsync(SocialPost post)
    {
        if (post.MediaType != "video") return; // YouTube = video only

        var accessToken = _cfg["Social:YouTube:AccessToken"]!;

        var metadata = JsonSerializer.Serialize(new
        {
            snippet = new
            {
                title       = post.Caption[..Math.Min(100, post.Caption.Length)],
                description = post.Caption,
                categoryId  = "22",
            },
            status = new { privacyStatus = "public" }
        });

        // Initiate resumable upload session
        var initReq = new HttpRequestMessage(
            HttpMethod.Post,
            "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status");

        initReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        initReq.Headers.Add("X-Upload-Content-Type", "video/*");
        initReq.Content = new StringContent(metadata, Encoding.UTF8, "application/json");

        var initRes = await _http.SendAsync(initReq);
        initRes.EnsureSuccessStatusCode();

        var uploadUrl = initRes.Headers.Location!.ToString();

        // Fetch video bytes from MediaUrl and upload
        var videoBytes = await _http.GetByteArrayAsync(post.MediaUrl);
        var uploadRes  = await _http.PutAsync(uploadUrl,
            new ByteArrayContent(videoBytes));

        uploadRes.EnsureSuccessStatusCode();
        var ytJson = await JsonDocument.ParseAsync(
            await uploadRes.Content.ReadAsStreamAsync());
        post.YouTubeVideoId = ytJson.RootElement.GetProperty("id").GetString();
    }

    // ─── LinkedIn UGC Post API ────────────────────────────────────────────────

    private async Task PostToLinkedInAsync(SocialPost post)
    {
        var token  = _cfg["Social:LinkedIn:AccessToken"]!;
        var author = _cfg["Social:LinkedIn:PersonUrn"]!; // urn:li:person:XXXXX

        var body = new
        {
            author        = author,
            lifecycleState = "PUBLISHED",
            specificContent = new
            {
                com_linkedin_ugc_ShareContent = new
                {
                    shareCommentary = new { text = post.Caption },
                    shareMediaCategory = string.IsNullOrEmpty(post.MediaUrl) ? "NONE" : "IMAGE",
                    media = string.IsNullOrEmpty(post.MediaUrl)
                        ? Array.Empty<object>()
                        : new object[]
                        {
                            new
                            {
                                status       = "READY",
                                originalUrl  = post.MediaUrl,
                                description  = new { text = post.Caption[..Math.Min(200, post.Caption.Length)] },
                            }
                        }
                }
            },
            visibility = new
            {
                com_linkedin_ugc_MemberNetworkVisibility = "PUBLIC"
            }
        };

        var req = new HttpRequestMessage(HttpMethod.Post,
            "https://api.linkedin.com/v2/ugcPosts");
        req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        req.Content = new StringContent(
            JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var res = await _http.SendAsync(req);
        res.EnsureSuccessStatusCode();

        // LinkedIn returns post ID in X-RestLi-Id header
        post.LinkedInPostId = res.Headers.TryGetValues("X-RestLi-Id", out var vals)
            ? vals.FirstOrDefault()
            : null;
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    public async Task DeleteAsync(int postId)
    {
        var post = await _db.SocialPosts.FindAsync(postId);
        if (post == null) return;
        _db.SocialPosts.Remove(post);
        await _db.SaveChangesAsync();
    }

    // ─── Queue listing ────────────────────────────────────────────────────────

    public Task<List<SocialPost>> GetQueueAsync(int? divisionId = null)
    {
        var q = _db.SocialPosts
            .Include(p => p.Division)
            .OrderByDescending(p => p.CreatedAt)
            .AsQueryable();

        if (divisionId.HasValue)
            q = q.Where(p => p.DivisionId == divisionId.Value);

        return q.ToListAsync();
    }
}
