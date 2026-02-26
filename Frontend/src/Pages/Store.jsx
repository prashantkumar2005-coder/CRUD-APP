import React, { useEffect, useEffectEvent, useState } from 'react'
import api from '../../services/api'

export const Store = () => {
    const [store, setStore] = useState([])
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        try {
            const response = await api.get("/library")
            console.log(response.data.data);
            setStore(response.data.data)
        } catch (err) {
            console.log('home error', err)
        }
    }

    return (
        <>
            {store &&
                store.map((book) => (
                    <div key={book._id}>
                        <h2>{book.title}</h2>
                        <h2>{book.author}</h2>
                        <h2>{book.price}</h2>
                    </div>
                ))
            }
        </>
    )
}
