import { useState, useEffect } from "react";
import axios from "axios";

const useCRUD = (action, data = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resourceData, setResourceData] = useState([]);

    let url = "http://localhost:5164/api/";
    const actionType = action.match(/(create|read|update|delete)([A-Z][a-z]+)/);
    let method = null;
    let resource = null;
    let id = null;

    if (actionType) {
        method = actionType[1].toUpperCase();
        resource = actionType[2].toLowerCase();

        url += resource.endsWith("s") ? resource : resource + "s";
        id = data[`${resource.endsWith("s") ? resource.slice(0, -1) : resource}Id`];
    } else {
        throw new Error(`Invalid action type: ${action}`);
    }

    const refetchData = async () => {
        try {
            const response = await axios.get(url);
            setResourceData(response.data);
        } catch (error) {
            setError(error);
        }
    };

    const CRUD = async (data = {}) => {
        setLoading(true);
        setError(null);

        try {
            if (method === "CREATE") {
                await axios.post(url, data);
            } else if (method === "READ") {
                await refetchData();
            } else if (method === "UPDATE") {
                await axios.put(`${url}/${id}`, data);
            } else if (method === "DELETE") {
                await axios.delete(`${url}/${id}`);
            }

            if (method !== "READ") {
                await refetchData();
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (method === "READ") {
            CRUD();
        }
    }, [action]);

    return { CRUD, loading, error, resourceData, setResourceData };
};

export default useCRUD;
