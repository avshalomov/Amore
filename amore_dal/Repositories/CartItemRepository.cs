using Microsoft.EntityFrameworkCore;
using amore_dal.Context;
using amore_dal.Models;
using amore_dal.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using amore_dal.Repositories;
using Microsoft.Extensions.Logging;

namespace amore_dal.Repositories
{
    public class CartItemRepository : ICartItemRepository
    {
        private readonly AmoreDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        public CartItemRepository(AmoreDbContext context, ILogger<UserRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Returns all cart items.
        public async Task<IEnumerable<CartItemDto>> GetAllCartItems()
        {
            if (_context.CartItems == null) throw new Exception("Entity set 'AmoreDbContext.CartItems' is null.");
            var cartItems = await _context.CartItems.ToListAsync();
            if (cartItems == null) throw new Exception("No cart items found.");
            return cartItems.Select(ci => new CartItemDto
            {
                CartItemId = ci.CartItemId,
                CartId = ci.CartId,
                ProductId = ci.ProductId,
                Quantity = ci.Quantity
            }).ToList();
        }

        // Returns a cart item with the given id.
        public async Task<CartItemDto> GetCartItemById(int id)
        {
            if (_context.CartItems == null) throw new Exception("Entity set 'AmoreDbContext.CartItems' is null.");
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) throw new Exception($"Cart item with id {id} not found.");
            return new CartItemDto
            {
                CartItemId = cartItem.CartItemId,
                CartId = cartItem.CartId,
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity
            };
        }

        // Updates the quantity of a cart item, total price of the cart and stock quantity of the product.
        public async Task UpdateCartItem(int id, CartItemDto cartItemDto)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) throw new Exception($"Cart item with id {id} not found.");

            var product = await _context.Products.FindAsync(cartItem.ProductId);
            if (product == null) throw new Exception($"Product with id {cartItem.ProductId} not found.");

            var cart = await _context.Carts
                            .Include(c => c.CartItems)
                            .ThenInclude(ci => ci.Product)
                            .FirstOrDefaultAsync(ci => ci.CartId == cartItem.CartId);
            if (cart == null) throw new Exception($"Cart with id {cartItem.CartId} not found.");

            if (cartItemDto.Quantity != cartItem.Quantity)
            {
                if (cartItemDto.Quantity > cartItem.Quantity)
                {
                    var quantityToAdd = cartItemDto.Quantity - cartItem.Quantity;
                    if (product.StockQuantity < quantityToAdd) throw new Exception($"Insufficient stock.");
                    product.StockQuantity -= quantityToAdd;
                }
                else
                {
                    var quantityToSubtract = cartItem.Quantity - cartItemDto.Quantity;
                    product.StockQuantity += quantityToSubtract;
                    if (cartItemDto.Quantity == 0)
                    {
                        _context.CartItems.Remove(cartItem);
                    }
                }
                cartItem.Quantity = cartItemDto.Quantity;
                cart.TotalPrice = cart.CartItems.Sum(ci => ci.Quantity * ci.Product.Price);
            }
            await _context.SaveChangesAsync();
        }

        // Adds a cart item to the cart, updates the total price of the cart and stock quantity of the product.
        public async Task AddCartItem(CartItemDto cartItemDto)
        {
            var product = await _context.Products.FindAsync(cartItemDto.ProductId);
            if (product == null) throw new Exception($"Product with id {cartItemDto.ProductId} not found.");
            if (product.StockQuantity < cartItemDto.Quantity) throw new Exception($"Insufficient stock.");

            var cart = await _context.Carts
                        .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Product)
                        .FirstOrDefaultAsync(ci => ci.CartId == cartItemDto.CartId);
            if (cart == null) throw new Exception($"Cart with id {cartItemDto.CartId} not found.");

            if (cart.CartItems.Any(ci => ci.ProductId == cartItemDto.ProductId))
            {
                throw new Exception("Product already exists in cart.");
            }

            var cartItem = new CartItem
            {
                CartId = cartItemDto.CartId,
                ProductId = cartItemDto.ProductId,
                Quantity = cartItemDto.Quantity
            };

            product.StockQuantity -= cartItem.Quantity;

            _context.CartItems.Add(cartItem);

            cart.TotalPrice += (cartItem.Quantity * cartItem.Product.Price);

            await _context.SaveChangesAsync();
        }

        // Deletes a cart item from the cart, updates the total price of the cart and stock quantity of the product.
        public async Task DeleteCartItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null) throw new Exception($"Cart item with id {id} not found.");

            var product = await _context.Products.FindAsync(cartItem.ProductId);
            if (product == null) throw new Exception($"Product with id {cartItem.ProductId} not found.");

            var cart = await _context.Carts
                        .Include(c => c.CartItems)
                        .ThenInclude(ci => ci.Product)
                        .FirstOrDefaultAsync(ci => ci.CartId == cartItem.CartId);
            if (cart == null) throw new Exception($"Cart with id {cartItem.CartId} not found.");

            product.StockQuantity += cartItem.Quantity;

            // Update TotalPrice
            cart.TotalPrice -= (cartItem.Quantity * cartItem.Product.Price);

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
        }

    }
}
