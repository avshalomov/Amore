import React, { createContext, useEffect, useState, useContext } from "react";
import { useAppContext } from "../context/AppContext";
import useFetch from "../hooks/useFetch";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { userId, token } = useAppContext();

    const [usersData, setUsersData] = useState([]);
    const [cartData, setCartData] = useState([]);
    const [cartItemsData, setCartItemsData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [orderItemsData, setOrderItemsData] = useState([]);

    const { data: products } = useFetch("/Products");
    const { data: users } = useFetch("/Users", token);
    const { data: cart } = useFetch(`/Carts/${userId}`, token);
    const { data: cartItems } = useFetch("/CartItems", token);
    const { data: orders } = useFetch("/Orders", token);
    const { data: orderItems } = useFetch("/OrderItems", token);

    useEffect(() => {
        if (token) {
            setUsersData(users);
            setCartData(cart);
            setCartItemsData(cartItems);
            setOrdersData(orders);
            setOrderItemsData(orderItems);
        } else {
            setUsersData([]);
            setCartData([]);
            setCartItemsData([]);
            setOrdersData([]);
            setOrderItemsData([]);
        }
    }, [token, users, cart, cartItems, orders, orderItems]);

    return (
        <DataContext.Provider
            value={{
                products,
                usersData,
                cartData,
                cartItemsData,
                ordersData,
                orderItemsData,
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
