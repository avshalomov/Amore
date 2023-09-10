using Microsoft.AspNetCore.Mvc;
using amore_dal.Models;
using amore_dal.DTOs;
using amore_dal.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace amore_api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly LoggerService _logger;

        public OrdersController(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
            _logger = LoggerService.Instance;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            try
            {
                var orders = await _orderRepository.GetOrdersAsync();
                if (orders == null || !orders.Any())
                {
                    _logger.Log("No orders found.");
                    return NotFound("No orders found.");
                }
                return Ok(orders);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching orders: {ex.Message}");
                return BadRequest($"Error fetching orders: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            try
            {
                var order = await _orderRepository.GetOrderByIdAsync(id);
                if (order == null)
                {
                    _logger.Log($"Order with id {id} not found.");
                    return NotFound($"Order with id {id} not found.");
                }
                return Ok(order);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching order: {ex.Message}");
                return BadRequest($"Error fetching order: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrder(int id, OrderDto orderDto)
        {
            try
            {
                var result = await _orderRepository.UpdateOrderAsync(id, orderDto);
                if (result)
                {
                    _logger.Log($"Order {id} updated successfully.");
                    return NoContent();
                }
                else
                {
                    _logger.Log($"Failed to update order {id}.");
                    return BadRequest("Failed to update order.");
                }
            }
            catch (Exception ex)
            {
                _logger.Log($"Error updating order {id}: {ex.Message}");
                return BadRequest($"Error updating order: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(int userId)
        {
            try
            {
                var newOrder = await _orderRepository.CreateOrderAsync(userId);
                if (newOrder != null)
                {
                    _logger.Log($"Order created for user {userId}.");
                    return CreatedAtAction(nameof(GetOrder), new { id = newOrder.OrderId }, newOrder);
                }
                _logger.Log($"Failed to create order for user {userId}.");
                return BadRequest("Failed to create order.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error creating order for user {userId}: {ex.Message}");
                return BadRequest($"Error creating order: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            try
            {
                var result = await _orderRepository.DeleteOrderAsync(id);
                if (result)
                {
                    _logger.Log($"Order {id} deleted successfully.");
                    return NoContent();
                }
                _logger.Log($"Failed to delete order {id}.");
                return BadRequest("Failed to delete order.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error deleting order {id}: {ex.Message}");
                return BadRequest($"Error deleting order: {ex.Message}");
            }
        }
    }
}