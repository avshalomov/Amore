using System;
using System.Collections.Generic;

namespace amore_api.Models;

public partial class Cart
{
    public int CartId { get; set; }

    public int? UserId { get; set; }

    public virtual ICollection<Cartitem> Cartitems { get; set; } = new List<Cartitem>();

    public virtual User? User { get; set; }
}