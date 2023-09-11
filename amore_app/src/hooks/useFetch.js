import { useState, useEffect } from "react";
import axios from "../api/axios";

const useFetch = (url, token = null, initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    url,
                    token
                        ? { headers: { Authorization: `Bearer ${token}` } }
                        : {}
                );
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, token]);

    return { data, loading, error };
};

export default useFetch;
