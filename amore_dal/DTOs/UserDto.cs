using System.ComponentModel.DataAnnotations;
using amore_dal.Models;

namespace amore_dal.DTOs
{
    public class UserDto
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        [StringLength(50)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public UserRole UserRole { get; set; }  // Enum

        [Required]
        public DateTime LastLoginDate { get; set; }

        [Required]
        public DateTime DateCreated { get; set; }

        [Required]
        public string PasswordHash { get; set; }  // Changed to byte array

        [Required]
        public string Picture { get; set; }
    }
}
