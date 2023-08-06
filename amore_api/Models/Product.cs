using System.ComponentModel.DataAnnotations;

namespace amore_api.Models;

public partial class Product
{
    [Key]
    public int ProductId { get; set; }

    [Required]
    [StringLength(50)]
    public string ProductName { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    [Range(0.01, (double)Decimal.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [StringLength(20)]
    public string Category { get; set; }

    [Required]
    [StringLength(6)]
    public string Gender { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [Required]
    public DateTime DateAdded { get; set; }

    [Required]
    public string Picture { get; set; }

    // Navigation Properties
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}