using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using amore_dal.Context;
using amore_dal.DTOs;
using amore_dal.Models;
using Microsoft.Extensions.Logging;

namespace amore_dal.Repositories
{
    public class UserRepository : IUserRepository
    {
        // Dependency injection:
        private readonly AmoreDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        // Constructor:
        public UserRepository(AmoreDbContext context, ILogger<UserRepository> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // ======================================================================
        // CRUD methods for users.
        // ======================================================================

        // Get all users:
        // 1. Find all users
        // 2. Convert users to UserDtos
        // 3. Return UserDtos
        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            try
            {
                return await ConvertUsersToUserDtos();
            }
            catch (Exception ex)
            {
                LogException(ex);
                throw;
            }
        }

        // Get user by id:
        // 1. Find user by id
        // 2. Convert user to UserDto
        // 3. Return UserDto
        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    LogException(new Exception("User not found"));
                    return null;
                }
                return ConvertToUserDto(user);
            }
            catch (Exception ex)
            {
                LogException(ex);
                throw;
            }
        }


        // Create a new user:
        // 1. Validate unique username and email
        // 2. Validate user role
        // 3. Create user from UserDto
        // 4. Create cart for user
        // 5. Save changes
        public async Task<UserDto> CreateUserAsync(UserDto userDto)
        {
            try
            {
                ValidateUniqueConstraints(userDto.Username, userDto.Email);

                ValidateUserRole(userDto.UserRole);

                var user = CreateUserFromDto(userDto);
                _context.Users.Add(user);

                await _context.SaveChangesAsync();
                await AddCartForUser(user);

                return ConvertToUserDto(user);
            }
            catch (Exception ex)
            {
                LogException(ex);
                throw;
            }
        }

        // Update user:
        // 1. Validate unique username and email
        // 2. Validate user role
        // 3. Find user by id
        // 4. Update user from UserDto
        // 5. Save changes
        public async Task<User> UpdateUserAsync(int id, UserDto userDto)
        {
            try
            {
                ValidateUniqueConstraints(userDto.Username, userDto.Email, id);

                ValidateUserRole(userDto.UserRole);

                var user = await _context.Users.FindAsync(id);


                UpdateUserFromDto(user, userDto);

                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return user;
            }
            catch (Exception ex)
            {
                LogException(ex);
                throw;
            }
        }

        // Delete user:
        // 1. Find user by id
        // 2. Remove user
        // 3. Delete cart for user
        // 4. Save changes
        // 5. Return true if user was deleted
        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null) return false;

                _context.Users.Remove(user);
                await DeleteCartForUser(user);

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                LogException(ex);
                throw;
            }
        }

        // ======================================================================
        // Helper methods for converting, creating, updating and deleting users.
        // ======================================================================

        private void ValidateUniqueConstraints(string username, string email, int id = 0)
        {
            if (_context.Users.Any(u => u.Username == username && u.UserId != id))
            {
                throw new Exception("Username already taken");
            }
            if (_context.Users.Any(u => u.Email == email && u.UserId != id))
            {
                throw new Exception("Email already taken");
            }
        }

        private void ValidateUserRole(UserRole userRole)
        {
            if (userRole != UserRole.Admin && userRole != UserRole.User)
            {
                throw new Exception($"Invalid user role: {userRole}, must be either 0={UserRole.User} or 1={UserRole.Admin}");
            }
        }

        private async Task<IEnumerable<UserDto>> ConvertUsersToUserDtos()
        {
            var userEntities = await _context.Users.ToListAsync();
            return userEntities.Select(u => ConvertToUserDto(u)).ToList();
        }

        private UserDto ConvertToUserDto(User user)
        {
            return new UserDto
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                UserRole = user.UserRole,
                LastLoginDate = user.LastLoginDate,
                DateCreated = user.DateCreated,
                Picture = user.Picture
            };
        }

        private User CreateUserFromDto(UserDto userDto)
        {
            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                UserRole = userDto.UserRole,
                LastLoginDate = DateTime.Now,
                DateCreated = DateTime.Now,
                Picture = userDto.Picture
            };

            using (var hmac = new HMACSHA512())
            {
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.PasswordHash));
            }

            return user;
        }

        private void UpdateUserFromDto(User user, UserDto userDto)
        {
            user.Username = userDto.Username;
            user.Email = userDto.Email;
            user.UserRole = userDto.UserRole;
            user.LastLoginDate = userDto.LastLoginDate;
            user.Picture = userDto.Picture;

            using (var hmac = new HMACSHA512())
            {
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.PasswordHash));
            }
        }

        private async Task AddCartForUser(User user)
        {
            var cart = new Cart { UserId = user.UserId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        private async Task DeleteCartForUser(User user)
        {
            var cart = await _context.Carts.FindAsync(user.UserId);
            if (cart != null)
            {
                var cartItems = await _context.CartItems.Where(ci => ci.CartId == cart.CartId).ToListAsync();
                _context.CartItems.RemoveRange(cartItems);
                _context.Carts.Remove(cart);
            }
        }

        private void LogException(Exception ex)
        {
            _logger.LogError($"An error occurred: {ex.Message}", ex);
        }
    }
}