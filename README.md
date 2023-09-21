# Amore - Online Clothes Shopping Store

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
    -   [Database Management](#database-management)
    -   [Client-Side](#client-side)
    -   [Server-Side](#server-side)
    -   [Bonus](#bonus)
-   [Technologies Used](#technologies-used)
-   [Prerequisites](#prerequisites)
-   [Setup](#setup)
    -   [Cloning Repository](#cloning-repository)
    -   [Running the API](#running-the-api)
    -   [Running the App](#running-the-app)
-   [API Endpoints](#api-endpoints)
    -   [Users](#users)
    -   [Products](#products)
    -   [Orders](#orders)
    -   [Order Items](#order-items)
    -   [Cart Management](#cart-management)
    -   [CartItems](#cartitems)
-   [Authors](#authors)
-   [License](#license)

## Overview

Amore is a full-stack web application for online clothes shopping, built with React on the client-side, ASP.NET Core API on the server-side, and MySQL for database management.

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
-   Logging logfile with singleton pattern
-   DAL with repository pattern

### Bonus

-   CSS & React-Bootstrap for styling
-   State management via UseContext
-   Logging logfile on server-side

## Technologies Used

-   Front-end: React
-   Back-end: ASP.NET Core API
-   Database: MySQL

## Prerequisites

-   Node.js
-   ASP.NET Core
-   MySQL Server
-   npm
-   Git

## Setup

### Cloning Repository

1. Open CMD and navigate to your desired location:
    ```
    cd YOUR_DESIRED_LOCATION
    ```
2. Clone the repository:
    ```
    git clone https://github.com/avshalomov/Amore.git
    ```

### Running the API

3. Open `Amore.sln` located in `Amore/Amore.sln`.
4. Right-click `amore_api` > `Manage User Secrets` and paste:
    ```json
    {
    	"ConnectionStrings": {
    		"amore_db_string": "Server=localhost;Port=3306;Database=amore_db;User=root;Password=SERVER_PASSWORD;"
    	},
    	"Jwt": {
    		"Issuer": "amore_api",
    		"Audience": "amore_app",
    		"Key": "SECRET_JWT_KEY"
    	}
    }
    ```
5. Update `"SECRET_JWT_KEY"` with your secret key.
6. Change or delete `SERVER_PASSWORD` as needed.
7. Navigate to `Amore/amore_api` in CMD:
    ```
    cd Amore/amore_api
    ```
8. Restore packages:
    ```
    dotnet restore
    ```
9. Update database:
    ```
    dotnet ef database update
    ```
10. Run the API:
    ```
    dotnet run
    ```

### Running the App

11. Create a `.env` file in `Amore/amore_app`.
12. Add this line (replace `SECRET_ENCRYPT_KEY` with your key):
    ```
    REACT_APP_SECRET_KEY=SECRET_ENCRYPT_KEY
    ```
13. Navigate to `Amore/amore_app` in CMD:
    ```
    cd Amore/amore_app
    ```
14. Install dependencies:
    ```
    npm install
    ```
15. Start the app:
    ```
    npm start
    ```
16. Login with `username-admin` and `password-Password!0`.

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

-   Git
-   Node.js
-   ASP.NET
-   MySQL Server
-   Visual Studio

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
