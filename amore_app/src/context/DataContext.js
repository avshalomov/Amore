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

    // Config for axios
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // Fetch data from the server
    const fetchData = async (url, setStateFunc, config = {}) => {
        try {
            const data = await axios.get(url, config);
            setStateFunc(data.data || []);
        } catch (error) {
            console.error(`Failed to fetch data from ${url}`, error);
            setStateFunc([]);
        }
    };

    // Fetch specific data from the server
    const fetchProducts = () => fetchData("/Products", setProducts);
    const fetchUsers = () => fetchData("/Users", setUsers, config);
    const fetchCart = () => fetchData(`/Carts/${userId}`, setCart, config);
    const fetchCartItems = () => fetchData(`/Carts/${userId}/CartItems`, setCartItems, config);
    const fetchOrders = () => fetchData("/Orders", setOrders, config);
    const fetchOrderItems = () => fetchData("/OrderItems", setOrderItems, config);

    // Initiate data on first render or when userId/token changes
    useEffect(() => {
        fetchProducts();
        // Only fetch data if user is logged in
        if (userId && token) {
            fetchUsers();
            fetchCart();
            fetchCartItems();
            fetchOrders();
            fetchOrderItems();
        } else {
            setUsers([]);
            setCart([]);
            setCartItems([]);
            setOrders([]);
            setOrderItems([]);
        }
    }, [userId, token]);

    return (
        <DataContext.Provider
            value={{
                products, fetchProducts,
                users, fetchUsers,
                cart, fetchCart,
                cartItems, fetchCartItems,
                orders, fetchOrders,
                orderItems, fetchOrderItems,
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
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
};
