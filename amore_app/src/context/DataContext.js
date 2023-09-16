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

    const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

    const fetchProducts = async () => {
        const data = await axios.get("/Products");
        setProducts(data.data || []);
    };

    const fetchUsers = async () => {
        const data = await axios.get("/Users", config);
        setUsers(data.data || []);
    };

    const fetchCart = async () => {
        const data = await axios.get(`/Carts/${userId}`, config);
        setCart(data.data || []);
    };

    const fetchCartItems = async () => {
        const data = await axios.get(`/Carts/${userId}/CartItems`, config);
        setCartItems(data.data || []);
    };

    const fetchOrders = async () => {
        const data = await axios.get("/Orders", config);
        setOrders(data.data || []);
    };

    const fetchOrderItems = async () => {
        const data = await axios.get("/OrderItems", config);
        setOrderItems(data.data || []);
    };

    useEffect(() => {
        fetchProducts();

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
                products,
                users,
                cart,
                cartItems,
                orders,
                orderItems,
                fetchProducts,
                fetchUsers,
                fetchCart,
                fetchCartItems,
                fetchOrders,
                fetchOrderItems,
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
