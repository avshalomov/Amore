using System.ComponentModel.DataAnnotations;

namespace amore_dal.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public decimal TotalPrice { get; set; }

        // Navigation Properties
        public virtual User User { get; set; }
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}