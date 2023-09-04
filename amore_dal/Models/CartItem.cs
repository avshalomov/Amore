using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace amore_dal.Models
{
    public partial class CartItem
    {
        [Key]
        public int CartItemId { get; set; }

        [Required]
        public int CartId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        // Navigation Properties
        [JsonIgnore]
        public virtual Cart Cart { get; set; }
        [JsonIgnore]
        public virtual Product Product { get; set; }
    }
}
