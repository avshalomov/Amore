using System.ComponentModel.DataAnnotations;

namespace amore_dal.DTOs
{
    public class RegisterDto
    {
        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        [StringLength(50)]
        [EmailAddress]
        public string Email { get; set; }


        [Required]
        public string Password { get; set; }

        [Required]
        public string Picture { get; set; }
    }
}
