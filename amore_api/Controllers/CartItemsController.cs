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

        public CartItemsController(ICartItemRepository cartItemRepository)
        {
            _cartItemRepository = cartItemRepository;
        }

        // GET: api/CartItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCartItems()
        {
            try
            {
                return Ok(await _cartItemRepository.GetAllCartItems());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/CartItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CartItemDto>> GetCartItem(int id)
        {
            try
            {
                return Ok(await _cartItemRepository.GetCartItemById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/CartItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCartItem(int id, CartItemDto cartItemDto)
        {
            if (id != cartItemDto.CartItemId)
            {
                return BadRequest("Mismatched cart item ID.");
            }

            try
            {
                await _cartItemRepository.UpdateCartItem(id, cartItemDto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/CartItems
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
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/CartItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCartItem(int id)
        {
            try
            {
                await _cartItemRepository.DeleteCartItem(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
