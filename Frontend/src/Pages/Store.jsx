import React, { useEffect, useState } from 'react'
import api from '../../services/api';

export default function Store() {
    const [store, setStore] = useState([]);

    useEffect(() => {
        fetchStore()
    }, [])

    const fetchStore = async () => {
        try {
            const response = await api.get("/store");
            console.log(response);
            setStore(response.data.data)
        } catch (err) {
            console.log("Store error:", err)
        }
    }

    return (
        <div>
            {store.map((book) => (
                <div key={book._id}>
                    <h2>{book.author}</h2>
                </div>
            ))}
        </div>
    )
}