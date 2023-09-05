using Microsoft.AspNetCore.Mvc;
using amore_dal.Repositories;
using amore_dal.Models;
using amore_dal.DTOs;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _productRepository.GetProductsAsync();
            if (products == null)
            {
                return NotFound("No products found.");
            }
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound($"Product with id {id} not found.");
            }
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDto productDto)
        {
            var result = await _productRepository.UpdateProductAsync(id, productDto);
            if (result)
            {
                return NoContent();
            }
            return BadRequest("Failed to update product.");
        }

        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(ProductDto productDto)
        {
            var product = await _productRepository.AddProductAsync(productDto);
            if (product != null)
            {
                return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);
            }
            return BadRequest("Failed to add product.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _productRepository.DeleteProductAsync(id);
            if (result)
            {
                return NoContent();
            }
            return BadRequest("Failed to delete product.");
        }
    }
}
