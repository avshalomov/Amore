using amore_dal.Models;
using System.ComponentModel.DataAnnotations;

namespace amore_dal.DTOs
{
    public class OrderDto
    {
        [Key]
        public int OrderId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public OrderStatus Status { get; set; }  // Enum
    }
}
