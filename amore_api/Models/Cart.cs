using System.ComponentModel.DataAnnotations;

namespace amore_api.Models;

public class Cart
{
    [Key]
    public int CartId { get; set; }

    [Required]
    public int UserId { get; set; }

    // Navigation Properties
    public virtual User User { get; set; }
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}