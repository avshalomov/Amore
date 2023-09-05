using Microsoft.AspNetCore.Mvc;
using amore_dal.Repositories;
using amore_dal.DTOs;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET: api/Users
        // Returns all users info:
        // UserId, Username, Email, UserRole, LastLoginDate, DateCreated, Picture.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            try
            {
                var usersDto = await _userRepository.GetAllUsersAsync();
                if (usersDto == null || !usersDto.Any()) return NotFound("No users found.");
                return Ok(usersDto);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        // GET: api/Users/5
        // Returns a user info:
        // UserId, Username, Email, UserRole, LastLoginDate, DateCreated, Picture.
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            try
            {
                var userDto = await _userRepository.GetUserByIdAsync(id);
                if (userDto == null) return NotFound($"User with id {id} not found.");
                return userDto;
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        // PUT: api/Users/5
        // Validate, check if username and email are unique, update user, save user to database.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto userDto)
        {
            try
            {
                var updatedUser = await _userRepository.UpdateUserAsync(id, userDto);
                if (updatedUser == null) return NotFound($"User with id {id} not found.");
                return NoContent();
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        // POST: api/Users
        // Validate, check if username and email are unique, create user, hash password, create cart, save user to database.
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUser(UserDto userDto)
        {
            try
            {
                var newUserDto = await _userRepository.CreateUserAsync(userDto);
                if (newUserDto == null) return BadRequest("User could not be created.");
                return CreatedAtAction("GetUser", new { id = newUserDto.UserId }, newUserDto);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        // DELETE: api/Users/5
        // Delete user from database and the user's cart with all the cart items.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var isDeleted = await _userRepository.DeleteUserAsync(id);
                if (!isDeleted) return NotFound($"User with id {id} not found.");
                return NoContent();
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}