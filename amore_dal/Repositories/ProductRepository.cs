using Microsoft.EntityFrameworkCore;
using amore_dal.Models;
using amore_dal.DTOs;
using amore_dal.Context;
using Microsoft.AspNetCore.Mvc;

namespace amore_dal.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AmoreDbContext _context;

        public ProductRepository(AmoreDbContext context)
        {
            _context = context;
        }

        // ==================== CRUD OPERATIONS ====================

        public async Task<IEnumerable<ProductDto>> GetProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
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
            return productsDto;
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            return new ProductDto
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
        }

        public async Task<bool> UpdateProductAsync(int id, ProductDto productDto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;


            product.ProductName = productDto.ProductName;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.Category = productDto.Category;
            product.Gender = validateGender(productDto.Gender);
            product.StockQuantity = productDto.StockQuantity;
            product.Picture = productDto.Picture;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Product> AddProductAsync(ProductDto productDto)
        {
            

            var newProduct = new Product
            {
                ProductName = productDto.ProductName,
                Description = productDto.Description,
                Price = productDto.Price,
                Category = productDto.Category,
                Gender = validateGender(productDto.Gender),
                StockQuantity = productDto.StockQuantity,
                DateAdded = DateTime.Now,
                Picture = productDto.Picture
            };
            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();
            return newProduct;
        }


        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        // ==================== HELPER METHODS ====================

        private Gender validateGender(Gender gender)
        {
            if (!Enum.IsDefined(typeof(Gender), gender))
            {
                return Gender.Unisex;
            }
            return gender;
        }
    }
}
