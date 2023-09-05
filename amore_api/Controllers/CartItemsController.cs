using Microsoft.AspNetCore.Mvc;
using amore_dal.DTOs;
using amore_dal.Repositories;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController : ControllerBase
    {
        private readonly ICartItemRepository _cartItemRepository;
        private readonly LoggerService _logger;

        public CartItemsController(ICartItemRepository cartItemRepository)
        {
            _cartItemRepository = cartItemRepository;
            _logger = LoggerService.Instance;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems()
        {
            try
            {
                var cartItems = await _cartItemRepository.GetAllCartItems();
                if (cartItems == null)
                {
                    _logger.Log("No cart items found.");
                    return NotFound("No cart items found.");
                }
                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching cart items: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartItemDto>> GetCartItem(int id)
        {
            try
            {
                var cartItem = await _cartItemRepository.GetCartItemById(id);
                if (cartItem == null)
                {
                    _logger.Log($"No cart item found with id {id}.");
                    return NotFound($"No cart item found with id {id}.");
                }
                return Ok(cartItem);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching cart item with id {id}: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> PutCartItem(int id, CartItemDto cartItemDto)
        {
            if (id != cartItemDto.CartItemId)
            {
                _logger.Log($"Mismatched cart item ID: {id} vs {cartItemDto.CartItemId}");
                return BadRequest("Mismatched cart item ID.");
            }

            try
            {
                await _cartItemRepository.UpdateCartItem(id, cartItemDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.Log($"Error updating cart item with id {id}: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<CartItemDto>> PostCartItem(CartItemDto cartItemDto)
        {
            try
            {
                await _cartItemRepository.AddCartItem(cartItemDto);
                return CreatedAtAction("GetCartItem", new { id = cartItemDto.CartItemId }, cartItemDto);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error adding cart item: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCartItem(int id)
        {
            try
            {
                await _cartItemRepository.DeleteCartItem(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.Log($"Error deleting cart item with id {id}: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }
    }
}