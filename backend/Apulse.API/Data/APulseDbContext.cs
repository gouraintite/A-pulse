using Apulse.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Apulse.Api.Data;

public class ApulseDbContext : DbContext
{
    public ApulseDbContext(DbContextOptions<ApulseDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(u => u.LastName).IsRequired().HasMaxLength(100);
            entity.Property(u => u.PasswordHash).IsRequired();  
            entity.Property(u => u.Role).IsRequired().HasMaxLength(20).HasDefaultValue("User");
            entity.Property(u => u.Department).HasMaxLength(100);
        });
    }
}
