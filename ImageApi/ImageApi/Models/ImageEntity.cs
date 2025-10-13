using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ImageApi.Models
{
    public class ImageEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public byte[] Data { get; set; } = Array.Empty<byte>(); // we can simply use empty square bracket also []
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }
}
