import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export const Home = () => {
    const [store, setStore] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("token " , token)
            const response = await api.get("/library", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setStore(response.data.data)
        } catch (err) {
            console.log('store error', err)
        }
    }

    return (
        <div className="store-wrapper">
            <h1 className="store-heading">📚 Book Store</h1>
            <div className="store-grid">
                {store && store.map((book) => (
                    <div className="book-card" key={book._id}>
                        <div className="book-spine"></div>
                        <div className="book-info">
                            <h2 className="book-title">{book.title}</h2>
                            <p className="book-author">by {book.author}</p>
                            <span className="book-price">Rs. {book.price}</span>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}