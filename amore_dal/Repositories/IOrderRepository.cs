using System.Collections.Generic;
using System.Threading.Tasks;
using amore_dal.Models;
using amore_dal.DTOs;

namespace amore_dal.Repositories
{
    public interface IOrderRepository
    {
        Task<IEnumerable<OrderDto>> GetOrdersAsync();
        Task<OrderDto> GetOrderByIdAsync(int id);
        Task<bool> UpdateOrderAsync(int id, OrderDto orderDto);
        Task<Order> CreateOrderAsync(int userId);
        Task<bool> DeleteOrderAsync(int id);
    }
}
