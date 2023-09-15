import React, { createContext, useEffect, useState, useContext } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "../api/axios";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { userId, token } = useAppContext();

    // States
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productsData = await axios.get('/Products');
                setProducts(productsData.data || []);

                if (userId && token) {
                    const config = { headers: { Authorization: `Bearer ${token}` } };

                    // Fetch users
                    const usersData = await axios.get('/Users', config);
                    setUsers(usersData.data || []);

                    // Fetch cart
                    const cartData = await axios.get(`/Carts/${userId}`, config);
                    setCart(cartData.data || []);

                    // Fetch cart items
                    const cartItemsData = await axios.get(`/Carts/${userId}/CartItems`, config);
                    setCartItems(cartItemsData.data || []);

                    // Fetch orders
                    const ordersData = await axios.get('/Orders', config);
                    setOrders(ordersData.data || []);

                    // Fetch order items
                    const orderItemsData = await axios.get('/OrderItems', config);
                    setOrderItems(orderItemsData.data || []);
                } else {
                    setUsers([]);
                    setCart([]);
                    setCartItems([]);
                    setOrders([]);
                    setOrderItems([]);
                }
            } catch (error) {
                console.error('There was an error fetching the data', error);
            }
        };

        fetchData();
    }, [userId, token]);

    return (
        <DataContext.Provider
            value={{
                products,
                setProducts,
                users,
                setUsers,
                cart,
                setCart,
                cartItems,
                setCartItems,
                orders,
                setOrders,
                orderItems,
                setOrderItems,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to use the DataContext
export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
