using System.ComponentModel.DataAnnotations;

namespace amore_dal.Models
{
    public partial class User
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
        public byte[] PasswordHash { get; set; }  // Changed to byte array

        [Required]
        public string Picture { get; set; }

        // Navigation Properties
        public virtual Cart Cart { get; set; }
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
    public enum UserRole
    {
        User,
        Admin
    }
}
