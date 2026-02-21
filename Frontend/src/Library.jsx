import React, { useEffect } from 'react'
import "./Library.css";

import { useState } from 'react'
import api from '../services/api'


export default function Library() {
    const [books, setBooks] = useState([])
    const [edit, setEdit] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: ""
    })
    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        const res = await api.get("/library");
        console.log(res.data.data);
        setBooks(res.data.data);

        console.log(books);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (edit) {
                await api.put(`/library/${edit}`, formData);
            } else {
                const result = await api.post("/library", formData);
            }

            await fetchBooks();
        } catch (err) {
            console.log("creation error", err);
            alert("book not created , some error");
        }
        setFormData({
            title: "",
            author: "",
            price: ""
        })


    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    }
    const handleEdit = (book) => {
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price,

        });
        setEdit(book._id);

    }
    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/library/${id}`);
            console.log(res);
            if (res.data.success) {

                alert("Succcesfully Deleted");
                fetchBooks();

            }

        } catch (err) {
            console.log("Delete : something went wrong")
        }
    }
    return (
        <>
            <>
                <div className="library-container">
                    <form onSubmit={handleSubmit} className="library-form">

                        <h2>Add Book</h2>

                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter book title"
                            required
                        />

                        <label>Author</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Enter author name"
                            required
                        />

                        <label>Price</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            required
                        />
                        {edit ? <button type="submit">Update</button> : <button type="submit">Submit</button>}

                    </form>

                    <h2 className="books-heading">Books</h2>

                    <div className="books-container">
                        {books.map((

                        ) => (
                            <div key={book._id} className="book-card">
                                <h3>{book.title || "No Title"}</h3>
                                <p><strong>Author:</strong> {book.author}</p>
                                <p><strong>Price:</strong> ₹ {book.price}</p>
                                <button onClick={() => handleEdit(book)}>Edit</button>
                                <button on onClick={() => handleDelete(book._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </>


        </>
    )
}
