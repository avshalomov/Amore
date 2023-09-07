using amore_dal.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace amore_dal.Context;

public partial class AmoreDbContext : DbContext
{
  private readonly List<string> base64Images;
  private readonly List<byte[]> BytedHashedPasswords;
  public AmoreDbContext(DbContextOptions<AmoreDbContext> options) : base(options)
  {
    base64Images = ConvertImagesToBase64("../amore_dal/images");
    BytedHashedPasswords = HashAndBytePasswords();
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
      entity.HasKey(e => e.UserId);

      entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(20);

      entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(50)
                .HasAnnotation("RegularExpression", @"^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$");

      entity.Property(e => e.UserRole)
                .IsRequired()
                .HasConversion<string>();

      entity.Property(e => e.LastLoginDate)
                .IsRequired()
                .HasColumnType("datetime");

      entity.Property(e => e.DateCreated)
                .IsRequired()
                .HasColumnType("datetime");

      entity.Property(e => e.PasswordHash)
                .IsRequired();

      entity.Property(e => e.Picture)
                .IsRequired();

      entity.HasOne(d => d.Cart)
                .WithOne(p => p.User)
                .HasForeignKey<Cart>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

      entity.HasMany(d => d.Orders)
                .WithOne(p => p.User)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
    });


    modelBuilder.Entity<Product>(entity =>
    {
      entity.HasKey(e => e.ProductId);

      entity.Property(e => e.ProductName)
                .IsRequired()
                .HasMaxLength(30);

      entity.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(50);

      entity.Property(e => e.Price)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

      entity.Property(e => e.Category)
                .IsRequired()
                .HasMaxLength(20);

      entity.Property(e => e.Gender)
                .IsRequired()
                .HasConversion<string>();

      entity.Property(e => e.StockQuantity)
                .IsRequired();

      entity.Property(e => e.DateAdded)
                .IsRequired()
                .HasColumnType("datetime");

      entity.Property(e => e.Picture)
                .IsRequired();

      entity.HasMany(d => d.CartItems)
                .WithOne(p => p.Product)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

      entity.HasMany(d => d.OrderItems)
                .WithOne(p => p.Product)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
    });


    modelBuilder.Entity<Cart>(entity =>
    {
      entity.HasKey(e => e.CartId);

      entity.Property(e => e.UserId)
                .IsRequired();

      entity.Property(e => e.TotalPrice)
                .IsRequired();

      entity.HasOne(d => d.User)
                .WithOne(p => p.Cart)
                .HasForeignKey<Cart>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

      entity.HasMany(d => d.CartItems)
                .WithOne(p => p.Cart)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.Cascade);
    });


    modelBuilder.Entity<CartItem>(entity =>
    {
      entity.HasKey(e => e.CartItemId);

      entity.Property(e => e.CartId)
                .IsRequired();

      entity.Property(e => e.ProductId)
                .IsRequired();

      entity.Property(e => e.Quantity)
                .IsRequired();

      entity.HasOne(d => d.Cart)
                .WithMany(p => p.CartItems)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.Cascade);

      entity.HasOne(d => d.Product)
                .WithMany(p => p.CartItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
    });


    modelBuilder.Entity<Order>(entity =>
    {
      entity.HasKey(e => e.OrderId);

      entity.Property(e => e.UserId)
                .IsRequired();

      entity.Property(e => e.OrderDate)
                .IsRequired()
                .HasColumnType("datetime");

      entity.Property(e => e.Status)
                .HasConversion<string>();

      entity.HasOne(d => d.User)
                .WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

      entity.HasMany(d => d.OrderItems)
                .WithOne(p => p.Order)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
    });


    modelBuilder.Entity<OrderItem>(entity =>
    {
      entity.HasKey(e => e.OrderItemId);

      entity.Property(e => e.OrderId)
                .IsRequired();

      entity.Property(e => e.ProductId)
                .IsRequired();

      entity.Property(e => e.Quantity)
                .IsRequired();

      entity.HasOne(d => d.Order)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

      entity.HasOne(d => d.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
    });



    // Data Seeders

    // Seed User
    modelBuilder.Entity<User>().HasData(
        new User { UserId = 1, Username = "admin", Email = "admin@mail.com", UserRole = UserRole.Admin, LastLoginDate = DateTime.Parse("2023-08-01 08:00:00"), DateCreated = DateTime.Parse("2023-02-01 08:00:00"), PasswordHash = BytedHashedPasswords[0], Picture = base64Images[0] },
        new User { UserId = 2, Username = "johnDoe", Email = "john.doe@yahoo.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-01 08:00:00"), DateCreated = DateTime.Parse("2023-02-01 08:00:00"), PasswordHash = BytedHashedPasswords[1], Picture = base64Images[1] },
        new User { UserId = 3, Username = "janeSmith", Email = "jane.smith@gmail.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-02 10:00:00"), DateCreated = DateTime.Parse("2023-03-15 10:00:00"), PasswordHash = BytedHashedPasswords[2], Picture = base64Images[2] },
        new User { UserId = 4, Username = "bobJohnson", Email = "bob.johnson@protonmail.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-03 12:00:00"), DateCreated = DateTime.Parse("2023-01-10 12:00:00"), PasswordHash = BytedHashedPasswords[3], Picture = base64Images[3] },
        new User { UserId = 5, Username = "susanClark", Email = "susan.clark@outlook.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-04 14:00:00"), DateCreated = DateTime.Parse("2023-05-20 14:00:00"), PasswordHash = BytedHashedPasswords[4], Picture = base64Images[4] },
        new User { UserId = 6, Username = "mikeBrown", Email = "mike.brown@walla.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-05 16:00:00"), DateCreated = DateTime.Parse("2023-04-25 16:00:00"), PasswordHash = BytedHashedPasswords[5], Picture = base64Images[5] },
        new User { UserId = 7, Username = "lindaDavis", Email = "linda.davis@yahoo.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-06 18:00:00"), DateCreated = DateTime.Parse("2023-07-05 18:00:00"), PasswordHash = BytedHashedPasswords[6], Picture = base64Images[6] },
        new User { UserId = 8, Username = "richardMiller", Email = "richard.miller@gmail.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-07 20:00:00"), DateCreated = DateTime.Parse("2023-06-15 20:00:00"), PasswordHash = BytedHashedPasswords[7], Picture = base64Images[7] },
        new User { UserId = 9, Username = "maryWilson", Email = "mary.wilson@protonmail.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-08 08:00:00"), DateCreated = DateTime.Parse("2023-01-30 08:00:00"), PasswordHash = BytedHashedPasswords[8], Picture = base64Images[8] },
        new User { UserId = 10, Username = "jamesMoore", Email = "james.moore@outlook.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-09 10:00:00"), DateCreated = DateTime.Parse("2023-08-10 10:00:00"), PasswordHash = BytedHashedPasswords[9], Picture = base64Images[9] },
        new User { UserId = 11, Username = "patriciaTaylor", Email = "patricia.taylor@walla.com", UserRole = UserRole.User, LastLoginDate = DateTime.Parse("2023-08-10 12:00:00"), DateCreated = DateTime.Parse("2023-02-25 12:00:00"), PasswordHash = BytedHashedPasswords[10], Picture = base64Images[10] }
    );

    // Seed Product
    modelBuilder.Entity<Product>().HasData(
        new Product { ProductId = 1, ProductName = "Slim Fit Jeans", Description = "Classic blue slim fit jeans.", Price = 49.99m, Category = "Jeans", Gender = Gender.Female, StockQuantity = 200, DateAdded = DateTime.Parse("2023-01-03"), Picture = base64Images[11] },
        new Product { ProductId = 2, ProductName = "Striped T-Shirt", Description = "Cotton t-shirt with blue and white stripes.", Price = 19.99m, Category = "T-Shirts", Gender = Gender.Female, StockQuantity = 150, DateAdded = DateTime.Parse("2023-01-06"), Picture = base64Images[12] },
        new Product { ProductId = 3, ProductName = "Leather Jacket", Description = "Black leather jacket with zipper.", Price = 99.99m, Category = "Jackets", Gender = Gender.Male, StockQuantity = 80, DateAdded = DateTime.Parse("2023-01-09"), Picture = base64Images[13] },
        new Product { ProductId = 4, ProductName = "Ankle Boots", Description = "Black leather ankle boots for women.", Price = 79.99m, Category = "Shoes", Gender = Gender.Female, StockQuantity = 120, DateAdded = DateTime.Parse("2023-01-13"), Picture = base64Images[14] },
        new Product { ProductId = 5, ProductName = "Cotton Socks", Description = "Pack of 5 pairs of cotton socks.", Price = 9.99m, Category = "Socks", Gender = Gender.Unisex, StockQuantity = 300, DateAdded = DateTime.Parse("2023-01-15"), Picture = base64Images[15] },
        new Product { ProductId = 6, ProductName = "Wool Sweater", Description = "Warm wool sweater in light grey color.", Price = 59.99m, Category = "Sweaters", Gender = Gender.Female, StockQuantity = 100, DateAdded = DateTime.Parse("2023-01-20"), Picture = base64Images[16] },
        new Product { ProductId = 7, ProductName = "Silk Scarf", Description = "Elegant silk scarf with floral pattern.", Price = 29.99m, Category = "Accessories", Gender = Gender.Female, StockQuantity = 200, DateAdded = DateTime.Parse("2023-01-25"), Picture = base64Images[17] },
        new Product { ProductId = 8, ProductName = "Pleated Skirt", Description = "Black pleated skirt in midi length.", Price = 39.99m, Category = "Skirts", Gender = Gender.Female, StockQuantity = 120, DateAdded = DateTime.Parse("2023-01-30"), Picture = base64Images[18] },
        new Product { ProductId = 9, ProductName = "Tote Bag", Description = "Large tote bag in brown leather.", Price = 69.99m, Category = "Bags", Gender = Gender.Female, StockQuantity = 90, DateAdded = DateTime.Parse("2023-02-01"), Picture = base64Images[19] },
        new Product { ProductId = 10, ProductName = "Bomber Jacket", Description = "Green bomber jacket with side pockets.", Price = 89.99m, Category = "Jackets", Gender = Gender.Unisex, StockQuantity = 100, DateAdded = DateTime.Parse("2023-02-03"), Picture = base64Images[20] },
        new Product { ProductId = 11, ProductName = "Sports Bra", Description = "High support sports bra in black.", Price = 24.99m, Category = "Sportswear", Gender = Gender.Female, StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-15"), Picture = base64Images[21] },
        new Product { ProductId = 12, ProductName = "Running Shoes", Description = "Men's running shoes in white.", Price = 59.99m, Category = "Shoes", Gender = Gender.Unisex, StockQuantity = 100, DateAdded = DateTime.Parse("2023-05-20"), Picture = base64Images[22] },
        new Product { ProductId = 13, ProductName = "Denim Shorts", Description = "High waisted denim shorts for women.", Price = 29.99m, Category = "Shorts", Gender = Gender.Female, StockQuantity = 200, DateAdded = DateTime.Parse("2023-05-22"), Picture = base64Images[23] },
        new Product { ProductId = 14, ProductName = "Men's Polo", Description = "Polo shirt in navy blue for men.", Price = 34.99m, Category = "Polos", Gender = Gender.Male, StockQuantity = 180, DateAdded = DateTime.Parse("2023-05-25"), Picture = base64Images[24] },
        new Product { ProductId = 15, ProductName = "Kids Sneakers", Description = "Colorful sneakers for kids.", Price = 29.99m, Category = "Shoes", Gender = Gender.Female, StockQuantity = 250, DateAdded = DateTime.Parse("2023-05-28"), Picture = base64Images[25] },
        new Product { ProductId = 16, ProductName = "Baby Romper", Description = "Cotton romper with cute prints for babies.", Price = 14.99m, Category = "Baby", Gender = Gender.Unisex, StockQuantity = 300, DateAdded = DateTime.Parse("2023-05-30"), Picture = base64Images[26] },
        new Product { ProductId = 17, ProductName = "Cycling Gloves", Description = "Comfortable cycling gloves in black.", Price = 19.99m, Category = "Sportswear", Gender = Gender.Unisex, StockQuantity = 100, DateAdded = DateTime.Parse("2023-06-01"), Picture = base64Images[27] },
        new Product { ProductId = 18, ProductName = "Rain Jacket", Description = "Waterproof rain jacket in yellow.", Price = 49.99m, Category = "Jackets", Gender = Gender.Female, StockQuantity = 150, DateAdded = DateTime.Parse("2023-06-04"), Picture = base64Images[28] },
        new Product { ProductId = 19, ProductName = "Sunglasses", Description = "UV protection sunglasses with round frames.", Price = 29.99m, Category = "Accessories", Gender = Gender.Female, StockQuantity = 200, DateAdded = DateTime.Parse("2023-06-06"), Picture = base64Images[29] },
        new Product { ProductId = 20, ProductName = "Beach Hat", Description = "Wide brim beach hat in straw.", Price = 19.99m, Category = "Accessories", Gender = Gender.Female, StockQuantity = 220, DateAdded = DateTime.Parse("2023-06-10"), Picture = base64Images[30] },
        new Product { ProductId = 21, ProductName = "Canvas Sneakers", Description = "Classic white canvas sneakers.", Price = 39.99m, Category = "Shoes", Gender = Gender.Unisex, StockQuantity = 250, DateAdded = DateTime.Parse("2023-02-15"), Picture = base64Images[31] },
        new Product { ProductId = 22, ProductName = "Leather Belt", Description = "Brown leather belt with brass buckle.", Price = 24.99m, Category = "Accessories", Gender = Gender.Unisex, StockQuantity = 300, DateAdded = DateTime.Parse("2023-02-20"), Picture = base64Images[32] },
        new Product { ProductId = 23, ProductName = "Wool Hat", Description = "Warm wool hat for winter.", Price = 19.99m, Category = "Accessories", Gender = Gender.Female, StockQuantity = 150, DateAdded = DateTime.Parse("2023-02-25"), Picture = base64Images[33] },
        new Product { ProductId = 24, ProductName = "Gym Shorts", Description = "Comfortable gym shorts for men.", Price = 29.99m, Category = "Sportswear", Gender = Gender.Male, StockQuantity = 200, DateAdded = DateTime.Parse("2023-03-01"), Picture = base64Images[34] },
        new Product { ProductId = 25, ProductName = "Yoga Mat", Description = "Non-slip yoga mat.", Price = 34.99m, Category = "Sportswear", Gender = Gender.Unisex, StockQuantity = 100, DateAdded = DateTime.Parse("2023-03-05"), Picture = base64Images[35] },
        new Product { ProductId = 26, ProductName = "Denim Jacket", Description = "Blue denim jacket with buttons.", Price = 59.99m, Category = "Jackets", Gender = Gender.Female, StockQuantity = 150, DateAdded = DateTime.Parse("2023-03-10"), Picture = base64Images[36] },
        new Product { ProductId = 27, ProductName = "Silk Dress", Description = "Elegant silk dress in black.", Price = 89.99m, Category = "Dresses", Gender = Gender.Female, StockQuantity = 100, DateAdded = DateTime.Parse("2023-03-15"), Picture = base64Images[37] },
        new Product { ProductId = 28, ProductName = "Leather Wallet", Description = "Compact leather wallet for men.", Price = 49.99m, Category = "Accessories", Gender = Gender.Unisex, StockQuantity = 200, DateAdded = DateTime.Parse("2023-03-20"), Picture = base64Images[38] },
        new Product { ProductId = 29, ProductName = "Suede Boots", Description = "Knee-high suede boots for women.", Price = 99.99m, Category = "Shoes", Gender = Gender.Female, StockQuantity = 80, DateAdded = DateTime.Parse("2023-03-25"), Picture = base64Images[39] },
        new Product { ProductId = 30, ProductName = "Cotton Boxers", Description = "Pack of 3 cotton boxers for men.", Price = 29.99m, Category = "Underwear", Gender = Gender.Male, StockQuantity = 300, DateAdded = DateTime.Parse("2023-04-01"), Picture = base64Images[40] },
        new Product { ProductId = 31, ProductName = "Bikini", Description = "Two-piece bikini in floral print.", Price = 39.99m, Category = "Swimwear", Gender = Gender.Female, StockQuantity = 200, DateAdded = DateTime.Parse("2023-04-10"), Picture = base64Images[41] },
        new Product { ProductId = 32, ProductName = "Rash Guard", Description = "Long sleeve rash guard for surfing.", Price = 49.99m, Category = "Swimwear", Gender = Gender.Female, StockQuantity = 150, DateAdded = DateTime.Parse("2023-04-15"), Picture = base64Images[42] },
        new Product { ProductId = 33, ProductName = "Cargo Pants", Description = "Khaki cargo pants for men.", Price = 59.99m, Category = "Pants", Gender = Gender.Male, StockQuantity = 100, DateAdded = DateTime.Parse("2023-04-20"), Picture = base64Images[43] },
        new Product { ProductId = 34, ProductName = "Pleated Trousers", Description = "Grey pleated trousers for women.", Price = 59.99m, Category = "Pants", Gender = Gender.Female, StockQuantity = 120, DateAdded = DateTime.Parse("2023-04-25"), Picture = base64Images[44] },
        new Product { ProductId = 35, ProductName = "Lace Blouse", Description = "White lace blouse with long sleeves.", Price = 49.99m, Category = "Tops", Gender = Gender.Female, StockQuantity = 150, DateAdded = DateTime.Parse("2023-04-30"), Picture = base64Images[45] },
        new Product { ProductId = 36, ProductName = "Beanie", Description = "Knitted beanie in multiple colors.", Price = 14.99m, Category = "Accessories", Gender = Gender.Female, StockQuantity = 250, DateAdded = DateTime.Parse("2023-05-05"), Picture = base64Images[46] },
        new Product { ProductId = 37, ProductName = "Denim Shirt", Description = "Long sleeve denim shirt for men.", Price = 39.99m, Category = "Shirts", Gender = Gender.Male, StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-10"), Picture = base64Images[47] },
        new Product { ProductId = 38, ProductName = "Cashmere Sweater", Description = "Soft cashmere sweater in beige.", Price = 79.99m, Category = "Sweaters", Gender = Gender.Female, StockQuantity = 120, DateAdded = DateTime.Parse("2023-05-15"), Picture = base64Images[48] },
        new Product { ProductId = 39, ProductName = "Maxi Dress", Description = "Floral print maxi dress for women.", Price = 69.99m, Category = "Dresses", Gender = Gender.Female, StockQuantity = 100, DateAdded = DateTime.Parse("2023-05-20"), Picture = base64Images[49] },
        new Product { ProductId = 40, ProductName = "Flannel Shirt", Description = "Comfortable flannel shirt for men.", Price = 44.99m, Category = "Shirts", Gender = Gender.Male, StockQuantity = 150, DateAdded = DateTime.Parse("2023-05-25"), Picture = base64Images[50] }
    );

    // Seed Cart
    modelBuilder.Entity<Cart>().HasData(
        new Cart { CartId = 1, UserId = 1, TotalPrice = 69.98m },
        new Cart { CartId = 2, UserId = 2, TotalPrice = 279.97m },
        new Cart { CartId = 3, UserId = 3, TotalPrice = 189.96m },
        new Cart { CartId = 4, UserId = 4, TotalPrice = 99.97m },
        new Cart { CartId = 5, UserId = 5, TotalPrice = 159.98m },
        new Cart { CartId = 6, UserId = 6, TotalPrice = 119.97m },
        new Cart { CartId = 7, UserId = 7, TotalPrice = 179.98m },
        new Cart { CartId = 8, UserId = 8, TotalPrice = 79.97m },
        new Cart { CartId = 9, UserId = 9, TotalPrice = 149.96m },
        new Cart { CartId = 10, UserId = 10, TotalPrice = 249.97m },
        new Cart { CartId = 11, UserId = 11, TotalPrice = 00.00m }
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
        new Order { OrderId = 1, UserId = 1, OrderDate = new DateTime(2023, 8, 5), Status = OrderStatus.Processing },
        new Order { OrderId = 2, UserId = 2, OrderDate = new DateTime(2023, 8, 7), Status = OrderStatus.Shipped },
        new Order { OrderId = 3, UserId = 3, OrderDate = new DateTime(2023, 8, 10), Status = OrderStatus.Delivered },
        new Order { OrderId = 4, UserId = 4, OrderDate = new DateTime(2023, 8, 12), Status = OrderStatus.Processing },
        new Order { OrderId = 5, UserId = 5, OrderDate = new DateTime(2023, 8, 15), Status = OrderStatus.Canceled },
        new Order { OrderId = 6, UserId = 6, OrderDate = new DateTime(2023, 8, 17), Status = OrderStatus.Processing },
        new Order { OrderId = 7, UserId = 7, OrderDate = new DateTime(2023, 8, 20), Status = OrderStatus.Shipped },
        new Order { OrderId = 8, UserId = 8, OrderDate = new DateTime(2023, 8, 23), Status = OrderStatus.Delivered },
        new Order { OrderId = 9, UserId = 9, OrderDate = new DateTime(2023, 8, 25), Status = OrderStatus.Canceled },
        new Order { OrderId = 10, UserId = 10, OrderDate = new DateTime(2023, 8, 27), Status = OrderStatus.Processing }
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

  private List<byte[]> HashAndBytePasswords()
  {
    List<string> defaultPasswords = new List<string>
      { "admin0", "user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8", "user9", "user10" };

    List<byte[]> hashedAndByted = new List<byte[]>();

    foreach (string password in defaultPasswords)
    {
      using (var hmac = new HMACSHA512())
      {
        byte[] hashedPasswordBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        hashedAndByted.Add(hashedPasswordBytes);
      }
    }

    return hashedAndByted;
  }


  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}