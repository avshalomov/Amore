using System.ComponentModel.DataAnnotations;

namespace amore_dal.Models
{
    public partial class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 3)]
        public string ProductName { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [StringLength(20)]
        public string Category { get; set; }

        [Required]
        public Gender Gender { get; set; }  // Enum

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

    public enum Gender
    {
        Unisex,
        Male,
        Female
    }
}
