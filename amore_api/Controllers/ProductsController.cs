using Microsoft.AspNetCore.Mvc;
using amore_dal.Repositories;
using amore_dal.Models;
using amore_dal.DTOs;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly LoggerService _logger;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
            _logger = LoggerService.Instance;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            try
            {
                var products = await _productRepository.GetProductsAsync();
                if (products == null || !products.Any())
                {
                    _logger.Log("No products found.");
                    return NotFound("No products found.");
                }
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching products: {ex.Message}");
                return BadRequest($"Error fetching products: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            try
            {
                var product = await _productRepository.GetProductByIdAsync(id);
                if (product == null)
                {
                    _logger.Log($"Product with id {id} not found.");
                    return NotFound($"Product with id {id} not found.");
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching product: {ex.Message}");
                return BadRequest($"Error fetching product: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> PutProduct(int id, ProductDto productDto)
        {
            try
            {
                var result = await _productRepository.UpdateProductAsync(id, productDto);
                if (result)
                {
                    return NoContent();
                }
                _logger.Log($"Failed to update product with id {id}.");
                return BadRequest($"Failed to update product with id {id}.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error updating product: {ex.Message}");
                return BadRequest($"Error updating product: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(ProductDto productDto)
        {
            _logger.Log("Entering PostProduct method.");
            _logger.Log(JsonConvert.SerializeObject(productDto));

            try
            {
                var product = await _productRepository.AddProductAsync(productDto);
                if (product != null)
                {
                    return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);
                }
                _logger.Log("Failed to add product.");
                return BadRequest("Failed to add product.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error adding product: {ex.Message}\n{ex.StackTrace}");
                return BadRequest($"Error adding product: {ex.Message}");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            try
            {
                var result = await _productRepository.DeleteProductAsync(id);
                if (result)
                {
                    return NoContent();
                }
                _logger.Log($"Failed to delete product with id {id}.");
                return BadRequest($"Failed to delete product with id {id}.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error deleting product: {ex.Message}");
                return BadRequest($"Error deleting product: {ex.Message}");
            }
        }
    }
}
