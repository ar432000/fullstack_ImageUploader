using ImageApi.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ImageApi.Data
{
    public class ImageDbContext: DbContext
    {
        public ImageDbContext(DbContextOptions<ImageDbContext> options) : base(options)
        {
        }

        public DbSet<ImageEntity> Images { get; set; } = null!; //  null! is called the null-forgiving operator. It tells the compiler:“I know this value is currently null, but I guarantee it will be set before it’s used, so don’t warn me about possible null reference errors.”

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ImageEntity>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).IsRequired();
                entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.ContentType).HasMaxLength(50);
                entity.Property(e => e.Data).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
            });
        }
    }
}
