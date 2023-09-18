using Microsoft.AspNetCore.Mvc;
using amore_dal.Repositories;
using amore_dal.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly LoggerService _logger;

        public UsersController(IUserRepository userRepository, LoggerService logger)
        {
            _userRepository = userRepository;
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // Register - api/Users/Register
        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            try
            {
                var newUserDto = await _userRepository.CreateUserAsync(registerDto);
                if (newUserDto == null)
                {
                    _logger.Log("User could not be created.");
                    return BadRequest("User could not be created.");
                }
                return CreatedAtAction("GetUser", new { id = newUserDto.UserId }, newUserDto);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error creating user: {ex.Message}");
                return BadRequest($"Error creating user: {ex.Message}");
            }
        }

        // Login - api/Users/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            try
            {
                var (user, errorMessage) = await _userRepository.ValidateUserAsync(loginDto);
                if (user == null)
                {
                    _logger.Log(errorMessage);
                    return Unauthorized(errorMessage);
                }

                return Ok(_userRepository.GenerateJSONWebToken(user));
            }
            catch (Exception ex)
            {
                _logger.Log($"Error during login attempt: {ex.Message}");
                return BadRequest($"Error during login: {ex.Message}");
            }
        }

        // Update user - api/Users/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> PutUser(int id, UserDto userDto)
        {
            try
            {
                AuthorizeUserIdAndAdmin(id);

                var updatedUser = await _userRepository.UpdateUserAsync(id, userDto);
                if (updatedUser == null) return NotFound($"User with id {id} not found.");
                return Ok(updatedUser);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("You are not authorized to access this resource.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error updating user: {ex.Message}");
                return BadRequest($"Error updating user: {ex.Message}");
            }
        }

        // Update user - /api/Users/5/ChangeRole (only authorized Admin role can)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/ChangeRole")]
        public async Task<ActionResult<UserDto>> PutUserRole(int id)
        {
            try
            {
                var updatedUser = await _userRepository.UpdateUserRoleAsync(id);
                if (updatedUser == null) return NotFound($"User with id {id} not found.");
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error updating user role: {ex.Message}");
                return BadRequest($"Error updating user role: {ex.Message}");
            }
        }



        // Delete user - api/Users/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            try
            {
                AuthorizeUserIdAndAdmin(id);

                var isDeleted = await _userRepository.DeleteUserAsync(id);
                if (!isDeleted) return NotFound($"User with id {id} not found.");
                return NoContent();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("You are not authorized to access this resource.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error deleting user: {ex.Message}");
                return BadRequest($"Error deleting user: {ex.Message}");
            }
        }

        // Get user by id - api/Users/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var user = await _userRepository.GetUserByIdAsync(id);
                if (user == null)
                {
                    _logger.Log($"User with id {id} not found.");
                    return NotFound($"User with id {id} not found.");
                }
                return Ok(user);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("You are not authorized to access this resource.");
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching user: {ex.Message}");
                return BadRequest($"Error fetching user: {ex.Message}");
            }
        }

        // Get all users - api/Users
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            try
            {
                var users = await _userRepository.GetAllUsersAsync();
                if (users == null || !users.Any())
                {
                    _logger.Log("No users found.");
                    return NotFound("No users found.");
                }
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error fetching users: {ex.Message}");
                return BadRequest($"Error fetching users: {ex.Message}");
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