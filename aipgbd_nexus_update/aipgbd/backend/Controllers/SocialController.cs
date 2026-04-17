using Microsoft.AspNetCore.Mvc;
using AIPGBD.Models;
using AIPGBD.Services;

namespace AIPGBD.Controllers;

[ApiController]
[Route("api/social")]
public class SocialController : ControllerBase
{
    private readonly SocialMediaService _svc;
    public SocialController(SocialMediaService svc) => _svc = svc;

    // GET /api/social/queue?divisionId=1
    [HttpGet("queue")]
    public async Task<IActionResult> Queue([FromQuery] int? divisionId)
    {
        var posts = await _svc.GetQueueAsync(divisionId);
        return Ok(posts);
    }

    // POST /api/social/schedule
    [HttpPost("schedule")]
    public async Task<IActionResult> Schedule([FromBody] SocialPost post)
    {
        var created = await _svc.ScheduleAsync(post);
        return Ok(created);
    }

    // POST /api/social/{id}/publish-now
    [HttpPost("{id:int}/publish-now")]
    public async Task<IActionResult> PublishNow(int id)
    {
        await _svc.PublishNowAsync(id);
        return Ok(new { published = true });
    }

    // DELETE /api/social/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _svc.DeleteAsync(id);
        return NoContent();
    }
}
