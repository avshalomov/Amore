using System.ComponentModel.DataAnnotations;

namespace amore_api.Models;

public partial class OrderItem
{
    [Key]
    public int OrderItemId { get; set; }

    [Required]
    public int OrderId { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }

    // Navigation Properties
    public virtual Order Order { get; set; }
    public virtual Product Product { get; set; }
}