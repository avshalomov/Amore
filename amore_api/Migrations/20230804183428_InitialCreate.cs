using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace amore_api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "product",
                columns: table => new
                {
                    ProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProductName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Price = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: true),
                    StockQuantity = table.Column<int>(type: "int", nullable: true),
                    DateAdded = table.Column<DateTime>(type: "datetime", nullable: true),
                    Category = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.ProductID);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordSalt = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserRole = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateCreated = table.Column<DateTime>(type: "datetime", nullable: true),
                    LastLoginDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.UserID);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "cart",
                columns: table => new
                {
                    CartID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.CartID);
                    table.ForeignKey(
                        name: "cart_ibfk_1",
                        column: x => x.UserID,
                        principalTable: "user",
                        principalColumn: "UserID");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "order",
                columns: table => new
                {
                    OrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    OrderDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.OrderID);
                    table.ForeignKey(
                        name: "order_ibfk_1",
                        column: x => x.UserID,
                        principalTable: "user",
                        principalColumn: "UserID");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "cartitems",
                columns: table => new
                {
                    CartItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CartID = table.Column<int>(type: "int", nullable: true),
                    ProductID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.CartItemID);
                    table.ForeignKey(
                        name: "cartitems_ibfk_1",
                        column: x => x.CartID,
                        principalTable: "cart",
                        principalColumn: "CartID");
                    table.ForeignKey(
                        name: "cartitems_ibfk_2",
                        column: x => x.ProductID,
                        principalTable: "product",
                        principalColumn: "ProductID");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "orderitems",
                columns: table => new
                {
                    OrderItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    OrderID = table.Column<int>(type: "int", nullable: true),
                    ProductID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.OrderItemID);
                    table.ForeignKey(
                        name: "orderitems_ibfk_1",
                        column: x => x.OrderID,
                        principalTable: "order",
                        principalColumn: "OrderID");
                    table.ForeignKey(
                        name: "orderitems_ibfk_2",
                        column: x => x.ProductID,
                        principalTable: "product",
                        principalColumn: "ProductID");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.InsertData(
                table: "cart",
                columns: new[] { "CartID", "UserID" },
                values: new object[,]
                {
                    { 5, null },
                    { 7, null },
                    { 8, null },
                    { 10, null }
                });

            migrationBuilder.InsertData(
                table: "product",
                columns: new[] { "ProductID", "Category", "DateAdded", "Description", "Price", "ProductName", "StockQuantity" },
                values: new object[,]
                {
                    { 1, "Jeans", new DateTime(2023, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Classic blue slim fit jeans.", 49.99m, "Slim Fit Jeans", 200 },
                    { 2, "T-Shirts", new DateTime(2023, 1, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cotton t-shirt with blue and white stripes.", 19.99m, "Striped T-Shirt", 150 },
                    { 3, "Jackets", new DateTime(2023, 1, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), "Black leather jacket with zipper.", 99.99m, "Leather Jacket", 80 },
                    { 4, "Shoes", new DateTime(2023, 1, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "Black leather ankle boots for women.", 79.99m, "Ankle Boots", 120 },
                    { 5, "Socks", new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pack of 5 pairs of cotton socks.", 9.99m, "Cotton Socks", 300 },
                    { 6, "Sweaters", new DateTime(2023, 1, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Warm wool sweater in light grey color.", 59.99m, "Wool Sweater", 100 },
                    { 7, "Accessories", new DateTime(2023, 1, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Elegant silk scarf with floral pattern.", 29.99m, "Silk Scarf", 200 },
                    { 8, "Skirts", new DateTime(2023, 1, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Black pleated skirt in midi length.", 39.99m, "Pleated Skirt", 120 },
                    { 9, "Bags", new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Large tote bag in brown leather.", 69.99m, "Tote Bag", 90 },
                    { 10, "Jackets", new DateTime(2023, 2, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), "Green bomber jacket with side pockets.", 89.99m, "Bomber Jacket", 100 },
                    { 11, "Sportswear", new DateTime(2023, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "High support sports bra in black.", 24.99m, "Sports Bra", 150 },
                    { 12, "Shoes", new DateTime(2023, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Men's running shoes in white.", 59.99m, "Running Shoes", 100 },
                    { 13, "Shorts", new DateTime(2023, 5, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), "High waisted denim shorts for women.", 29.99m, "Denim Shorts", 200 },
                    { 14, "Polos", new DateTime(2023, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Polo shirt in navy blue for men.", 34.99m, "Men's Polo", 180 },
                    { 15, "Shoes", new DateTime(2023, 5, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), "Colorful sneakers for kids.", 29.99m, "Kids Sneakers", 250 },
                    { 16, "Baby", new DateTime(2023, 5, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cotton romper with cute prints for babies.", 14.99m, "Baby Romper", 300 },
                    { 17, "Sportswear", new DateTime(2023, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Comfortable cycling gloves in black.", 19.99m, "Cycling Gloves", 100 },
                    { 18, "Jackets", new DateTime(2023, 6, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), "Waterproof rain jacket in yellow.", 49.99m, "Rain Jacket", 150 },
                    { 19, "Accessories", new DateTime(2023, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "UV protection sunglasses with round frames.", 29.99m, "Sunglasses", 200 },
                    { 20, "Accessories", new DateTime(2023, 6, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Wide brim beach hat in straw.", 19.99m, "Beach Hat", 220 },
                    { 21, "Shoes", new DateTime(2023, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Classic white canvas sneakers.", 39.99m, "Canvas Sneakers", 250 },
                    { 22, "Accessories", new DateTime(2023, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Brown leather belt with brass buckle.", 24.99m, "Leather Belt", 300 },
                    { 23, "Accessories", new DateTime(2023, 2, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Warm wool hat for winter.", 19.99m, "Wool Hat", 150 },
                    { 24, "Sportswear", new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Comfortable gym shorts for men.", 29.99m, "Gym Shorts", 200 },
                    { 25, "Sportswear", new DateTime(2023, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Non-slip yoga mat.", 34.99m, "Yoga Mat", 100 },
                    { 26, "Jackets", new DateTime(2023, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Blue denim jacket with buttons.", 59.99m, "Denim Jacket", 150 },
                    { 27, "Dresses", new DateTime(2023, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Elegant silk dress in black.", 89.99m, "Silk Dress", 100 },
                    { 28, "Accessories", new DateTime(2023, 3, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Compact leather wallet for men.", 49.99m, "Leather Wallet", 200 },
                    { 29, "Shoes", new DateTime(2023, 3, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Knee-high suede boots for women.", 99.99m, "Suede Boots", 80 },
                    { 30, "Underwear", new DateTime(2023, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Pack of 3 cotton boxers for men.", 29.99m, "Cotton Boxers", 300 },
                    { 31, "Swimwear", new DateTime(2023, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Two-piece bikini in floral print.", 39.99m, "Bikini", 200 },
                    { 32, "Swimwear", new DateTime(2023, 4, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Long sleeve rash guard for surfing.", 49.99m, "Rash Guard", 150 },
                    { 33, "Pants", new DateTime(2023, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Khaki cargo pants for men.", 59.99m, "Cargo Pants", 100 },
                    { 34, "Pants", new DateTime(2023, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Grey pleated trousers for women.", 59.99m, "Pleated Trousers", 120 },
                    { 35, "Tops", new DateTime(2023, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), "White lace blouse with long sleeves.", 49.99m, "Lace Blouse", 150 },
                    { 36, "Accessories", new DateTime(2023, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Knitted beanie in multiple colors.", 14.99m, "Beanie", 250 },
                    { 37, "Shirts", new DateTime(2023, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Long sleeve denim shirt for men.", 39.99m, "Denim Shirt", 150 },
                    { 38, "Sweaters", new DateTime(2023, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Soft cashmere sweater in beige.", 79.99m, "Cashmere Sweater", 120 },
                    { 39, "Dresses", new DateTime(2023, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Floral print maxi dress for women.", 69.99m, "Maxi Dress", 100 },
                    { 40, "Shirts", new DateTime(2023, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Striped rugby shirt for men.", 44.99m, "Rugby Shirt", 150 }
                });

            migrationBuilder.InsertData(
                table: "user",
                columns: new[] { "UserID", "DateCreated", "Email", "LastLoginDate", "PasswordHash", "PasswordSalt", "UserRole", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 2, 1, 8, 0, 0, 0, DateTimeKind.Unspecified), "admin@mail.com", new DateTime(2023, 8, 1, 8, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "Admin", "admin" },
                    { 2, new DateTime(2023, 2, 1, 8, 0, 0, 0, DateTimeKind.Unspecified), "john.doe@yahoo.com", new DateTime(2023, 8, 1, 8, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "johnDoe" },
                    { 3, new DateTime(2023, 3, 15, 10, 0, 0, 0, DateTimeKind.Unspecified), "jane.smith@gmail.com", new DateTime(2023, 8, 2, 10, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "janeSmith" },
                    { 4, new DateTime(2023, 1, 10, 12, 0, 0, 0, DateTimeKind.Unspecified), "bob.johnson@protonmail.com", new DateTime(2023, 8, 3, 12, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "bobJohnson" },
                    { 5, new DateTime(2023, 5, 20, 14, 0, 0, 0, DateTimeKind.Unspecified), "susan.clark@outlook.com", new DateTime(2023, 8, 4, 14, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "susanClark" },
                    { 6, new DateTime(2023, 4, 25, 16, 0, 0, 0, DateTimeKind.Unspecified), "mike.brown@walla.com", new DateTime(2023, 8, 5, 16, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "mikeBrown" },
                    { 7, new DateTime(2023, 7, 5, 18, 0, 0, 0, DateTimeKind.Unspecified), "linda.davis@yahoo.com", new DateTime(2023, 8, 6, 18, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "lindaDavis" },
                    { 8, new DateTime(2023, 6, 15, 20, 0, 0, 0, DateTimeKind.Unspecified), "richard.miller@gmail.com", new DateTime(2023, 8, 7, 20, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "richardMiller" },
                    { 9, new DateTime(2023, 1, 30, 8, 0, 0, 0, DateTimeKind.Unspecified), "mary.wilson@protonmail.com", new DateTime(2023, 8, 8, 8, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "maryWilson" },
                    { 10, new DateTime(2023, 8, 10, 10, 0, 0, 0, DateTimeKind.Unspecified), "james.moore@outlook.com", new DateTime(2023, 8, 9, 10, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "jamesMoore" },
                    { 11, new DateTime(2023, 2, 25, 12, 0, 0, 0, DateTimeKind.Unspecified), "patricia.taylor@walla.com", new DateTime(2023, 8, 10, 12, 0, 0, 0, DateTimeKind.Unspecified), "hashedpassword", "salt", "User", "patriciaTaylor" }
                });

            migrationBuilder.InsertData(
                table: "cart",
                columns: new[] { "CartID", "UserID" },
                values: new object[,]
                {
                    { 1, 3 },
                    { 2, 1 },
                    { 3, 4 },
                    { 4, 2 },
                    { 6, 5 },
                    { 9, 6 }
                });

            migrationBuilder.InsertData(
                table: "order",
                columns: new[] { "OrderID", "OrderDate", "UserID" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 8, 1, 12, 30, 0, 0, DateTimeKind.Unspecified), 3 },
                    { 2, new DateTime(2023, 8, 2, 14, 45, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 3, new DateTime(2023, 8, 3, 11, 15, 0, 0, DateTimeKind.Unspecified), 4 },
                    { 4, new DateTime(2023, 8, 4, 9, 0, 0, 0, DateTimeKind.Unspecified), 2 },
                    { 5, new DateTime(2023, 8, 4, 15, 30, 0, 0, DateTimeKind.Unspecified), 3 },
                    { 6, new DateTime(2023, 8, 5, 16, 20, 0, 0, DateTimeKind.Unspecified), 5 },
                    { 7, new DateTime(2023, 8, 6, 10, 45, 0, 0, DateTimeKind.Unspecified), 6 },
                    { 8, new DateTime(2023, 8, 7, 13, 10, 0, 0, DateTimeKind.Unspecified), 2 },
                    { 9, new DateTime(2023, 8, 8, 17, 0, 0, 0, DateTimeKind.Unspecified), 1 },
                    { 10, new DateTime(2023, 8, 9, 9, 30, 0, 0, DateTimeKind.Unspecified), 5 }
                });

            migrationBuilder.InsertData(
                table: "cartitems",
                columns: new[] { "CartItemID", "CartID", "ProductID", "Quantity" },
                values: new object[,]
                {
                    { 1, 1, 5, 2 },
                    { 2, 1, 11, 1 },
                    { 3, 2, 8, 3 },
                    { 4, 2, 15, 2 },
                    { 5, 2, 19, 1 },
                    { 6, 3, 2, 5 },
                    { 7, 4, 1, 1 },
                    { 8, 6, 7, 3 },
                    { 9, 6, 24, 1 },
                    { 10, 6, 26, 2 },
                    { 11, 6, 30, 1 },
                    { 12, 6, 31, 1 },
                    { 13, 9, 21, 4 },
                    { 14, 9, 28, 2 }
                });

            migrationBuilder.InsertData(
                table: "orderitems",
                columns: new[] { "OrderItemID", "OrderID", "ProductID", "Quantity" },
                values: new object[,]
                {
                    { 1, 1, 5, 2 },
                    { 2, 1, 11, 1 },
                    { 3, 2, 8, 3 },
                    { 4, 2, 15, 2 },
                    { 5, 2, 19, 1 },
                    { 6, 3, 2, 5 },
                    { 7, 4, 1, 1 },
                    { 8, 6, 7, 3 },
                    { 9, 6, 24, 1 },
                    { 10, 6, 26, 2 },
                    { 11, 6, 30, 1 },
                    { 12, 6, 31, 1 },
                    { 13, 7, 17, 3 },
                    { 14, 7, 18, 2 },
                    { 15, 9, 21, 4 },
                    { 16, 9, 28, 2 },
                    { 17, 10, 12, 3 },
                    { 18, 10, 20, 1 }
                });

            migrationBuilder.CreateIndex(
                name: "UserID",
                table: "cart",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "CartID",
                table: "cartitems",
                column: "CartID");

            migrationBuilder.CreateIndex(
                name: "ProductID",
                table: "cartitems",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "UserID1",
                table: "order",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "OrderID",
                table: "orderitems",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "ProductID1",
                table: "orderitems",
                column: "ProductID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cartitems");

            migrationBuilder.DropTable(
                name: "orderitems");

            migrationBuilder.DropTable(
                name: "cart");

            migrationBuilder.DropTable(
                name: "order");

            migrationBuilder.DropTable(
                name: "product");

            migrationBuilder.DropTable(
                name: "user");
        }
    }
}
