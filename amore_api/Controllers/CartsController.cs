using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.DTOs;
using amore_dal.Context;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

        // GET all carts
        [Authorize(Roles = "Admin")]
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

        // GET cart by id
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<CartDto>> GetCart(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    AuthorizeUserIdAndAdmin(id);

                    var cart = await _context.Carts.FindAsync(id);
                    if (cart == null)
                    {
                        _logger.Log($"No cart found with id: {id}.");
                        await transaction.RollbackAsync();
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
                catch (UnauthorizedAccessException)
                {
                    await transaction.RollbackAsync();
                    return Unauthorized("You are not authorized to access this resource.");
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching cart: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // ============================================================
        // 3 layers of nesting for the project requirements.
        // ============================================================

        // First layer of nesting
        [Authorize]
        [HttpGet("{id}/CartItems")]
        public async Task<ActionResult<IEnumerable<object>>> GetCartItems(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    AuthorizeUserIdAndAdmin(id);

                    var cartItems = await _context.Carts
                        .Where(c => c.CartId == id)
                        .SelectMany(c => c.CartItems)
                        .Join(_context.Products,
                            cartItem => cartItem.ProductId,
                            product => product.ProductId,
                            (cartItem, product) => new
                            {
                                cartItem.CartItemId,
                                product.ProductId,
                                product.ProductName,
                                product.Price,
                                cartItem.Quantity,
                                TotalPrice = cartItem.Quantity * product.Price,
                                product.Picture
                            })
                        .ToListAsync();

                    if (cartItems == null || !cartItems.Any())
                    {
                        _logger.Log("No cart details found.");
                        await transaction.RollbackAsync();
                        return NotFound("No cart details found.");
                    }

                    await transaction.CommitAsync();
                    return Ok(cartItems);
                }
                catch (UnauthorizedAccessException)
                {
                    await transaction.RollbackAsync();
                    return Unauthorized("You are not authorized to access this resource.");
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching cart details: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // Second layer of nesting
        [Authorize]
        [HttpGet("{cartId}/CartItems/{cartItemId}")]
        public async Task<ActionResult<object>> GetCartItemDetails(int cartId, int cartItemId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    AuthorizeUserIdAndAdmin(cartId);

                    var cartItemDetails = await _context.CartItems
                        .Where(ci => ci.CartId == cartId && ci.CartItemId == cartItemId)
                        .Join(_context.Products,
                              cartItem => cartItem.ProductId,
                              product => product.ProductId,
                              (cartItem, product) => new
                              {
                                  cartItem.CartItemId,
                                  product.ProductId,
                                  product.Picture,
                                  product.ProductName,
                                  product.Description,
                                  cartItem.Quantity,
                                  product.Price,
                                  TotalPrice = cartItem.Quantity * product.Price
                              })
                        .FirstOrDefaultAsync();

                    if (cartItemDetails == null)
                    {
                        _logger.Log("No product details found for the given cart item.");
                        return NotFound("No product details found for the given cart item.");
                    }

                    await transaction.CommitAsync();
                    return Ok(cartItemDetails);
                }
                catch (UnauthorizedAccessException ex)
                {
                    _logger.Log($"Unauthorized Access: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Unauthorized(ex.Message);
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching product details: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // Third layer of nesting
        [Authorize]
        [HttpGet("{cartId}/CartItems/{cartItemId}/Product")]
        public async Task<ActionResult<object>> GetProductDetails(int cartId, int cartItemId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    AuthorizeUserIdAndAdmin(cartId);

                    var productDetails = await _context.CartItems
                        .Where(ci => ci.CartId == cartId && ci.CartItemId == cartItemId)
                        .Join(_context.Products,
                              cartItem => cartItem.ProductId,
                              product => product.ProductId,
                              (cartItem, product) => new
                              {
                                  product.ProductId,
                                  product.ProductName,
                                  product.Description,
                                  product.Price,
                                  product.Category,
                                  product.Gender,
                                  product.StockQuantity,
                                  product.DateAdded,
                                  product.Picture
                              })
                        .FirstOrDefaultAsync();

                    if (productDetails == null)
                    {
                        _logger.Log("No product details found for the given cart item.");
                        return NotFound("No product details found for the given cart item.");
                    }

                    await transaction.CommitAsync();
                    return Ok(productDetails);
                }
                catch (UnauthorizedAccessException ex)
                {
                    _logger.Log($"Unauthorized Access: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Unauthorized(ex.Message);
                }
                catch (Exception ex)
                {
                    _logger.Log($"Error fetching product details: {ex.Message}");
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        private void AuthorizeUserIdAndAdmin(int id)
        {
            var userId = int.Parse(HttpContext.User.Claims.First(c => c.Type == "UserId").Value);
            var userRole = HttpContext.User.Claims.First(c => c.Type == ClaimTypes.Role).Value;
            if (userId != id && userRole != "Admin")
            {
                _logger.Log($"Unauthorized request to update user {id}.");
                throw new UnauthorizedAccessException("You are not authorized to access this resource.");
            }
        }
    }
}