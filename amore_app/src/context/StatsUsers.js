// ### Users: About Users
// 1. **Total Users**: Count from the `user` table.
// 2. **User Roles**: Breakdown of user roles (admin, user, etc.)
// 3. **New Sign-ups**: Count of users created this week.
// 4. **Last Logins**: 5 most recent logins.
const STATUS_MAP = {
	0: "Processing",
	1: "Shipped",
	2: "Delivered",
	3: "Canceled",
};
const ROLE_MAP = {
	0: "User",
	1: "Admin",
};
// cartItem = {
// 	cartItemId: 0,
// 	cartId: 0,
// 	productId: 0,
// 	quantity: 2147483647,
// };
// cart = {
// 	cartId: 0,
// 	userId: 0,
// 	totalPrice: 2147483647,
// };
// orderItem = {
// 	orderItemId: 0,
// 	orderId: 0,
// 	productId: 0,
// 	quantity: 2147483647,
// };
// order = {
// 	orderId: 0,
// 	userId: 0,
// 	orderDate: "2023-09-19T09:33:38.952Z",
// 	status: 0,
// };
// product = {
// 	productId: 0,
// 	productName: "string",
// 	description: "string",
// 	price: 0.01,
// 	category: "string",
// 	gender: 0,
// 	stockQuantity: 2147483647,
// 	dateAdded: "2023-09-19T09:34:00.619Z",
// 	picture: "string",
// };
// user = {
// 	userId: 0,
// 	username: "string",
// 	email: "user@example.com",
// 	userRole: 0,
// 	lastLoginDate: "2023-09-19T09:34:18.148Z",
// 	dateCreated: "2023-09-19T09:34:18.148Z",
// 	passwordHash: "string",
// 	picture: "string",
// };
