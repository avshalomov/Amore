using amore_dal.DTOs;

namespace amore_dal.Repositories
{
    public interface ICartItemRepository
    {
        Task<IEnumerable<CartItemDto>> GetAllCartItems();
        Task<CartItemDto> GetCartItemById(int id);
        Task AddCartItem(CartItemDto cartItemDto);
        Task UpdateCartItem(int id, CartItemDto cartItemDto);
        Task DeleteCartItem(int id);
    }
}