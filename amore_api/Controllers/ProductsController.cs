using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.Models;
using amore_dal.DTOs;
using amore_dal.Context;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AmoreDbContext _context;

        public ProductsController(AmoreDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        // Returns all products info:
        // ProductId, ProductName, Description, Price, Category, Gender, StockQuantity, DateAdded, Picture.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Products' is null.
                    if (_context.Products == null) return NotFound("Entity set 'AmoreDbContext.Products' is null.");

                    // Get all products.
                    var products = await _context.Products.ToListAsync();
                    if (products == null) return NotFound("No products found.");

                    // Create a list of ProductDto objects.
                    var productsDto = new List<ProductDto>();
                    foreach (var product in products)
                    {
                        productsDto.Add(new ProductDto
                        {
                            ProductId = product.ProductId,
                            ProductName = product.ProductName,
                            Description = product.Description,
                            Price = product.Price,
                            Category = product.Category,
                            Gender = product.Gender,
                            StockQuantity = product.StockQuantity,
                            DateAdded = product.DateAdded,
                            Picture = product.Picture
                        });
                    }

                    // Commit transaction and return productsDto.
                    await transaction.CommitAsync();
                    return productsDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    // Rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // GET: api/Products/5
        // Returns product info by id:
        // ProductId, ProductName, Description, Price, Category, Gender, StockQuantity, DateAdded, Picture.
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Products' is null.
                    if (_context.Products == null) return NotFound("Entity set 'AmoreDbContext.Products' is null.");

                    // Get product by id.
                    var product = await _context.Products.FindAsync(id);
                    if (product == null) return NotFound($"Product with id {id} not found.");

                    // Create an ProductDto object.
                    var productDto = new ProductDto
                    {
                        ProductId = product.ProductId,
                        ProductName = product.ProductName,
                        Description = product.Description,
                        Price = product.Price,
                        Category = product.Category,
                        Gender = product.Gender,
                        StockQuantity = product.StockQuantity,
                        DateAdded = product.DateAdded,
                        Picture = product.Picture
                    };

                    // Commit transaction and return productDto.
                    await transaction.CommitAsync();
                    return productDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    // Rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // PUT: api/Products/5
        // Can update ProductName, Description, Price, Category, Gender, StockQuantity, Picture.
        // Cannot update ProductId, DateAdded.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDto productDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if product exists
                    var product = await _context.Products.FindAsync(id);
                    if (product == null) return NotFound($"Product with id {id} not found.");

                    // Validate ProductId and DateAdded
                    if (productDto.ProductId != id) return BadRequest($"Product id must be {id} not {productDto.ProductId}.");
                    if (productDto.DateAdded != product.DateAdded) return BadRequest($"DateAdded must be {product.DateAdded} not {productDto.DateAdded}.");

                    // Validate Gender
                    if (!Enum.IsDefined(typeof(Gender), productDto.Gender))
                        return BadRequest($"There are only 2 genders, 1=Male 2=Female and 0=Unisex, {productDto.Gender} is invalid.");

                    // Update the product
                    product.ProductName = productDto.ProductName;
                    product.Description = productDto.Description;
                    product.Price = productDto.Price;
                    product.Category = productDto.Category;
                    product.Gender = productDto.Gender;
                    product.StockQuantity = productDto.StockQuantity;
                    product.Picture = productDto.Picture;

                    // Save changes
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return NoContent();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }


        // POST: api/Products
        // ProductId and DateAdded are generated automatically.
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(ProductDto productDto)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check for nulls
                    if (_context.Products == null) return NotFound("Entity set 'AmoreDbContext.Products' is null.");

                    // Check if product already exists
                    var product = await _context.Products.FindAsync(productDto.ProductId);
                    if (product != null) return BadRequest($"Product with id {productDto.ProductId} already exists.");

                    // Create the product
                    var newProduct = new Product
                    {
                        ProductName = productDto.ProductName,
                        Description = productDto.Description,
                        Price = productDto.Price,
                        Category = productDto.Category,
                        Gender = productDto.Gender,
                        StockQuantity = productDto.StockQuantity,
                        DateAdded = DateTime.Now,
                        Picture = productDto.Picture
                    };
                    _context.Products.Add(newProduct);

                    // Save changes and commit transaction
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return CreatedAtAction("GetProduct", new { id = newProduct.ProductId }, newProduct);
                }
                catch (Exception ex)
                {
                transaction.Rollback();
                return Problem(ex.Message);
                }
            }
        }

        // DELETE: api/Products/5
        // Deletes a product by id
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check for nulls
                    if (_context.Products == null) return NotFound("Entity set 'AmoreDbContext.Products' is null.");

                    // Check if product exists
                    var product = await _context.Products.FindAsync(id);
                    if (product == null) return NotFound($"Product with id {id} not found.");

                    // Delete the product
                    _context.Products.Remove(product);

                    // Save changes and commit transaction
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return NoContent();
                }
                catch (Exception ex)
                {
                transaction.Rollback();
                return Problem(ex.Message);
                }
            }
        }
    }
}
