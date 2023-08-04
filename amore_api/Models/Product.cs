using System;
using System.Collections.Generic;

namespace amore_api.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public string? ProductName { get; set; }

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    public int? StockQuantity { get; set; }

    public DateTime? DateAdded { get; set; }

    public string? Category { get; set; }

    public virtual ICollection<Cartitem> Cartitems { get; set; } = new List<Cartitem>();

    public virtual ICollection<Orderitem> Orderitems { get; set; } = new List<Orderitem>();
}
