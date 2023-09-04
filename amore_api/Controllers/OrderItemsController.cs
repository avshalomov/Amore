using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.DTOs;
using amore_dal.Context;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly AmoreDbContext _context;

        public OrderItemsController(AmoreDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderItems
        // Returns all order items info:
        // OrderItemId, OrderId, ProductId, Quantity.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemDto>>> GetOrderItems()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.OrderItems' is null.
                    if (_context.OrderItems == null) return NotFound("Entity set 'AmoreDbContext.OrderItems' is null.");

                    // Get all order items.
                    var orderItems = await _context.OrderItems.ToListAsync();
                    if (orderItems == null) return NotFound("No order items found.");

                    // Create a list of OrderItemDto objects.
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

                    // Commit transaction and return orderItemsDto.
                    await transaction.CommitAsync();
                    return orderItemsDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    // Rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // GET: api/OrderItems/5
        // Returns order item info by id:
        // OrderItemId, OrderId, ProductId, Quantity.
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemDto>> GetOrderItem(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.OrderItems' is null.
                    if (_context.OrderItems == null) return NotFound("Entity set 'AmoreDbContext.OrderItems' is null.");

                    // Get order item by id.
                    var orderItem = await _context.OrderItems.FindAsync(id);
                    if (orderItem == null) return NotFound($"No order item found with id {id}.");

                    // Create a OrderItemDto object.
                    var orderItemDto = new OrderItemDto
                    {
                        OrderItemId = orderItem.OrderItemId,
                        OrderId = orderItem.OrderId,
                        ProductId = orderItem.ProductId,
                        Quantity = orderItem.Quantity,
                    };

                    // Commit transaction and return orderItemDto.
                    await transaction.CommitAsync();
                    return orderItemDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    // Rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }
    }
}
