import { useState, useEffect } from "react";
import axios from "axios";

const useCRUD = (initialData, apiEndpoint) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5164/api/${apiEndpoint}`
            );
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const createData = async (newData) => {
        try {
            await axios.post(
                `http://localhost:5164/api/${apiEndpoint}`,
                newData
            );
            fetchData();
        } catch (err) {
            setError(err);
        }
    };

    const updateData = async (id, updatedData) => {
        try {
            await axios.put(
                `http://localhost:5164/api/${apiEndpoint}/${id}`,
                updatedData
            );
            fetchData();
        } catch (err) {
            setError(err);
        }
    };

    const deleteData = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5164/api/${apiEndpoint}/${id}`
            );
            fetchData();
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, createData, updateData, deleteData };
};

export default useCRUD;
