using System.ComponentModel.DataAnnotations;

namespace amore_api.Models;

public partial class Order
{
    [Key]
    public int OrderId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public DateTime OrderDate { get; set; }

    // Navigation Properties
    public virtual User User { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}