﻿using Microsoft.AspNetCore.Mvc;
using amore_dal.Repositories;
using amore_dal.DTOs;

namespace amore_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly LoggerService _logger;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _logger = LoggerService.Instance;
        }

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
            catch (Exception ex)
            {
                _logger.Log($"Error fetching user: {ex.Message}");
                return BadRequest($"Error fetching user: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> PutUser(int id, UserDto userDto)
        {
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

        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUser(UserDto userDto)
        {
            try
            {
                var newUserDto = await _userRepository.CreateUserAsync(userDto);
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

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
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
    }
}