using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using amore_dal.Models;
using amore_dal.DTOs;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Security.Cryptography;
using amore_dal.Context;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AmoreDbContext _context;

        public UsersController(AmoreDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        // Returns all users info:
        // UserId, Username, Email, UserRole, LastLoginDate, DateCreated, Picture.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Users' is null.
                    if (_context.Users == null) return NotFound("Entity set 'AmoreDbContext.Users' is null.");

                    // Get all users.
                    var users = await _context.Users.ToListAsync();
                    if (users == null) return NotFound("No users found.");

                    // Create a list of UserDto objects.
                    var usersDto = new List<UserDto>();
                    foreach (var user in users)
                    {
                        usersDto.Add(new UserDto
                        {
                            UserId = user.UserId,
                            Username = user.Username,
                            Email = user.Email,
                            UserRole = user.UserRole,
                            LastLoginDate = user.LastLoginDate,
                            DateCreated = user.DateCreated,
                            Picture = user.Picture
                        });
                    }

                    // Commit transaction and return usersDto.
                    await transaction.CommitAsync();
                    return usersDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // GET: api/Users/5
        // Returns a user info:
        // UserId, Username, Email, UserRole, LastLoginDate, DateCreated, Picture.
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Check if entity set 'AmoreDbContext.Users' is null.
                    if (_context.Users == null) return NotFound("Entity set 'AmoreDbContext.Users' is null.");

                    // Get user.
                    var user = await _context.Users.FindAsync(id);
                    if (user == null) return NotFound($"User with id {id} not found.");

                    // Create a UserDto object.
                    var userDto = new UserDto
                    {
                        UserId = user.UserId,
                        Username = user.Username,
                        Email = user.Email,
                        UserRole = user.UserRole,
                        LastLoginDate = user.LastLoginDate,
                        DateCreated = user.DateCreated,
                        Picture = user.Picture
                    };

                    // Commit transaction and return userDto.
                    await transaction.CommitAsync();
                    return userDto;
                }
                catch (Exception ex) // Catch any exception.
                {
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // PUT: api/Users/5
        // Validate, check if username and email are unique, update user, save user to database.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto userDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Validate
                    if (_context.Users == null) return NotFound("Entity set 'AmoreDbContext.Users' is null.");
                    if (userDto == null) return BadRequest("UserDto is null.");
                    if (userDto.Username == null) return BadRequest("Username is null.");
                    if (userDto.Email == null) return BadRequest("Email is null.");
                    if (userDto.PasswordHash == null) return BadRequest("Password is null.");
                    if (userDto.Picture == null) return BadRequest("Picture is null.");

                    // Check if user role is valid
                    if (userDto.UserRole != UserRole.Admin && userDto.UserRole != UserRole.User)
                    {
                        return BadRequest($"UserRole '{userDto.UserRole}' is invalid, 0={UserRole.User} or 1={UserRole.Admin} expected.");
                    }

                    // Check if username is unique
                    if (await _context.Users.AnyAsync(u => u.Username == userDto.Username && u.UserId != id))
                    {
                        return BadRequest($"Username '{userDto.Username}' is already taken.");
                    }

                    // Check if email is unique
                    if (await _context.Users.AnyAsync(u => u.Email == userDto.Email && u.UserId != id))
                    {
                        return BadRequest($"Email '{userDto.Email}' is already taken.");
                    }

                    // Get user
                    var user = await _context.Users.FindAsync(id);
                    if (user == null) return NotFound($"User with id {id} not found.");

                    // Update user
                    user.Username = userDto.Username;
                    user.Email = userDto.Email;
                    user.UserRole = userDto.UserRole;
                    user.LastLoginDate = userDto.LastLoginDate;
                    user.Picture = userDto.Picture;

                    // Hash password
                    using (var hmac = new HMACSHA512())
                    {
                        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.PasswordHash));
                    }

                    // Save to database, Commit transaction and return NoContent.
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return NoContent();
                }
                catch (Exception ex) // Catch any exception.
                {
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // POST: api/Users
        // Validate, check if username and email are unique, create user, hash password, save user to database.
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUser(UserDto userDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Validate
                    if (_context.Users == null) return NotFound("Entity set 'AmoreDbContext.Users' is null.");
                    if (userDto == null) return BadRequest("UserDto is null.");
                    if (userDto.Username == null) return BadRequest("Username is null.");
                    if (userDto.Email == null) return BadRequest("Email is null.");
                    if (userDto.PasswordHash == null) return BadRequest("Password is null.");
                    if (userDto.Picture == null) return BadRequest("Picture is null.");

                    // Check if username is unique
                    if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
                    {
                        return BadRequest($"Username '{userDto.Username}' is already taken.");
                    }

                    // Check if email is unique
                    if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
                    {
                        return BadRequest($"Email '{userDto.Email}' is already taken.");
                    }

                    // Create user
                    var user = new User
                    {
                        Username = userDto.Username,
                        Email = userDto.Email,
                        UserRole = UserRole.User,
                        LastLoginDate = DateTime.Now,
                        DateCreated = DateTime.Now,
                        Picture = userDto.Picture
                    };

                    // Hash password
                    using (var hmac = new HMACSHA512())
                    {
                        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.PasswordHash));
                    }

                    // Add user to database
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();

                    // Create cart for user
                    var cart = new Cart
                    {
                        UserId = user.UserId
                    };
                    _context.Carts.Add(cart);

                    // Return userDto
                    var returnUserDto = new UserDto
                    {
                        UserId = user.UserId,
                        Username = user.Username,
                        Email = user.Email,
                        UserRole = user.UserRole,
                        LastLoginDate = user.LastLoginDate,
                        DateCreated = user.DateCreated,
                        Picture = user.Picture
                    };

                    // Commit transaction, save changes and return userDto
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return CreatedAtAction("GetUser", new { id = user.UserId }, returnUserDto);
                }
                catch (DbUpdateException dbEx) // Database Update Error
                {
                    await transaction.RollbackAsync();
                    return Problem($"Database Update Error: {dbEx.Message}");
                }
                catch (Exception ex) // Other Error
                {
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }

        // DELETE: api/Users/5
        // Delete user from database and the user's cart with all the cart items.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Validate
                    if (_context.Users == null) return NotFound("Entity set 'AmoreDbContext.Users' is null.");

                    // Get user
                    var user = await _context.Users.FindAsync(id);
                    if (user == null) return NotFound($"User with id {id} not found.");

                    // Get user's cart
                    var cart = await _context.Carts.FindAsync(user.UserId);
                    if (cart == null) return NotFound($"Cart with id {user.UserId} not found.");

                    // Delete cart items
                    var cartItems = await _context.CartItems.Where(ci => ci.CartId == cart.CartId).ToListAsync();
                    if (cartItems == null) return NotFound($"Cart items with cart id {cart.CartId} not found.");
                    _context.CartItems.RemoveRange(cartItems);

                    // Delete cart
                    _context.Carts.Remove(cart);

                    // Delete user
                    _context.Users.Remove(user);

                    // Save to database, Commit transaction and return NoContent.
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return NoContent();
                }
                catch (Exception ex) // Catch any exception.
                {
                    await transaction.RollbackAsync();
                    return Problem(ex.Message);
                }
            }
        }
    }
}
