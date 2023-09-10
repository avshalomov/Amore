using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.DTOs;
using amore_dal.Context;
using Microsoft.AspNetCore.Authorization;

namespace amore_api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly AmoreDbContext _context;
        private readonly LoggerService _logger;

        public OrderItemsController(AmoreDbContext context)
        {
            _context = context;
            _logger = LoggerService.Instance;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemDto>>> GetOrderItems()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (_context.OrderItems == null)
                    {
                        _logger.Log("Entity set 'AmoreDbContext.OrderItems' is null.");
                        return NotFound("Entity set 'AmoreDbContext.OrderItems' is null.");
                    }

                    var orderItems = await _context.OrderItems.ToListAsync();
                    if (orderItems == null || !orderItems.Any())
                    {
                        _logger.Log("No order items found.");
                        return NotFound("No order items found.");
                    }

                    var orderItemsDto = new List<OrderItemDto>();
                    foreach (var orderItem in orderItems)
                    {
                        orderItemsDto.Add(new OrderItemDto
                        {
                            OrderItemId = orderItem.OrderItemId,
                            OrderId = orderItem.OrderId,
                            ProductId = orderItem.ProductId,
                            Quantity = orderItem.Quantity,
                        });
                    }

                    await transaction.CommitAsync();
                    return Ok(orderItemsDto);
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching order items: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemDto>> GetOrderItem(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (_context.OrderItems == null)
                    {
                        _logger.Log("Entity set 'AmoreDbContext.OrderItems' is null.");
                        return NotFound("Entity set 'AmoreDbContext.OrderItems' is null.");
                    }

                    var orderItem = await _context.OrderItems.FindAsync(id);
                    if (orderItem == null)
                    {
                        _logger.Log($"No order item found with id {id}.");
                        return NotFound($"No order item found with id {id}.");
                    }

                    var orderItemDto = new OrderItemDto
                    {
                        OrderItemId = orderItem.OrderItemId,
                        OrderId = orderItem.OrderId,
                        ProductId = orderItem.ProductId,
                        Quantity = orderItem.Quantity,
                    };

                    await transaction.CommitAsync();
                    return Ok(orderItemDto);
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching order item with id {id}: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }
    }
}