using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.Models;
using amore_dal.DTOs;
using amore_dal.Context;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AmoreDbContext _context;

        public OrdersController(AmoreDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        // Returns all orders info:
        // OrderId, UserId, OrderDate, TotalPrice, Status.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Orders' is null.
                    if (_context.Orders == null) return NotFound("Entity set 'AmoreDbContext.Orders' is null.");

                    // Get all orders.
                    var orders = await _context.Orders.ToListAsync();
                    if (orders == null) return NotFound("No orders found.");

                    // Create a list of OrderDto objects.
                    var ordersDto = new List<OrderDto>();
                    foreach (var order in orders)
                    {
                        ordersDto.Add(new OrderDto
                        {
                            OrderId = order.OrderId,
                            UserId = order.UserId,
                            OrderDate = order.OrderDate,
                            Status = order.Status
                        });
                    }

                    // Commit transaction and return ordersDto.
                    await transaction.CommitAsync();
                    return ordersDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    // Rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // GET: api/Orders/5
        // Returns order info by id:
        // OrderId, UserId, OrderDate, TotalPrice, Status.
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Orders' is null.
                    if (_context.Orders == null) return NotFound("Entity set 'AmoreDbContext.Orders' is null.");

                    // Get order by id.
                    var order = await _context.Orders.FindAsync(id);
                    if (order == null) return NotFound($"Order with id {id} not found.");

                    // Create an OrderDto object.
                    var orderDto = new OrderDto
                    {
                        OrderId = order.OrderId,
                        UserId = order.UserId,
                        OrderDate = order.OrderDate,
                        Status = order.Status
                    };

                    // Commit transaction and return orderDto.
                    await transaction.CommitAsync();
                    return orderDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    // Rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // PUT: api/Orders/5
        // Can only update the status of an order
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderDto orderDto)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check for nulls
                    if (_context.Orders == null) return NotFound("Entity set 'AmoreDbContext.Orders' is null.");
                    if (id != orderDto.OrderId) return BadRequest($"Order id must be {id} not {orderDto.OrderId}.");

                    // Get the order
                    var order = await _context.Orders.FindAsync(id);
                    if (order == null) return NotFound($"Order with id {id} not found.");

                    // Check for unallowed changes
                    if (orderDto.OrderId != order.OrderId) return BadRequest($"Order ID is fixed at {order.OrderId}, not alterable to {orderDto.OrderId}.");
                    if (orderDto.UserId != order.UserId) return BadRequest($"User ID is fixed at {order.UserId}, not alterable to {orderDto.UserId}.");
                    if (orderDto.OrderDate != order.OrderDate) return BadRequest($"Order date is fixed at {order.OrderDate}, not alterable to {orderDto.OrderDate}.");

                    // Check permissions
                    switch (order.Status)
                    {
                        // Can update to any status
                        case OrderStatus.Processing:
                            if (orderDto.Status != OrderStatus.Processing && orderDto.Status != OrderStatus.Shipped && orderDto.Status != OrderStatus.Delivered && orderDto.Status != OrderStatus.Canceled)
                                return BadRequest($"Order status {order.Status} cannot be updated to {orderDto.Status}.");
                            break;
                        // Can only update to shipped, delivered, or canceled
                        case OrderStatus.Shipped:
                            if (orderDto.Status != OrderStatus.Delivered && orderDto.Status != OrderStatus.Canceled)
                                return BadRequest($"Order status {order.Status} cannot be updated to {orderDto.Status}.");
                            break;
                        // Can only update to delivered or canceled
                        case OrderStatus.Delivered:
                            if (orderDto.Status != OrderStatus.Canceled)
                                return BadRequest($"Order status {order.Status} cannot be updated to {orderDto.Status}.");
                            break;
                        // Cannot update a canceled order
                        case OrderStatus.Canceled:
                            return BadRequest($"Cannot update a Canceled order to {orderDto.Status}.");
                        default:
                            return BadRequest($"Invalid current status {order.Status}.");
                    }

                    // Update the status and save changes
                    order.Status = orderDto.Status;
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    return NoContent();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return Problem(ex.Message);
                }
            }
        }


        // POST: api/Orders
        // Creates an order by copying the user's cart items to order items and deleting the cart items
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(int userId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check for nulls
                    if (_context.Orders == null) return NotFound("Entity set 'AmoreDbContext.Orders' is null.");
                    if (_context.OrderItems == null) return NotFound("Entity set 'AmoreDbContext.OrderItems' is null.");
                    if (_context.CartItems == null) return NotFound("Entity set 'AmoreDbContext.CartItems' is null.");
                    if (_context.Carts == null) return NotFound("Entity set 'AmoreDbContext.Cart' is null.");
                    if (!_context.Users.Any(u => u.UserId == userId)) return NotFound($"User with id {userId} not found.");

                    // Get the user's cart
                    var cart = await _context.Carts
                        .Where(c => c.UserId == userId)
                        .Include(c => c.CartItems)
                        .FirstOrDefaultAsync();
                    if (cart == null) return NotFound($"Cart for user {userId} not found.");

                    // Check if the cart is empty
                    if (cart.CartItems.Count == 0) return BadRequest($"Can't create an order if the cart for user {userId} is empty.");

                    // Create the order
                    var order = new Order
                    {
                        UserId = userId,
                        OrderDate = DateTime.Now,
                        Status = OrderStatus.Processing
                    };
                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();

                    // Create order items from cart items
                    foreach (var cartItem in cart.CartItems)
                    {
                        var orderItem = new OrderItem
                        {
                            OrderId = order.OrderId,
                            ProductId = cartItem.ProductId,
                            Quantity = cartItem.Quantity
                        };
                        _context.OrderItems.Add(orderItem);
                    }

                    // Clear the cart items and reset total price
                    _context.CartItems.RemoveRange(cart.CartItems);
                    cart.TotalPrice = 0;
                    await _context.SaveChangesAsync();

                    // Coommit the transaction and return the order
                    transaction.Commit();
                    return CreatedAtAction("GetOrder", new { id = order.OrderId }, order);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return Problem(ex.Message);
                }
            }
        }

        // DELETE: api/Orders/5
        // Deletes an order and its order items
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check for nulls
                    if (_context.Orders == null) return NotFound("Entity set 'AmoreDbContext.Orders' is null.");
                    if (_context.OrderItems == null) return NotFound("Entity set 'AmoreDbContext.OrderItems' is null.");
                    if (!_context.Orders.Any(o => o.OrderId == id)) return NotFound($"Order with id {id} not found.");

                    // Get the order
                    var order = await _context.Orders
                        .Where(o => o.OrderId == id)
                        .Include(o => o.OrderItems)
                        .FirstOrDefaultAsync();
                    if (order == null) return NotFound($"Order with id {id} not found.");

                    // Delete the order items
                    _context.OrderItems.RemoveRange(order.OrderItems);
                    await _context.SaveChangesAsync();

                    // Delete the order
                    _context.Orders.Remove(order);
                    await _context.SaveChangesAsync();

                    // Commit the transaction and return the order
                    transaction.Commit();
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
