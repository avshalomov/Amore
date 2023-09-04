using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace amore_dal.Models
{
    public partial class Order
    {
        [Key]
        public int OrderId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public OrderStatus Status { get; set; }  // Enum

        // Navigation Properties
        [JsonIgnore]
        public virtual User? User { get; set; }
        [JsonIgnore]
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
    public enum OrderStatus
    {
        Processing,
        Shipped,
        Delivered,
        Canceled
    }
}
