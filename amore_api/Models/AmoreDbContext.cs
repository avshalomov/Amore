using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.IO;
using System;

namespace amore_api.Models;

public partial class AmoreDbContext : DbContext
{
    private readonly List<string> base64Images;
    public AmoreDbContext(DbContextOptions<AmoreDbContext> options) : base(options)
    {
        base64Images = ConvertImagesToBase64(@"images");
    }


    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Product> Products { get; set; }
    public virtual DbSet<Cart> Carts { get; set; }
    public virtual DbSet<CartItem> CartItems { get; set; }
    public virtual DbSet<Order> Orders { get; set; }
    public virtual DbSet<OrderItem> OrderItems { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Collation and Charset
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        // Model Builders

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");
            entity.ToTable("user");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Username).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(50);
            entity.Property(e => e.UserRole).IsRequired().HasMaxLength(10);
            entity.Property(e => e.LastLoginDate).IsRequired().HasColumnType("datetime");
            entity.Property(e => e.DateCreated).IsRequired().HasColumnType("datetime");
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Picture).IsRequired();

            entity.HasOne(e => e.Cart).WithOne(c => c.User).HasForeignKey<Cart>(c => c.UserId);
            entity.HasMany(e => e.Orders).WithOne(o => o.User).HasForeignKey(o => o.UserId);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PRIMARY");
            entity.ToTable("product");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Price).IsRequired().HasColumnType("decimal(18,2)").HasPrecision(18, 2);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Gender).IsRequired().HasMaxLength(6);
            entity.Property(e => e.StockQuantity).IsRequired();
            entity.Property(e => e.DateAdded).IsRequired().HasColumnType("datetime");
            entity.Property(e => e.Picture).IsRequired();

            entity.HasMany(e => e.CartItems).WithOne(c => c.Product).HasForeignKey(c => c.ProductId);
            entity.HasMany(e => e.OrderItems).WithOne(o => o.Product).HasForeignKey(o => o.ProductId);
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("PRIMARY");
            entity.ToTable("cart");
            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.UserId).IsRequired();

            entity.HasOne(e => e.User).WithOne(u => u.Cart).HasForeignKey<Cart>(e => e.UserId);
            entity.HasMany(e => e.CartItems).WithOne(c => c.Cart).HasForeignKey(c => c.CartId);
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.CartItemId).HasName("PRIMARY");
            entity.ToTable("cartItem");
            entity.Property(e => e.CartItemId).HasColumnName("CartItemID");
            entity.Property(e => e.CartId).IsRequired();
            entity.Property(e => e.ProductId).IsRequired();
            entity.Property(e => e.Quantity).IsRequired().HasDefaultValue(1);

            entity.HasOne(e => e.Cart).WithMany(c => c.CartItems).HasForeignKey(e => e.CartId);
            entity.HasOne(e => e.Product).WithMany(p => p.CartItems).HasForeignKey(e => e.ProductId);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PRIMARY");
            entity.ToTable("order");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.OrderDate).IsRequired();

            entity.HasOne(e => e.User).WithMany(u => u.Orders).HasForeignKey(e => e.UserId);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("PRIMARY");
            entity.ToTable("orderitem");
            entity.Property(e => e.OrderItemId).HasColumnName("OrderItemID");
            entity.Property(e => e.OrderId).IsRequired();
            entity.Property(e => e.ProductId).IsRequired();
            entity.Property(e => e.Quantity).IsRequired();

            entity.HasOne(e => e.Order).WithMany(o => o.OrderItems).HasForeignKey(e => e.OrderId);
            entity.HasOne(e => e.Product).WithMany(p => p.OrderItems).HasForeignKey(e => e.ProductId);
        });


        // Data Seeders

        // Seed User
        modelBuilder.Entity<User>().HasData(
            new User { UserId = 1, Username = "admin", Email = "admin@mail.com", UserRole = "Admin", LastLoginDate = DateTime.Parse("2023-08-01 08:00:00"), DateCreated = DateTime.Parse("2023-02-01 08:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[0] },
            new User { UserId = 2, Username = "johnDoe", Email = "john.doe@yahoo.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-01 08:00:00"), DateCreated = DateTime.Parse("2023-02-01 08:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[1] },
            new User { UserId = 3, Username = "janeSmith", Email = "jane.smith@gmail.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-02 10:00:00"), DateCreated = DateTime.Parse("2023-03-15 10:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[2] },
            new User { UserId = 4, Username = "bobJohnson", Email = "bob.johnson@protonmail.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-03 12:00:00"), DateCreated = DateTime.Parse("2023-01-10 12:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[3] },
            new User { UserId = 5, Username = "susanClark", Email = "susan.clark@outlook.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-04 14:00:00"), DateCreated = DateTime.Parse("2023-05-20 14:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[4] },
            new User { UserId = 6, Username = "mikeBrown", Email = "mike.brown@walla.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-05 16:00:00"), DateCreated = DateTime.Parse("2023-04-25 16:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[5] },
            new User { UserId = 7, Username = "lindaDavis", Email = "linda.davis@yahoo.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-06 18:00:00"), DateCreated = DateTime.Parse("2023-07-05 18:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[6] },
            new User { UserId = 8, Username = "richardMiller", Email = "richard.miller@gmail.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-07 20:00:00"), DateCreated = DateTime.Parse("2023-06-15 20:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[7] },
            new User { UserId = 9, Username = "maryWilson", Email = "mary.wilson@protonmail.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-08 08:00:00"), DateCreated = DateTime.Parse("2023-01-30 08:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[8] },
            new User { UserId = 10, Username = "jamesMoore", Email = "james.moore@outlook.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-09 10:00:00"), DateCreated = DateTime.Parse("2023-08-10 10:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[9] },
            new User { UserId = 11, Username = "patriciaTaylor", Email = "patricia.taylor@walla.com", UserRole = "User", LastLoginDate = DateTime.Parse("2023-08-10 12:00:00"), DateCreated = DateTime.Parse("2023-02-25 12:00:00"), PasswordHash = "hashedpassword", Picture = base64Images[10] }
        );

        // Seed Product
        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1, ProductName = "Slim Fit Jeans", Description = "Classic blue slim fit jeans.", Price = 49.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-01-03"), Category = "Jeans", Gender = "Female", Picture = base64Images[11] },
            new Product { ProductId = 2, ProductName = "Striped T-Shirt", Description = "Cotton t-shirt with blue and white stripes.", Price = 19.99m, Category = "T-Shirts", Gender = "Female", StockQuantity = 150, DateAdded = DateTime.Parse("2023-01-06"), Picture = base64Images[12] },
            new Product { ProductId = 3, ProductName = "Leather Jacket", Description = "Black leather jacket with zipper.", Price = 99.99m, Category = "Jackets", Gender = "Male", StockQuantity = 80, DateAdded = DateTime.Parse("2023-01-09"), Picture = base64Images[13] },
            new Product { ProductId = 4, ProductName = "Ankle Boots", Description = "Black leather ankle boots for women.", Price = 79.99m, Category = "Shoes", Gender = "Female", StockQuantity = 120, DateAdded = DateTime.Parse("2023-01-13"), Picture = base64Images[14] },
            new Product { ProductId = 5, ProductName = "Cotton Socks", Description = "Pack of 5 pairs of cotton socks.", Price = 9.99m, Category = "Socks", Gender = "Unisex", StockQuantity = 300, DateAdded = DateTime.Parse("2023-01-15"), Picture = base64Images[15] },
            new Product { ProductId = 6, ProductName = "Wool Sweater", Description = "Warm wool sweater in light grey color.", Price = 59.99m, Category = "Sweaters", Gender = "Female", StockQuantity = 100, DateAdded = DateTime.Parse("2023-01-20"), Picture = base64Images[16] },
            new Product { ProductId = 7, ProductName = "Silk Scarf", Description = "Elegant silk scarf with floral pattern.", Price = 29.99m, Category = "Accessories", Gender = "Female", StockQuantity = 200, DateAdded = DateTime.Parse("2023-01-25"), Picture = base64Images[17] },
            new Product { ProductId = 8, ProductName = "Pleated Skirt", Description = "Black pleated skirt in midi length.", Price = 39.99m, Category = "Skirts", Gender = "Female", StockQuantity = 120, DateAdded = DateTime.Parse("2023-01-30"), Picture = base64Images[18] },
            new Product { ProductId = 9, ProductName = "Tote Bag", Description = "Large tote bag in brown leather.", Price = 69.99m, Category = "Bags", Gender = "Female", StockQuantity = 90, DateAdded = DateTime.Parse("2023-02-01"), Picture = base64Images[19] },
            new Product { ProductId = 10, ProductName = "Bomber Jacket", Description = "Green bomber jacket with side pockets.", Price = 89.99m, Category = "Jackets", Gender = "Unisex", StockQuantity = 100, DateAdded = DateTime.Parse("2023-02-03"), Picture = base64Images[20] },
            new Product { ProductId = 11, ProductName = "Sports Bra", Description = "High support sports bra in black.", Price = 24.99m, Category = "Sportswear", Gender = "Female", StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-15"), Picture = base64Images[21] },
            new Product { ProductId = 12, ProductName = "Running Shoes", Description = "Men's running shoes in white.", Price = 59.99m, Category = "Shoes", Gender = "Unisex", StockQuantity = 100, DateAdded = DateTime.Parse("2023-05-20"), Picture = base64Images[22] },
            new Product { ProductId = 13, ProductName = "Denim Shorts", Description = "High waisted denim shorts for women.", Price = 29.99m, Category = "Shorts", Gender = "Female", StockQuantity = 200, DateAdded = DateTime.Parse("2023-05-22"), Picture = base64Images[23] },
            new Product { ProductId = 14, ProductName = "Men's Polo", Description = "Polo shirt in navy blue for men.", Price = 34.99m, Category = "Polos", Gender = "Male", StockQuantity = 180, DateAdded = DateTime.Parse("2023-05-25"), Picture = base64Images[24] },
            new Product { ProductId = 15, ProductName = "Kids Sneakers", Description = "Colorful sneakers for kids.", Price = 29.99m, Category = "Shoes", Gender = "Female", StockQuantity = 250, DateAdded = DateTime.Parse("2023-05-28"), Picture = base64Images[25] },
            new Product { ProductId = 16, ProductName = "Baby Romper", Description = "Cotton romper with cute prints for babies.", Price = 14.99m, Category = "Baby", Gender = "Unisex", StockQuantity = 300, DateAdded = DateTime.Parse("2023-05-30"), Picture = base64Images[26] },
            new Product { ProductId = 17, ProductName = "Cycling Gloves", Description = "Comfortable cycling gloves in black.", Price = 19.99m, Category = "Sportswear", Gender = "Unisex", StockQuantity = 100, DateAdded = DateTime.Parse("2023-06-01"), Picture = base64Images[27] },
            new Product { ProductId = 18, ProductName = "Rain Jacket", Description = "Waterproof rain jacket in yellow.", Price = 49.99m, Category = "Jackets", Gender = "Female", StockQuantity = 150, DateAdded = DateTime.Parse("2023-06-04"), Picture = base64Images[28] },
            new Product { ProductId = 19, ProductName = "Sunglasses", Description = "UV protection sunglasses with round frames.", Price = 29.99m, Category = "Accessories", Gender = "Female", StockQuantity = 200, DateAdded = DateTime.Parse("2023-06-06"), Picture = base64Images[29] },
            new Product { ProductId = 20, ProductName = "Beach Hat", Description = "Wide brim beach hat in straw.", Price = 19.99m, Category = "Accessories", Gender = "Female", StockQuantity = 220, DateAdded = DateTime.Parse("2023-06-10"), Picture = base64Images[30] },
            new Product { ProductId = 21, ProductName = "Canvas Sneakers", Description = "Classic white canvas sneakers.", Price = 39.99m, Category = "Shoes", Gender = "Unisex", StockQuantity = 250, DateAdded = DateTime.Parse("2023-02-15"), Picture = base64Images[31] },
            new Product { ProductId = 22, ProductName = "Leather Belt", Description = "Brown leather belt with brass buckle.", Price = 24.99m, Category = "Accessories", Gender = "Unisex", StockQuantity = 300, DateAdded = DateTime.Parse("2023-02-20"), Picture = base64Images[32] },
            new Product { ProductId = 23, ProductName = "Wool Hat", Description = "Warm wool hat for winter.", Price = 19.99m, Category = "Accessories", Gender = "Female", StockQuantity = 150, DateAdded = DateTime.Parse("2023-02-25"), Picture = base64Images[33] },
            new Product { ProductId = 24, ProductName = "Gym Shorts", Description = "Comfortable gym shorts for men.", Price = 29.99m, Category = "Sportswear", Gender = "Male", StockQuantity = 200, DateAdded = DateTime.Parse("2023-03-01"), Picture = base64Images[34] },
            new Product { ProductId = 25, ProductName = "Yoga Mat", Description = "Non-slip yoga mat.", Price = 34.99m, Category = "Sportswear", Gender = "Unisex", StockQuantity = 100, DateAdded = DateTime.Parse("2023-03-05"), Picture = base64Images[35] },
            new Product { ProductId = 26, ProductName = "Denim Jacket", Description = "Blue denim jacket with buttons.", Price = 59.99m, Category = "Jackets", Gender = "Female", StockQuantity = 150, DateAdded = DateTime.Parse("2023-03-10"), Picture = base64Images[36] },
            new Product { ProductId = 27, ProductName = "Silk Dress", Description = "Elegant silk dress in black.", Price = 89.99m, Category = "Dresses", Gender = "Female", StockQuantity = 100, DateAdded = DateTime.Parse("2023-03-15"), Picture = base64Images[37] },
            new Product { ProductId = 28, ProductName = "Leather Wallet", Description = "Compact leather wallet for men.", Price = 49.99m, Category = "Accessories", Gender = "Unisex", StockQuantity = 200, DateAdded = DateTime.Parse("2023-03-20"), Picture = base64Images[38] },
            new Product { ProductId = 29, ProductName = "Suede Boots", Description = "Knee-high suede boots for women.", Price = 99.99m, Category = "Shoes", Gender = "Female", StockQuantity = 80, DateAdded = DateTime.Parse("2023-03-25"), Picture = base64Images[39] },
            new Product { ProductId = 30, ProductName = "Cotton Boxers", Description = "Pack of 3 cotton boxers for men.", Price = 29.99m, Category = "Underwear", Gender = "Male", StockQuantity = 300, DateAdded = DateTime.Parse("2023-04-01"), Picture = base64Images[40] },
            new Product { ProductId = 31, ProductName = "Bikini", Description = "Two-piece bikini in floral print.", Price = 39.99m, Category = "Swimwear", Gender = "Female", StockQuantity = 200, DateAdded = DateTime.Parse("2023-04-10"), Picture = base64Images[41] },
            new Product { ProductId = 32, ProductName = "Rash Guard", Description = "Long sleeve rash guard for surfing.", Price = 49.99m, Category = "Swimwear", Gender = "Female", StockQuantity = 150, DateAdded = DateTime.Parse("2023-04-15"), Picture = base64Images[42] },
            new Product { ProductId = 33, ProductName = "Cargo Pants", Description = "Khaki cargo pants for men.", Price = 59.99m, Category = "Pants", Gender = "Male", StockQuantity = 100, DateAdded = DateTime.Parse("2023-04-20"), Picture = base64Images[43] },
            new Product { ProductId = 34, ProductName = "Pleated Trousers", Description = "Grey pleated trousers for women.", Price = 59.99m, Category = "Pants", Gender = "Female", StockQuantity = 120, DateAdded = DateTime.Parse("2023-04-25"), Picture = base64Images[44] },
            new Product { ProductId = 35, ProductName = "Lace Blouse", Description = "White lace blouse with long sleeves.", Price = 49.99m, Category = "Tops", Gender = "Female", StockQuantity = 150, DateAdded = DateTime.Parse("2023-04-30"), Picture = base64Images[45] },
            new Product { ProductId = 36, ProductName = "Beanie", Description = "Knitted beanie in multiple colors.", Price = 14.99m, Category = "Accessories", Gender = "Female", StockQuantity = 250, DateAdded = DateTime.Parse("2023-05-05"), Picture = base64Images[46] },
            new Product { ProductId = 37, ProductName = "Denim Shirt", Description = "Long sleeve denim shirt for men.", Price = 39.99m, Category = "Shirts", Gender = "Male", StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-10"), Picture = base64Images[47] },
            new Product { ProductId = 38, ProductName = "Cashmere Sweater", Description = "Soft cashmere sweater in beige.", Price = 79.99m, Category = "Sweaters", Gender = "Female", StockQuantity = 120, DateAdded = DateTime.Parse("2023-05-15"), Picture = base64Images[48] },
            new Product { ProductId = 39, ProductName = "Maxi Dress", Description = "Floral print maxi dress for women.", Price = 69.99m, Category = "Dresses", Gender = "Female", StockQuantity = 100, DateAdded = DateTime.Parse("2023-05-20"), Picture = base64Images[49] },
            new Product { ProductId = 40, ProductName = "Flannel Shirt", Description = "Comfortable flannel shirt for men.", Price = 44.99m, Category = "Shirts", Gender = "Male", StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-25"), Picture = base64Images[50] }
        );

        // Seed Cart
        modelBuilder.Entity<Cart>().HasData(
            new Cart { CartId = 1, UserId = 1 },
            new Cart { CartId = 2, UserId = 2 },
            new Cart { CartId = 3, UserId = 3 },
            new Cart { CartId = 4, UserId = 4 },
            new Cart { CartId = 5, UserId = 5 },
            new Cart { CartId = 6, UserId = 6 },
            new Cart { CartId = 7, UserId = 7 },
            new Cart { CartId = 8, UserId = 8 },
            new Cart { CartId = 9, UserId = 9 },
            new Cart { CartId = 10, UserId = 10 },
            new Cart { CartId = 11, UserId = 11 }
        );

        // Seed CartItem
        modelBuilder.Entity<CartItem>().HasData(
            new CartItem { CartItemId = 1, CartId = 1, ProductId = 1, Quantity = 1 },
            new CartItem { CartItemId = 2, CartId = 1, ProductId = 2, Quantity = 1 },
            new CartItem { CartItemId = 3, CartId = 2, ProductId = 3, Quantity = 2 },
            new CartItem { CartItemId = 4, CartId = 2, ProductId = 4, Quantity = 1 },
            new CartItem { CartItemId = 5, CartId = 3, ProductId = 5, Quantity = 1 },
            new CartItem { CartItemId = 6, CartId = 3, ProductId = 6, Quantity = 3 },
            new CartItem { CartItemId = 7, CartId = 4, ProductId = 7, Quantity = 2 },
            new CartItem { CartItemId = 8, CartId = 4, ProductId = 8, Quantity = 1 },
            new CartItem { CartItemId = 9, CartId = 5, ProductId = 9, Quantity = 1 },
            new CartItem { CartItemId = 10, CartId = 5, ProductId = 10, Quantity = 1 },
            new CartItem { CartItemId = 11, CartId = 6, ProductId = 1, Quantity = 2 },
            new CartItem { CartItemId = 12, CartId = 6, ProductId = 2, Quantity = 1 },
            new CartItem { CartItemId = 13, CartId = 7, ProductId = 3, Quantity = 1 },
            new CartItem { CartItemId = 14, CartId = 7, ProductId = 4, Quantity = 1 },
            new CartItem { CartItemId = 15, CartId = 8, ProductId = 5, Quantity = 2 },
            new CartItem { CartItemId = 16, CartId = 8, ProductId = 6, Quantity = 1 },
            new CartItem { CartItemId = 17, CartId = 9, ProductId = 7, Quantity = 1 },
            new CartItem { CartItemId = 18, CartId = 9, ProductId = 8, Quantity = 3 },
            new CartItem { CartItemId = 19, CartId = 10, ProductId = 9, Quantity = 1 },
            new CartItem { CartItemId = 20, CartId = 10, ProductId = 10, Quantity = 2 }
        );

        // Seed Order
        modelBuilder.Entity<Order>().HasData(
            new Order { OrderId = 1, UserId = 1, OrderDate = new DateTime(2023, 8, 5) },
            new Order { OrderId = 2, UserId = 2, OrderDate = new DateTime(2023, 8, 7) },
            new Order { OrderId = 3, UserId = 3, OrderDate = new DateTime(2023, 8, 10) },
            new Order { OrderId = 4, UserId = 4, OrderDate = new DateTime(2023, 8, 12) },
            new Order { OrderId = 5, UserId = 5, OrderDate = new DateTime(2023, 8, 15) },
            new Order { OrderId = 6, UserId = 6, OrderDate = new DateTime(2023, 8, 17) },
            new Order { OrderId = 7, UserId = 7, OrderDate = new DateTime(2023, 8, 20) },
            new Order { OrderId = 8, UserId = 8, OrderDate = new DateTime(2023, 8, 23) },
            new Order { OrderId = 9, UserId = 9, OrderDate = new DateTime(2023, 8, 25) },
            new Order { OrderId = 10, UserId = 10, OrderDate = new DateTime(2023, 8, 27) }
        );

        // Seed OrderItem
        modelBuilder.Entity<OrderItem>().HasData(
            new OrderItem { OrderItemId = 1, OrderId = 1, ProductId = 1, Quantity = 2 },
            new OrderItem { OrderItemId = 2, OrderId = 1, ProductId = 2, Quantity = 1 },
            new OrderItem { OrderItemId = 3, OrderId = 2, ProductId = 3, Quantity = 1 },
            new OrderItem { OrderItemId = 4, OrderId = 2, ProductId = 4, Quantity = 2 },
            new OrderItem { OrderItemId = 5, OrderId = 3, ProductId = 5, Quantity = 1 },
            new OrderItem { OrderItemId = 6, OrderId = 3, ProductId = 6, Quantity = 3 },
            new OrderItem { OrderItemId = 7, OrderId = 4, ProductId = 7, Quantity = 2 },
            new OrderItem { OrderItemId = 8, OrderId = 4, ProductId = 8, Quantity = 1 },
            new OrderItem { OrderItemId = 9, OrderId = 5, ProductId = 9, Quantity = 1 },
            new OrderItem { OrderItemId = 10, OrderId = 5, ProductId = 10, Quantity = 1 },
            new OrderItem { OrderItemId = 11, OrderId = 6, ProductId = 11, Quantity = 1 },
            new OrderItem { OrderItemId = 12, OrderId = 6, ProductId = 12, Quantity = 2 },
            new OrderItem { OrderItemId = 13, OrderId = 7, ProductId = 13, Quantity = 1 },
            new OrderItem { OrderItemId = 14, OrderId = 7, ProductId = 14, Quantity = 3 },
            new OrderItem { OrderItemId = 15, OrderId = 8, ProductId = 15, Quantity = 2 },
            new OrderItem { OrderItemId = 16, OrderId = 8, ProductId = 16, Quantity = 1 },
            new OrderItem { OrderItemId = 17, OrderId = 9, ProductId = 17, Quantity = 1 },
            new OrderItem { OrderItemId = 18, OrderId = 9, ProductId = 18, Quantity = 2 },
            new OrderItem { OrderItemId = 19, OrderId = 10, ProductId = 19, Quantity = 1 },
            new OrderItem { OrderItemId = 20, OrderId = 10, ProductId = 20, Quantity = 1 }
        );


        OnModelCreatingPartial(modelBuilder);
    }

    static List<string> ConvertImagesToBase64(string imageDirectory)
    {
        // Get all the image file paths
        string[] imageFiles = Directory.GetFiles(imageDirectory, "img*.jpg")
                                        .Union(Directory.GetFiles(imageDirectory, "img*.jpeg"))
                                        .Union(Directory.GetFiles(imageDirectory, "img*.png"))
                                        .OrderBy(f => int.Parse(Path.GetFileNameWithoutExtension(f).Substring(3)))
                                        .ToArray();

        // Store all the base64 strings
        List<string> base64Strings = new List<string>();

        foreach (string imagePath in imageFiles)
        {
            byte[] imageBytes = File.ReadAllBytes(imagePath);
            string base64String = Convert.ToBase64String(imageBytes);
            base64Strings.Add(base64String);
        }

        return base64Strings;
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}