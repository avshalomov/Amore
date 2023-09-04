using System.ComponentModel.DataAnnotations;

namespace amore_dal.DTOs
{
    public class CartDto
    {
        [Key]
        public int CartId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public decimal TotalPrice { get; set; }
    }
}
