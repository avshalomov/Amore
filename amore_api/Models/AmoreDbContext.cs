using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System;

namespace amore_api.Models;

public partial class AmoreDbContext : DbContext
{
    private IConfiguration _configuration;

    public AmoreDbContext()
    {
    }

    public AmoreDbContext(DbContextOptions<AmoreDbContext> options)
        : base(options)
    {
    }

    public AmoreDbContext(DbContextOptions<AmoreDbContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Product> Products { get; set; }
    public virtual DbSet<Cart> Carts { get; set; }
    public virtual DbSet<Cartitem> Cartitems { get; set; }
    public virtual DbSet<Order> Orders { get; set; }
    public virtual DbSet<Orderitem> Orderitems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseMySql(_configuration.GetConnectionString("amore_db_string"),
            new MySqlServerVersion(new Version(8, 0, 21)));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("PRIMARY");

            entity.ToTable("cart");

            entity.HasIndex(e => e.UserId, "UserID");

            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Carts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("cart_ibfk_1");
        });

        modelBuilder.Entity<Cartitem>(entity =>
        {
            entity.HasKey(e => e.CartItemId).HasName("PRIMARY");

            entity.ToTable("cartitems");

            entity.HasIndex(e => e.CartId, "CartID");

            entity.HasIndex(e => e.ProductId, "ProductID");

            entity.Property(e => e.CartItemId).HasColumnName("CartItemID");
            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");

            entity.HasOne(d => d.Cart).WithMany(p => p.Cartitems)
                .HasForeignKey(d => d.CartId)
                .HasConstraintName("cartitems_ibfk_1");

            entity.HasOne(d => d.Product).WithMany(p => p.Cartitems)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("cartitems_ibfk_2");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PRIMARY");

            entity.ToTable("order");

            entity.HasIndex(e => e.UserId, "UserID");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("order_ibfk_1");
        });

        modelBuilder.Entity<Orderitem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("PRIMARY");

            entity.ToTable("orderitems");

            entity.HasIndex(e => e.OrderId, "OrderID");

            entity.HasIndex(e => e.ProductId, "ProductID");

            entity.Property(e => e.OrderItemId).HasColumnName("OrderItemID");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");

            entity.HasOne(d => d.Order).WithMany(p => p.Orderitems)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("orderitems_ibfk_1");

            entity.HasOne(d => d.Product).WithMany(p => p.Orderitems)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("orderitems_ibfk_2");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PRIMARY");

            entity.ToTable("product");

            entity.Property(e => e.ProductId).HasColumnName("ProductID");
            entity.Property(e => e.Category).HasMaxLength(50);
            entity.Property(e => e.DateAdded).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.ProductName).HasMaxLength(100);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.DateCreated).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.LastLoginDate).HasColumnType("datetime");
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.PasswordSalt).HasMaxLength(255);
            entity.Property(e => e.UserRole).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        // Seed User
        modelBuilder.Entity<User>().HasData(
            new User { UserId = 1, Username = "admin", Email = "admin@mail.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "Admin", DateCreated = DateTime.Parse("2023-02-01 08:00:00"), LastLoginDate = DateTime.Parse("2023-08-01 08:00:00") },
            new User { UserId = 2, Username = "johnDoe", Email = "john.doe@yahoo.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-02-01 08:00:00"), LastLoginDate = DateTime.Parse("2023-08-01 08:00:00") },
            new User { UserId = 3, Username = "janeSmith", Email = "jane.smith@gmail.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-03-15 10:00:00"), LastLoginDate = DateTime.Parse("2023-08-02 10:00:00") },
            new User { UserId = 4, Username = "bobJohnson", Email = "bob.johnson@protonmail.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-01-10 12:00:00"), LastLoginDate = DateTime.Parse("2023-08-03 12:00:00") },
            new User { UserId = 5, Username = "susanClark", Email = "susan.clark@outlook.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-05-20 14:00:00"), LastLoginDate = DateTime.Parse("2023-08-04 14:00:00") },
            new User { UserId = 6, Username = "mikeBrown", Email = "mike.brown@walla.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-04-25 16:00:00"), LastLoginDate = DateTime.Parse("2023-08-05 16:00:00") },
            new User { UserId = 7, Username = "lindaDavis", Email = "linda.davis@yahoo.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-07-05 18:00:00"), LastLoginDate = DateTime.Parse("2023-08-06 18:00:00") },
            new User { UserId = 8, Username = "richardMiller", Email = "richard.miller@gmail.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-06-15 20:00:00"), LastLoginDate = DateTime.Parse("2023-08-07 20:00:00") },
            new User { UserId = 9, Username = "maryWilson", Email = "mary.wilson@protonmail.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-01-30 08:00:00"), LastLoginDate = DateTime.Parse("2023-08-08 08:00:00") },
            new User { UserId = 10, Username = "jamesMoore", Email = "james.moore@outlook.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-08-10 10:00:00"), LastLoginDate = DateTime.Parse("2023-08-09 10:00:00") },
            new User { UserId = 11, Username = "patriciaTaylor", Email = "patricia.taylor@walla.com", PasswordHash = "hashedpassword", PasswordSalt = "salt", UserRole = "User", DateCreated = DateTime.Parse("2023-02-25 12:00:00"), LastLoginDate = DateTime.Parse("2023-08-10 12:00:00") }
        );

        // Seed Product
        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1, ProductName = "Slim Fit Jeans", Description = "Classic blue slim fit jeans.", Price = 49.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-01-03"), Category = "Jeans" },
            new Product { ProductId = 2, ProductName = "Striped T-Shirt", Description = "Cotton t-shirt with blue and white stripes.", Price = 19.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-01-06"), Category = "T-Shirts" },
            new Product { ProductId = 3, ProductName = "Leather Jacket", Description = "Black leather jacket with zipper.", Price = 99.99m, StockQuantity = 80, DateAdded = DateTime.Parse("2023-01-09"), Category = "Jackets" },
            new Product { ProductId = 4, ProductName = "Ankle Boots", Description = "Black leather ankle boots for women.", Price = 79.99m, StockQuantity = 120, DateAdded = DateTime.Parse("2023-01-13"), Category = "Shoes" },
            new Product { ProductId = 5, ProductName = "Cotton Socks", Description = "Pack of 5 pairs of cotton socks.", Price = 9.99m, StockQuantity = 300, DateAdded = DateTime.Parse("2023-01-15"), Category = "Socks" },
            new Product { ProductId = 6, ProductName = "Wool Sweater", Description = "Warm wool sweater in light grey color.", Price = 59.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-01-20"), Category = "Sweaters" },
            new Product { ProductId = 7, ProductName = "Silk Scarf", Description = "Elegant silk scarf with floral pattern.", Price = 29.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-01-25"), Category = "Accessories" },
            new Product { ProductId = 8, ProductName = "Pleated Skirt", Description = "Black pleated skirt in midi length.", Price = 39.99m, StockQuantity = 120, DateAdded = DateTime.Parse("2023-01-30"), Category = "Skirts" },
            new Product { ProductId = 9, ProductName = "Tote Bag", Description = "Large tote bag in brown leather.", Price = 69.99m, StockQuantity = 90, DateAdded = DateTime.Parse("2023-02-01"), Category = "Bags" },
            new Product { ProductId = 10, ProductName = "Bomber Jacket", Description = "Green bomber jacket with side pockets.", Price = 89.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-02-03"), Category = "Jackets" },
            new Product { ProductId = 11, ProductName = "Sports Bra", Description = "High support sports bra in black.", Price = 24.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-15"), Category = "Sportswear" },
            new Product { ProductId = 12, ProductName = "Running Shoes", Description = "Men's running shoes in white.", Price = 59.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-05-20"), Category = "Shoes" },
            new Product { ProductId = 13, ProductName = "Denim Shorts", Description = "High waisted denim shorts for women.", Price = 29.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-05-22"), Category = "Shorts" },
            new Product { ProductId = 14, ProductName = "Men's Polo", Description = "Polo shirt in navy blue for men.", Price = 34.99m, StockQuantity = 180, DateAdded = DateTime.Parse("2023-05-25"), Category = "Polos" },
            new Product { ProductId = 15, ProductName = "Kids Sneakers", Description = "Colorful sneakers for kids.", Price = 29.99m, StockQuantity = 250, DateAdded = DateTime.Parse("2023-05-28"), Category = "Shoes" },
            new Product { ProductId = 16, ProductName = "Baby Romper", Description = "Cotton romper with cute prints for babies.", Price = 14.99m, StockQuantity = 300, DateAdded = DateTime.Parse("2023-05-30"), Category = "Baby" },
            new Product { ProductId = 17, ProductName = "Cycling Gloves", Description = "Comfortable cycling gloves in black.", Price = 19.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-06-01"), Category = "Sportswear" },
            new Product { ProductId = 18, ProductName = "Rain Jacket", Description = "Waterproof rain jacket in yellow.", Price = 49.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-06-04"), Category = "Jackets" },
            new Product { ProductId = 19, ProductName = "Sunglasses", Description = "UV protection sunglasses with round frames.", Price = 29.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-06-06"), Category = "Accessories" },
            new Product { ProductId = 20, ProductName = "Beach Hat", Description = "Wide brim beach hat in straw.", Price = 19.99m, StockQuantity = 220, DateAdded = DateTime.Parse("2023-06-10"), Category = "Accessories" },
            new Product { ProductId = 21, ProductName = "Canvas Sneakers", Description = "Classic white canvas sneakers.", Price = 39.99m, StockQuantity = 250, DateAdded = DateTime.Parse("2023-02-15"), Category = "Shoes" },
            new Product { ProductId = 22, ProductName = "Leather Belt", Description = "Brown leather belt with brass buckle.", Price = 24.99m, StockQuantity = 300, DateAdded = DateTime.Parse("2023-02-20"), Category = "Accessories" },
            new Product { ProductId = 23, ProductName = "Wool Hat", Description = "Warm wool hat for winter.", Price = 19.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-02-25"), Category = "Accessories" },
            new Product { ProductId = 24, ProductName = "Gym Shorts", Description = "Comfortable gym shorts for men.", Price = 29.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-03-01"), Category = "Sportswear" },
            new Product { ProductId = 25, ProductName = "Yoga Mat", Description = "Non-slip yoga mat.", Price = 34.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-03-05"), Category = "Sportswear" },
            new Product { ProductId = 26, ProductName = "Denim Jacket", Description = "Blue denim jacket with buttons.", Price = 59.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-03-10"), Category = "Jackets" },
            new Product { ProductId = 27, ProductName = "Silk Dress", Description = "Elegant silk dress in black.", Price = 89.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-03-15"), Category = "Dresses" },
            new Product { ProductId = 28, ProductName = "Leather Wallet", Description = "Compact leather wallet for men.", Price = 49.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-03-20"), Category = "Accessories" },
            new Product { ProductId = 29, ProductName = "Suede Boots", Description = "Knee-high suede boots for women.", Price = 99.99m, StockQuantity = 80, DateAdded = DateTime.Parse("2023-03-25"), Category = "Shoes" },
            new Product { ProductId = 30, ProductName = "Cotton Boxers", Description = "Pack of 3 cotton boxers for men.", Price = 29.99m, StockQuantity = 300, DateAdded = DateTime.Parse("2023-04-01"), Category = "Underwear" },
            new Product { ProductId = 31, ProductName = "Bikini", Description = "Two-piece bikini in floral print.", Price = 39.99m, StockQuantity = 200, DateAdded = DateTime.Parse("2023-04-10"), Category = "Swimwear" },
            new Product { ProductId = 32, ProductName = "Rash Guard", Description = "Long sleeve rash guard for surfing.", Price = 49.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-04-15"), Category = "Swimwear" },
            new Product { ProductId = 33, ProductName = "Cargo Pants", Description = "Khaki cargo pants for men.", Price = 59.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-04-20"), Category = "Pants" },
            new Product { ProductId = 34, ProductName = "Pleated Trousers", Description = "Grey pleated trousers for women.", Price = 59.99m, StockQuantity = 120, DateAdded = DateTime.Parse("2023-04-25"), Category = "Pants" },
            new Product { ProductId = 35, ProductName = "Lace Blouse", Description = "White lace blouse with long sleeves.", Price = 49.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-04-30"), Category = "Tops" },
            new Product { ProductId = 36, ProductName = "Beanie", Description = "Knitted beanie in multiple colors.", Price = 14.99m, StockQuantity = 250, DateAdded = DateTime.Parse("2023-05-05"), Category = "Accessories" },
            new Product { ProductId = 37, ProductName = "Denim Shirt", Description = "Long sleeve denim shirt for men.", Price = 39.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-10"), Category = "Shirts" },
            new Product { ProductId = 38, ProductName = "Cashmere Sweater", Description = "Soft cashmere sweater in beige.", Price = 79.99m, StockQuantity = 120, DateAdded = DateTime.Parse("2023-05-15"), Category = "Sweaters" },
            new Product { ProductId = 39, ProductName = "Maxi Dress", Description = "Floral print maxi dress for women.", Price = 69.99m, StockQuantity = 100, DateAdded = DateTime.Parse("2023-05-20"), Category = "Dresses" },
            new Product { ProductId = 40, ProductName = "Rugby Shirt", Description = "Striped rugby shirt for men.", Price = 44.99m, StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-25"), Category = "Shirts" }
        );

        // Seed Cart
        modelBuilder.Entity<Cart>().HasData(
            new Cart { CartId = 1, UserId = 3 },  // Assigning UserId = 3 to CartId = 1
            new Cart { CartId = 2, UserId = 1 },  // Assigning UserId = 1 to CartId = 2
            new Cart { CartId = 3, UserId = 4 },  // Assigning UserId = 4 to CartId = 3
            new Cart { CartId = 4, UserId = 2 },  // Assigning UserId = 2 to CartId = 4
            new Cart { CartId = 5, UserId = null },  // No UserId assigned to CartId = 5
            new Cart { CartId = 6, UserId = 5 },  // Assigning UserId = 5 to CartId = 6
            new Cart { CartId = 7, UserId = null },  // No UserId assigned to CartId = 7
            new Cart { CartId = 8, UserId = null },  // No UserId assigned to CartId = 8
            new Cart { CartId = 9, UserId = 6 },  // Assigning UserId = 6 to CartId = 9
            new Cart { CartId = 10, UserId = null }  // No UserId assigned to CartId = 10
        );

        // Seed CartItem
        modelBuilder.Entity<Cartitem>().HasData(
            new Cartitem { CartItemId = 1, CartId = 1, ProductId = 5, Quantity = 2 },
            new Cartitem { CartItemId = 2, CartId = 1, ProductId = 11, Quantity = 1 },
            new Cartitem { CartItemId = 3, CartId = 2, ProductId = 8, Quantity = 3 },
            new Cartitem { CartItemId = 4, CartId = 2, ProductId = 15, Quantity = 2 },
            new Cartitem { CartItemId = 5, CartId = 2, ProductId = 19, Quantity = 1 },
            new Cartitem { CartItemId = 6, CartId = 3, ProductId = 2, Quantity = 5 },
            new Cartitem { CartItemId = 7, CartId = 4, ProductId = 1, Quantity = 1 },
            new Cartitem { CartItemId = 8, CartId = 6, ProductId = 7, Quantity = 3 },
            new Cartitem { CartItemId = 9, CartId = 6, ProductId = 24, Quantity = 1 },
            new Cartitem { CartItemId = 10, CartId = 6, ProductId = 26, Quantity = 2 },
            new Cartitem { CartItemId = 11, CartId = 6, ProductId = 30, Quantity = 1 },
            new Cartitem { CartItemId = 12, CartId = 6, ProductId = 31, Quantity = 1 },
            new Cartitem { CartItemId = 13, CartId = 9, ProductId = 21, Quantity = 4 },
            new Cartitem { CartItemId = 14, CartId = 9, ProductId = 28, Quantity = 2 }
        );

        // Seed Order
        modelBuilder.Entity<Order>().HasData(
            new Order { OrderId = 1, UserId = 3, OrderDate = DateTime.Parse("2023-08-01 12:30:00") },
            new Order { OrderId = 2, UserId = 1, OrderDate = DateTime.Parse("2023-08-02 14:45:00") },
            new Order { OrderId = 3, UserId = 4, OrderDate = DateTime.Parse("2023-08-03 11:15:00") },
            new Order { OrderId = 4, UserId = 2, OrderDate = DateTime.Parse("2023-08-04 09:00:00") },
            new Order { OrderId = 5, UserId = 3, OrderDate = DateTime.Parse("2023-08-04 15:30:00") },
            new Order { OrderId = 6, UserId = 5, OrderDate = DateTime.Parse("2023-08-05 16:20:00") },
            new Order { OrderId = 7, UserId = 6, OrderDate = DateTime.Parse("2023-08-06 10:45:00") },
            new Order { OrderId = 8, UserId = 2, OrderDate = DateTime.Parse("2023-08-07 13:10:00") },
            new Order { OrderId = 9, UserId = 1, OrderDate = DateTime.Parse("2023-08-08 17:00:00") },
            new Order { OrderId = 10, UserId = 5, OrderDate = DateTime.Parse("2023-08-09 09:30:00") }
        );

        // Seed OrderItem
        modelBuilder.Entity<Orderitem>().HasData(
            new Orderitem { OrderItemId = 1, OrderId = 1, ProductId = 5, Quantity = 2 },
            new Orderitem { OrderItemId = 2, OrderId = 1, ProductId = 11, Quantity = 1 },
            new Orderitem { OrderItemId = 3, OrderId = 2, ProductId = 8, Quantity = 3 },
            new Orderitem { OrderItemId = 4, OrderId = 2, ProductId = 15, Quantity = 2 },
            new Orderitem { OrderItemId = 5, OrderId = 2, ProductId = 19, Quantity = 1 },
            new Orderitem { OrderItemId = 6, OrderId = 3, ProductId = 2, Quantity = 5 },
            new Orderitem { OrderItemId = 7, OrderId = 4, ProductId = 1, Quantity = 1 },
            new Orderitem { OrderItemId = 8, OrderId = 6, ProductId = 7, Quantity = 3 },
            new Orderitem { OrderItemId = 9, OrderId = 6, ProductId = 24, Quantity = 1 },
            new Orderitem { OrderItemId = 10, OrderId = 6, ProductId = 26, Quantity = 2 },
            new Orderitem { OrderItemId = 11, OrderId = 6, ProductId = 30, Quantity = 1 },
            new Orderitem { OrderItemId = 12, OrderId = 6, ProductId = 31, Quantity = 1 },
            new Orderitem { OrderItemId = 13, OrderId = 7, ProductId = 17, Quantity = 3 },
            new Orderitem { OrderItemId = 14, OrderId = 7, ProductId = 18, Quantity = 2 },
            new Orderitem { OrderItemId = 15, OrderId = 9, ProductId = 21, Quantity = 4 },
            new Orderitem { OrderItemId = 16, OrderId = 9, ProductId = 28, Quantity = 2 },
            new Orderitem { OrderItemId = 17, OrderId = 10, ProductId = 12, Quantity = 3 },
            new Orderitem { OrderItemId = 18, OrderId = 10, ProductId = 20, Quantity = 1 }
        );

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}