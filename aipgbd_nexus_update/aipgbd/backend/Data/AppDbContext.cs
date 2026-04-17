using Microsoft.EntityFrameworkCore;
using AIPGBD.Models;

namespace AIPGBD.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Division>   Divisions   { get; set; }
    public DbSet<Portfolio>  Portfolios  { get; set; }
    public DbSet<Service>    Services    { get; set; }
    public DbSet<Lead>       Leads       { get; set; }
    public DbSet<SocialPost> SocialPosts { get; set; }

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Seed divisions
        b.Entity<Division>().HasData(
            new Division { Id = 1, Name = "Studios", Slug = "studios" },
            new Division { Id = 2, Name = "Systems", Slug = "systems" }
        );

        b.Entity<Portfolio>()
            .HasIndex(p => new { p.DivisionId, p.Slug }).IsUnique();

        b.Entity<SocialPost>()
            .Property(p => p.Platforms)
            .HasConversion<int>();

        b.Entity<Lead>()
            .Property(l => l.Status)
            .HasConversion<string>();
    }
}
