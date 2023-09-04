using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.DTOs;
using amore_dal.Context;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly AmoreDbContext _context;

        public CartsController(AmoreDbContext context)
        {
            _context = context;
        }

        // GET: api/Carts
        // Returns all carts info:
        // CartId, UserId, TotalPrice.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartDto>>> GetCarts()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Carts' is null.
                    if (_context.Carts == null) return NotFound("Entity set 'AmoreDbContext.Carts' is null.");

                    // Get all carts.
                    var carts = await _context.Carts.ToListAsync();
                    if (carts == null) return NotFound("No carts found.");

                    // Create a list of CartDto objects.
                    var cartsDto = new List<CartDto>();
                    foreach (var cart in carts)
                    {
                        cartsDto.Add(new CartDto
                        {
                            CartId = cart.CartId,
                            UserId = cart.UserId,
                            TotalPrice = cart.TotalPrice
                        });
                    }

                    // Commit transaction and return cartsDto.
                    await transaction.CommitAsync();
                    return cartsDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    // Rollback transaction and return exception message.
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // GET: api/Carts/5
        [HttpGet("{id}")]
        // Returns cart info by id:
        // CartId, UserId, TotalPrice.
        public async Task<ActionResult<CartDto>> GetCart(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Carts' is null.
                    if (_context.Carts == null) return NotFound("Entity set 'AmoreDbContext.Carts' is null.");

                    // Get cart by id.
                    var cart = await _context.Carts.FindAsync(id);
                    if (cart == null) return NotFound($"No cart found with id: {id}.");

                    // Create a CartDto object.
                    var cartDto = new CartDto
                    {
                        CartId = cart.CartId,
                        UserId = cart.UserId,
                        TotalPrice = cart.TotalPrice
                    };

                    // Commit transaction and return cartDto.
                    await transaction.CommitAsync();
                    return cartDto;
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
