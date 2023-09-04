using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.Models;
using amore_dal.DTOs;
using amore_dal.Context;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly AmoreDbContext _context;
        public CartItemsController(AmoreDbContext context)
        {
            _context = context;
        }

        // GET: api/CartItems
        // Returns all cart items info:
        // CartItemId, CartId, ProductId, Quantity.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems()
        {
            try
            {
                // Check if entity set 'AmoreDbContext.CartItems' is null.
                if (_context.CartItems == null) return NotFound("Entity set 'AmoreDbContext.CartItems' is null.");

                // Get all cart items.
                var cartItems = await _context.CartItems.ToListAsync();
                if (cartItems == null) return NotFound("No cart items found.");

                // Create a list of CartItemDto objects.
                var cartItemsDto = new List<CartItemDto>();
                foreach (var cartItem in cartItems)
                {
                    cartItemsDto.Add(new CartItemDto
                    {
                        CartItemId = cartItem.CartItemId,
                        CartId = cartItem.CartId,
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity
                    });
                }

                // Return cartItemsDto.
                return cartItemsDto;
            }
            catch (Exception ex) // Catch any exception.
            {
                return Problem(ex.Message);
            }
        }

        // GET: api/CartItems/5
        // Returns cart item info:
        // CartItemId, CartId, ProductId, Quantity.
        [HttpGet("{id}")]
        public async Task<ActionResult<CartItemDto>> GetCartItem(int id)
        {
            try
            {
                // Check if entity set 'AmoreDbContext.CartItems' is null.
                if (_context.CartItems == null) return NotFound("Entity set 'AmoreDbContext.CartItems' is null.");

                // Get cart item.
                var cartItem = await _context.CartItems.FindAsync(id);
                if (cartItem == null) return NotFound($"Cart item with id {id} not found.");

                // Create a CartItemDto object.
                var cartItemDto = new CartItemDto
                {
                    CartItemId = cartItem.CartItemId,
                    CartId = cartItem.CartId,
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity
                };

                // Return cartItemDto.
                return cartItemDto;
            }
            catch (Exception ex) // Catch any exception.
            {
                return Problem(ex.Message);
            }
        }

        // PUT: api/CartItems/5
        // Can update quantity only
        // Can't update cart ID and product ID
        // Can't update quantity to more than stock quantity
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCartItem(int id, CartItemDto cartItemDto)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check nulls
                    if (cartItemDto == null) return BadRequest("Cart item is null.");
                    if (!ModelState.IsValid) return BadRequest("Invalid model state.");
                    if (_context.CartItems == null) return Problem("Entity set 'AmoreDbContext.CartItems' is null.");

                    // Get cart item
                    var cartItem = await _context.CartItems.FindAsync(id);
                    if (cartItem == null) return NotFound($"Cart item with id {id} not found.");

                    // Check if cartID and productID are changed
                    if (cartItemDto.CartId != cartItem.CartId) return BadRequest($"Can't change cart ID, must be {cartItem.CartId}.");
                    if (cartItemDto.ProductId != cartItem.ProductId) return BadRequest($"Can't change product ID, must be {cartItem.ProductId}.");

                    // If quantity is changed
                    if (cartItemDto.Quantity != cartItem.Quantity)
                    {
                        // Get product
                        var product = await _context.Products.FindAsync(cartItem.ProductId);
                        if (product == null) return NotFound($"Product with id {cartItem.ProductId} not found.");

                        // If adding quantity
                        if (cartItemDto.Quantity > cartItem.Quantity)
                        {
                            var quantityToAdd = cartItemDto.Quantity - cartItem.Quantity;
                            if (product.StockQuantity < quantityToAdd) return BadRequest($"There are {product.StockQuantity} {product.ProductName}s in stock, you want to add {quantityToAdd}.");
                            product.StockQuantity -= quantityToAdd;
                        }
                        // If subtracting quantity
                        else if (cartItemDto.Quantity < cartItem.Quantity)
                        {
                            var quantityToSubtract = cartItem.Quantity - cartItemDto.Quantity;
                            product.StockQuantity += quantityToSubtract;

                            // If subtracting quantity to 0
                            if (cartItemDto.Quantity == 0)
                            {
                                _context.CartItems.Remove(cartItem);
                            }
                        }

                        // Update cart item quantity
                        cartItem.Quantity = cartItemDto.Quantity;

                        // Get cart
                        var cart = await _context.Carts
                            .Include(c => c.CartItems)
                            .ThenInclude(ci => ci.Product)  // Make sure to include Product info
                            .FirstOrDefaultAsync(ci => ci.CartId == cartItem.CartId);
                        if (cart == null) return NotFound($"Cart with id {cartItem.CartId} not found.");

                        // Update cart total price
                        if (cart.CartItems == null || cart.CartItems.Count == 0)
                        {
                            cart.TotalPrice = 0;
                        }
                        else
                        {
                            cart.TotalPrice = cart.CartItems.Sum(ci => ci.Quantity * ci.Product.Price);
                        }

                        // Save changes
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();
                        return NoContent();
                    }

                    // If quantity is not changed
                    await transaction.CommitAsync();
                    return NoContent();
                }
                catch (Exception ex)
                {
                    // Rollback transaction
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }


        // POST: api/CartItems
        // Can add a cart item if the product is in stock and the cart does not already contain the product
        [HttpPost]
        public async Task<ActionResult<CartItemDto>> PostCartItem(CartItemDto cartItemDto)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check nulls
                    if (cartItemDto == null) return BadRequest("Cart item is null.");
                    if (!ModelState.IsValid) return BadRequest("Invalid model state.");
                    if (_context.CartItems == null) return Problem("Entity set 'AmoreDbContext.CartItems' is null.");

                    // Get product
                    var product = await _context.Products.FindAsync(cartItemDto.ProductId);
                    if (product == null) return NotFound($"Product with id {cartItemDto.ProductId} not found.");

                    // Check if product is in stock
                    if (product.StockQuantity < cartItemDto.Quantity) return BadRequest($"There are {product.StockQuantity} {product.ProductName}s in stock, you want to add {cartItemDto.Quantity}.");

                    // Get cart
                    var cart = await _context.Carts
                        .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Product)  // Make sure to include Product info
                        .FirstOrDefaultAsync(ci => ci.CartId == cartItemDto.CartId);
                    if (cart == null) return NotFound($"Cart with id {cartItemDto.CartId} not found.");

                    // Check if cart already contains the product
                    if (cart.CartItems != null && cart.CartItems.Any(ci => ci.ProductId == cartItemDto.ProductId))
                    {
                        return BadRequest($"Cart id {cartItemDto.CartId} already contains product id {cartItemDto.ProductId} {product.ProductName}.");
                    }

                    // Add cart item
                    var cartItem = new CartItem
                    {
                        CartId = cartItemDto.CartId,
                        ProductId = cartItemDto.ProductId,
                        Quantity = cartItemDto.Quantity
                    };
                    _context.CartItems.Add(cartItem);

                    // Update cart total price
                    if (cart.CartItems == null || cart.CartItems.Count == 0)
                    {
                        cart.TotalPrice = 0;
                    }
                    else
                    {
                        cart.TotalPrice = cart.CartItems.Sum(ci => ci.Quantity * ci.Product.Price);
                    }

                    // Save changes
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return CreatedAtAction("GetCartItem", new { id = cartItem.CartItemId }, cartItem);
                }
                catch (Exception ex)
                {
                    // Rollback transaction
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // DELETE: api/CartItems/5
        // Can delete a cart item and update the cart total price
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCartItem(int id)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Check nulls
                    if (_context.CartItems == null) return Problem("Entity set 'AmoreDbContext.CartItems' is null.");

                    // Get cart item
                    var cartItem = await _context.CartItems.FindAsync(id);
                    if (cartItem == null) return NotFound($"Cart item with id {id} not found.");

                    // Get product
                    var product = await _context.Products.FindAsync(cartItem.ProductId);
                    if (product == null) return NotFound($"Product with id {cartItem.ProductId} not found.");

                    // Get cart
                    var cart = await _context.Carts
                        .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Product)
                        .FirstOrDefaultAsync(ci => ci.CartId == cartItem.CartId);
                    if (cart == null) return NotFound($"Cart with id {cartItem.CartId} not found.");

                    // Update product stock quantity
                    product.StockQuantity += cartItem.Quantity;

                    // Remove cart item
                    _context.CartItems.Remove(cartItem);

                    // Update cart total price
                    if (cart.CartItems == null || cart.CartItems.Count == 0)
                    {
                        cart.TotalPrice = 0;
                    }
                    else
                    {
                        cart.TotalPrice = cart.CartItems.Sum(ci => ci.Quantity * ci.Product.Price);
                    }

                    // Save changes
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return NoContent();
                }
                catch (Exception ex)
                {
                    // Rollback transaction
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

    }
}
