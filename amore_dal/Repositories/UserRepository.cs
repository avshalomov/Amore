using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using amore_dal.Context;
using amore_dal.DTOs;
using amore_dal.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace amore_dal.Repositories
{
    public class UserRepository : IUserRepository
    {
        // Dependency injection:
        private readonly AmoreDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly LoggerService _logger;

        // Constructor:
        public UserRepository(AmoreDbContext context, IConfiguration configuration, LoggerService logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
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
                _logger.Log($"Error during GetAllUsersAsync: {ex.Message}");
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
                    return null;
                }
                return ConvertToUserDto(user);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error during GetUserByIdAsync: {ex.Message}");
                throw;
            }

        }


        // Create a new user:
        // 1. Validate unique username and email
        // 2. Validate user role
        // 3. Create user from UserDto
        // 4. Create cart for user
        // 5. Save changes
        public async Task<UserDto> CreateUserAsync(RegisterDto registerDto)
        {
            try
            {
                ValidateUniqueConstraints(registerDto.Username, registerDto.Email);


                var user = CreateUserFromDto(registerDto);
                _context.Users.Add(user);

                await _context.SaveChangesAsync();
                await AddCartForUser(user);

                return ConvertToUserDto(user);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error during CreateUserAsync: {ex.Message}");
                throw;
            }
        }

        // Update user:
        // 1. Validate unique username and email
        // 2. Validate user role
        // 3. Find user by id
        // 4. Update user from UserDto
        // 5. Save changes
        public async Task<UserDto> UpdateUserAsync(int id, UserDto userDto)
        {
            try
            {
                ValidateUniqueConstraints(userDto.Username, userDto.Email, id);

                ValidateUserRole(userDto.UserRole);

                var user = await _context.Users.FindAsync(id);


                user = UpdateUserFromDto(user, userDto);

                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return userDto;
            }
            catch (Exception ex)
            {
                _logger.Log($"Error during UpdateUserAsync: {ex.Message}");
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
                _logger.Log($"Error during DeleteUserAsync: {ex.Message}");
                throw;
            }
        }

        // ======================================================================
        // Methods for user authentication.
        // ======================================================================

        public async Task<(User, string)> ValidateUserAsync(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null)
            {
                return (null, $"There is no user {loginDto.Username}.");
            }

            using (SHA256 sha256Hash = SHA256.Create())
            {
                var computedHash = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
                if (!computedHash.SequenceEqual(user.PasswordHash))
                {
                    return (null, "Password is incorrect.");
                }
            }

            // Update user.LastLoginDate
            user.LastLoginDate = DateTime.Now;
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return (user, null);
        }

        public string GenerateJSONWebToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("UserId", user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.UserRole.ToString())
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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

        private User CreateUserFromDto(RegisterDto registerDto)
        {
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                UserRole = UserRole.User,
                LastLoginDate = DateTime.Now,
                DateCreated = DateTime.Now,
                Picture = registerDto.Picture
            };

            using (SHA256 sha256Hash = SHA256.Create())
            {
                user.PasswordHash = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            }

            return user;
        }

        private User UpdateUserFromDto(User user, UserDto userDto)
        {
            user.Username = userDto.Username;
            user.Email = userDto.Email;
            user.UserRole = userDto.UserRole;
            user.LastLoginDate = userDto.LastLoginDate;
            user.Picture = userDto.Picture;

            using (SHA256 sha256Hash = SHA256.Create())
            {
                user.PasswordHash = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(userDto.PasswordHash));
            }
            return user;
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
    }
}