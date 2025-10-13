using ImageApi.Data;
using ImageApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImageApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly ImageDbContext _db;

        public ImageController(ImageDbContext db)
        {
            _db = db;
        }

        // POST api/Images/upload - uploads the image to the database
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] FileUpload? file)
        {
            if(file?.File == null || file?.File?.Length == 0)
            {
                return BadRequest(new { message= "No file uploaded" });
            }

            using var stream = new MemoryStream();
            await file.File.CopyToAsync(stream);

            var bytes = stream.ToArray();

            var image = new ImageEntity
            {
                FileName = Path.GetFileName(file.File.FileName),
                ContentType = file.File.ContentType,
                Data = bytes,
                CreatedAt = DateTime.UtcNow
            };

            _db.Images.Add(image);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = image.Id}, image);
        }

        // GET api/images/{id} - returns the binary image
        [HttpGet("getImage/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var image = await _db.Images.FindAsync(id);
            if(image == null)
            {
                return NotFound(new {message=$"image with this{id} does not exist in database"});
            }

            return File(image.Data, image.ContentType, image.FileName);
        }

        // GET api/images - returns list of images metadata
        [HttpGet("getImages")]
        public async Task<IActionResult> GetAllImages()
        {
            var list = await _db.Images
                                .AsNoTracking()
                                .Select(
                                    img => new 
                                    { 
                                        img.Id,
                                        img.FileName,
                                        img.ContentType,
                                        img.CreatedAt
                                    }
                                )
                                .OrderByDescending(img => img.CreatedAt)
                                .ToListAsync();
            return Ok(list);
        }

        [HttpDelete("delete/{id:Guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var image = await _db.Images.FindAsync(id);
            if(image == null)
            {
                return NotFound();
            }

            _db.Images.Remove(image);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
