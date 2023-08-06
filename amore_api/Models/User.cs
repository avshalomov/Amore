using System.ComponentModel.DataAnnotations;

namespace amore_api.Models;

public partial class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [StringLength(20)]
    public string Username { get; set; }

    [Required]
    [StringLength(50)]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(10)]
    public string UserRole { get; set; }

    [Required]
    public DateTime LastLoginDate { get; set; }

    [Required]
    public DateTime DateCreated { get; set; }

    [Required]
    public string PasswordHash { get; set; }

    [Required]
    public string Picture { get; set; }

    // Navigation Properties
    public virtual Cart Cart { get; set; }
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}