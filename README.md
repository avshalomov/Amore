# Amore - Online Clothes Shopping Store

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
    -   [Database Management](#database-management)
    -   [Client-Side](#client-side)
    -   [Server-Side](#server-side)
    -   [Bonus](#bonus)
-   [Prerequisites](#prerequisites)
-   [Setup](#setup)
    -   [Step 1: Install Prerequisites](#step-1-install-prerequisites)
    -   [Step 2: Clone the Repository](#step-2-clone-the-repository)
    -   [Step 3: Backend Configuration](#step-3-backend-configuration)
    -   [Step 4: Frontend Configuration](#step-4-frontend-configuration)
-   [API Endpoints](#api-endpoints)
-   [Authors](#authors)
-   [License](#license)

## Overview

- **Site Overview**: Amore is a full-stack web application designed for online clothes shopping. It features a responsive client-side built with React, a robust server-side powered by ASP.NET Core API, and efficient database management using MySQL.
- **User Features**: Users of Amore enjoy a range of functionalities, including the ability to register and log in, edit their profile image and information, search and filter products, add items to their cart, modify quantities, place orders, and view their order history.
- **Administrator Capabilities**: Administrators on Amore have access to extensive management features. These include viewing and editing user profiles, assigning roles, complete CRUD operations for product management, and the ability to view and update the status of users orders. Additionally, administrators can access website statistics on the management page, providing valuable insights into the site's performance and user interactions.

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

## Prerequisites

-   **[Node.js (includes npm)](https://nodejs.org/en)**: React development and package management.
-   **[Visual Studio](https://visualstudio.microsoft.com/downloads)**: Includes .NET 7.0, ASP.NET, web development workloads.
-   **[dotnet-ef](https://docs.microsoft.com/en-us/ef/core/cli/dotnet)**: Entity Framework Core tools for database operations.
-   **[MySQL Server & Workbench](https://dev.mysql.com/downloads/installer/)**: Database management.
-   **[.NET 7.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)**: Backend development.
-   **[GIT](https://git-scm.com/download)**: Version control.

## Setup

### Step 1: Install Prerequisites

Ensure these tools are installed on your computer before proceeding:

1. **GIT**: [Download and Install](https://git-scm.com/download)
2. **Visual Studio**: Include .NET 7.0, ASP.NET, and web development workloads. [Download and Install](https://visualstudio.microsoft.com/downloads)
3. **MySQL**: Opt for the "Full" option. [Download and Install](https://dev.mysql.com/downloads/installer/)
    - **Post-Installation**: Use MySQL Workbench to verify server availability at `localhost:3306` with your set username and password.
4. **Node.js**: [Download and Install](https://nodejs.org/en)

### Step 2: Clone the Repository

Clone the project to your desired location using CMD:

```cmd
cd PATH_TO_YOUR_DESIRED_LOCATION
git clone https://github.com/avshalomov/Amore.git
```

### Step 3: Backend Configuration

Set up and run the backend service:

1. **Open Solution File**: Locate and open `Amore.sln` in `Amore/Amore.sln` using Visual Studio.
2. **Configure User Secrets**:
    - Right-click `amore_api` > `Manage User Secrets`.
    - Paste the following JSON structure:
        ```json
        {
        	"ConnectionStrings": {
        		"amore_db_string": "Server=localhost;Port=3306;Database=amore_db;User=root;Password=SERVER_PASSWORD;"
        	},
        	"Jwt": {
        		"Issuer": "amore_api",
        		"Audience": "amore_app",
        		"Key": "HMACSHA256_KEY_FOR_AUTHENTICATION"
        	}
        }
        ```
    - Replace `HMACSHA256_KEY_FOR_AUTHENTICATION` with your secret JWT key.
    - Update `SERVER_PASSWORD` to match your MySQL server password.
3. **Initialize Backend** (via CMD):
    ```cmd
    dotnet tool install --global dotnet-ef
    cd Amore/amore_api
    dotnet restore
    dotnet ef database update
    dotnet run
    ```

### Step 4: Frontend Configuration

Prepare the frontend application in CMD:

1. **Configure and Launch Frontend**:

    ```cmd
    cd Amore\amore_app
    echo REACT_APP_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY > .env
    npm install
    npm start
    ```

    Replace `YOUR_ACTUAL_SECRET_KEY` with your actual secret key.

2. **Accessing the Site**:
    - To log in as an administrator, use the following credentials on the login page:
        - Username: `admin`
        - Password: `Password!0`
    - Alternatively, you can register as a new user on the registration page.

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
