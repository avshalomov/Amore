using Microsoft.AspNetCore.Mvc;
using amore_dal.Repositories;
using amore_dal.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace amore_api.Controllers
{
    [Authorize(Roles = "Admin")]
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

                var token = _userRepository.GenerateJSONWebToken(user);
                return Ok(token);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error during login attempt: {ex.Message}");
                return BadRequest($"Error during login: {ex.Message}");
            }
        }


        // Update user - api/Users/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> PutUser(int id, UserDto userDto)
        {
            // Check if UserId from token matches id from route to authorize update
            if (int.Parse(HttpContext.User.Claims.First(c => c.Type == "UserId").Value) != id)
            {
                _logger.Log($"Unauthorized request to get user {id}.");
                return Unauthorized("You are not authorized to access this resource.");
            }

            try
            {
                var updatedUser = await _userRepository.UpdateUserAsync(id, userDto);
                if (updatedUser == null)
                {
                    _logger.Log($"Failed to update user with id {id}.");
                    return NotFound($"User with id {id} not found.");
                }
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                _logger.Log($"Error updating user: {ex.Message}");
                return BadRequest($"Error updating user: {ex.Message}");
            }
        }

        // Delete user - api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            // Check if UserId from token matches id from route to authorize delete
            if (int.Parse(HttpContext.User.Claims.First(c => c.Type == "UserId").Value) != id)
            {
                _logger.Log($"Unauthorized request to get user {id}.");
                return Unauthorized("You are not authorized to access this resource.");
            }

            try
            {
                var isDeleted = await _userRepository.DeleteUserAsync(id);
                if (!isDeleted) return NotFound($"User with id {id} not found.");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.Log($"Error deleting user: {ex.Message}");
                return BadRequest($"Error deleting user: {ex.Message}");
            }
        }

        // Get user by id - api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            // Check if UserId from token matches id from route to authorize get
            if (int.Parse(HttpContext.User.Claims.First(c => c.Type == "UserId").Value) != id)
            {
                _logger.Log($"Unauthorized request to get user {id}.");
                return Unauthorized("You are not authorized to access this resource.");
            }

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
            catch (Exception ex)
            {
                _logger.Log($"Error fetching user: {ex.Message}");
                return BadRequest($"Error fetching user: {ex.Message}");
            }
        }

        // Get all users - api/Users
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
    }
}