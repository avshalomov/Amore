using System.ComponentModel.DataAnnotations;

namespace amore_api.Models;

public partial class CartItem
{
    [Key]
    public int CartItemId { get; set; }

    [Required]
    public int CartId { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }

    // Navigation Properties
    public virtual Cart Cart { get; set; }
    public virtual Product Product { get; set; }
}