using amore_dal.Models;
using amore_dal.DTOs;

namespace amore_dal.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<ProductDto>> GetProductsAsync();
        Task<ProductDto> GetProductByIdAsync(int id);
        Task<bool> UpdateProductAsync(int id, ProductDto productDto);
        Task<Product> AddProductAsync(ProductDto productDto);
        Task<bool> DeleteProductAsync(int id);
    }
}
