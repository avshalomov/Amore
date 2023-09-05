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
        private readonly LoggerService _logger;

        public CartsController(AmoreDbContext context)
        {
            _context = context;
            _logger = LoggerService.Instance;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartDto>>> GetCarts()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (_context.Carts == null)
                    {
                        _logger.Log("Entity set 'AmoreDbContext.Carts' is null.");
                        return NotFound("Entity set 'AmoreDbContext.Carts' is null.");
                    }

                    var carts = await _context.Carts.ToListAsync();
                    if (carts == null)
                    {
                        _logger.Log("No carts found.");
                        return NotFound("No carts found.");
                    }

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

                    await transaction.CommitAsync();
                    return Ok(cartsDto);
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching carts: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartDto>> GetCart(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (_context.Carts == null)
                    {
                        _logger.Log("Entity set 'AmoreDbContext.Carts' is null.");
                        return NotFound("Entity set 'AmoreDbContext.Carts' is null.");
                    }

                    var cart = await _context.Carts.FindAsync(id);
                    if (cart == null)
                    {
                        _logger.Log($"No cart found with id: {id}.");
                        return NotFound($"No cart found with id: {id}.");
                    }

                    var cartDto = new CartDto
                    {
                        CartId = cart.CartId,
                        UserId = cart.UserId,
                        TotalPrice = cart.TotalPrice
                    };

                    await transaction.CommitAsync();
                    return Ok(cartDto);
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching cart: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }
    }
}