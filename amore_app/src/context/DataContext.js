import React, { createContext, useEffect, useState, useContext } from "react";
import { useAppContext } from "../context/AppContext";
import useFetch from "../hooks/useFetch";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { userId, token } = useAppContext();

    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    const { data: fetchedProducts } = useFetch("/Products");
    const { data: fetchedUsers } = useFetch("/Users", token);
    const { data: fetchedCart } = useFetch(`/Carts/${userId}`, token);
    const { data: fetchedCartItems } = useFetch("/CartItems", token);
    const { data: fetchedOrders } = useFetch("/Orders", token);
    const { data: fetchedOrderItems } = useFetch("/OrderItems", token);

    useEffect(() => {
        if (token) {
            setProducts(fetchedProducts);
            setUsers(fetchedUsers);
            setCart(fetchedCart);
            setCartItems(fetchedCartItems);
            setOrders(fetchedOrders);
            setOrderItems(fetchedOrderItems);
        } else {
            setUsers([]);
            setCart([]);
            setCartItems([]);
            setOrders([]);
            setOrderItems([]);
        }
    }, [token,fetchedProducts, fetchedUsers, fetchedCart, fetchedCartItems, fetchedOrders, fetchedOrderItems]);

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

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
};
