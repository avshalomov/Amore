using amore_dal.Models;
using System.ComponentModel.DataAnnotations;

namespace amore_dal.DTOs
{
    public class ProductDto
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
    }
}
