using Microsoft.EntityFrameworkCore;
using amore_dal.Models;
using amore_dal.DTOs;
using amore_dal.Context;
using Microsoft.Extensions.Logging;

namespace amore_dal.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AmoreDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        public OrderRepository(AmoreDbContext context, ILogger<UserRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersAsync()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {

                    // Get all orders.
                    var orders = await _context.Orders.ToListAsync();
                    if (orders == null) return null;

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
                    _logger.LogError($"An error occurred: {ex.Message}", ex);
                }
            }
            return null;
        }

        public async Task<OrderDto> GetOrderByIdAsync(int id)
        {

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {

                    // get order by id.
                    var order = await _context.Orders.FindAsync(id);
                    if (order == null) return null;

                    // create an orderdto object.
                    var orderDto = new OrderDto
                    {
                        OrderId = order.OrderId,
                        UserId = order.UserId,
                        OrderDate = order.OrderDate,
                        Status = order.Status
                    };

                    // commit transaction and return orderdto.
                    await transaction.CommitAsync();
                    return orderDto;
                }
                catch (Exception ex) // catch any exception.
                {
                    // rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    _logger.LogError($"An error occurred: {ex.Message}", ex);
                }
            }
            return null;
        }

        public async Task<bool> UpdateOrderAsync(int id, OrderDto orderDto)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check for nulls
                    if (orderDto == null) return false;


                    // Get the order
                    var order = await _context.Orders.FindAsync(id);
                    if (order == null) return false;


                    // Update the status and save changes
                    order.Status = ValidateStatus(order.Status, orderDto.Status);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    return true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    _logger.LogError($"An error occurred: {ex.Message}", ex);
                }
            }
            return false;
        }


        public async Task<Order> CreateOrderAsync(int userId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check for nulls
                    if (userId == 0) return null;


                    // Get the user's cart
                    var cart = await _context.Carts
                        .Include(c => c.CartItems)
                        .FirstOrDefaultAsync(c => c.UserId == userId);
                    if (cart == null) return null;

                    // Check if the cart is empty
                    if (cart.CartItems.Count == 0) return null;


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
                    return order;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    _logger.LogError($"An error occurred: {ex.Message}", ex);
                }
            }
            return null;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {

                    // Get the order
                    var order = await _context.Orders
                        .Include(o => o.OrderItems)
                        .FirstOrDefaultAsync(o => o.OrderId == id);
                    if (order == null) return false;

                    // Delete the order items
                    _context.OrderItems.RemoveRange(order.OrderItems);



                    // Delete the order
                    _context.Orders.Remove(order);
                    await _context.SaveChangesAsync();


                    // Commit the transaction and return true
                    transaction.Commit();
                    return true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    _logger.LogError($"An error occurred: {ex.Message}", ex);
                }
            }
            return false;

        }

        // Helper method to validate the status
        private OrderStatus ValidateStatus(OrderStatus original, OrderStatus dto)
        {
            switch (original)
            {
                case OrderStatus.Processing:
                    if (dto == OrderStatus.Shipped || dto == OrderStatus.Delivered || dto == OrderStatus.Canceled)
                        return dto;
                    break;

                case OrderStatus.Shipped:
                    if (dto == OrderStatus.Delivered || dto == OrderStatus.Canceled)
                        return dto;
                    break;

                case OrderStatus.Delivered:
                    if (dto == OrderStatus.Canceled)
                        return dto;
                    break;

                case OrderStatus.Canceled:
                    return OrderStatus.Canceled;

                default:
                    return original;
            }

            return original;
        }


    }
}