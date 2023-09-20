# Amore - Online Clothes Shopping Store

## Overview

Amore is a full-stack web application for online clothes shopping. It's built using React on the client-side, ASP.NET Core for the server-side, and MySQL for database management.

## Features

### Database Management

-   MySQL for data storage
-   CRUD and JOIN operations with Entity Framework (EF)
-   Validation with max lengths and non-null constraints

### Client-Side

-   Built with React
-   Dynamic navigation and footer
-   Features like login, CRUD operations, and search
-   React-Bootstrap for styling

### Server-Side

-   Built with ASP.NET Core
-   JWT Token authentication
-   OOP Principles and modularity
-   Logging with singleton pattern
-   DAL with repository pattern

### Bonus

-   CSS & React-Bootstrap for styling
-   State management via UseContext
-   Logging on server-side

## Prerequisites

-   Node.js
-   ASP.NET Core
-   MySQL Server

## How to Use

### Clone the Repository

```
git clone https://https://github.com/avshalomov/Amore.git
```

### Install Dependencies

Client-side:

```
cd amore_app
npm install
```

Server-side:

```
cd amore_api
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Configure Database and Secrets

Use the .NET Secret Manager to store the database connection string and JWT secret key.

Replace YOUR_PASSWORD and YOUR_SECRET_KEY with your own values.

```
{
  "ConnectionStrings": {
    "amore_db_string": "Server=localhost;Port=3306;Database=amore_db;User=root;Password=YOUR_PASSWORD;"
  },
  "Jwt": {
    "Issuer": "amore_api",
    "Audience": "amore_app",
    "Key": "YOUR_SECRET_KEY"
  }
}
```

### Run the Application

Client-side:

```
npm start
```

Server-side:

```
dotnet run
```

## API Endpoints

-   All need authorization token in header except for:
    -   `POST /Users/Register`
    -   `POST /Users/Login`
    -   `GET /Products`

### Users

-   `GET /Users`: Get all users (Authorized)
-   `GET /Users/{id}`: Get a user by id (Authorized)
-   `POST /Users/Register`: Register a new user
-   `POST /Users/Login`: Login a user
-   `PUT /Users/{id}`: Update a user's information (Authorized)
-   `PUT /Users/{id}/ChangeRole`: Change a user's role (Admin only)
-   `DELETE /Users/{id}`: Delete a user (Authorized)

### Products

-   `GET /Products`: Get all products
-   `GET /Products/{id}`: Get a product by id
-   `POST /Products`: Create a product (Admin only)
-   `PUT /Products/{id}`: Update a product (Admin only)
-   `DELETE /Products/{id}`: Delete a product (Admin only)

### Orders

-   `GET /Orders`: Get all orders (Authorized)
-   `GET /Orders/{id}`: Get an order by id (Authorized)
-   `POST /Orders`: Create a new order (Authorized)
-   `PUT /Orders/{id}`: Update an order (Authorized)
-   `DELETE /Orders/{id}`: Delete an order (Authorized)

### Order Items

-   `GET /OrderItems`: Get all order items (Authorized)
-   `GET /OrderItems/{id}`: Get order item by id (Authorized)

### Cart Management

-   `GET /Carts`: Get all carts (Admin only)
-   `GET /Carts/{id}`: Get cart by id (userId & Admin only)
-   `DELETE /Carts/{id}`: Deletes all cart items, doesn't delete the cart (userId & Admin only)
-   `GET /Carts/{id}/CartItems`: Get all cart items from cart (userId & Admin only)
-   `GET /Carts/{cartId}/CartItems/{cartItemId}`: Get cart item from cart (userId & Admin only)
-   `GET /Carts/{cartId}/CartItems/{cartItemId}/Product`: Get product details of a cart item (userId & Admin only)

### CartItems

-   `GET /CartItems`: Get all cart items (Authorized)
-   `GET /CartItems/{id}`: Get a cart item by id (Authorized)
-   `POST /CartItems`: Create a cart item (Authorized)
-   `PUT /CartItems/{id}`: Update a cart item (Authorized)
-   `DELETE /CartItems/{id}`: Delete a cart item (Authorized)

## Authors

-   Kanan Avshalomov

## License

This project is licensed under the MIT License.
