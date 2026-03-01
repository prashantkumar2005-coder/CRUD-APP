import React, { useEffect } from 'react'
import "./Library.css";
import { useState } from 'react'
import api from '../services/api'

export default function Library() {

    // Stores the list of all books fetched from the server
    const [books, setBooks] = useState([])

    // Stores the ID of the book currently being edited (null means we're in "add" mode)
    const [edit, setEdit] = useState(null)

    // Stores the current values of the form inputs (title, author, price)
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        price: ""
    })

    // Runs once when the component loads — fetches books from the backend
    useEffect(() => {
        fetchBooks()
    }, [])

    // Fetches all books from the backend and saves them in the `books` state
    const fetchBooks = async () => {
        try {
            const res = await api.get("/library");
            setBooks(res.data.data); // Update the books list with the response data
        } catch (err) {
            console.log("Fetch Error ", err)
        }
    }

    // Handles form submission for both adding a new book and updating an existing one
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the page from refreshing on form submit

        try {
            if (edit) {
                // If we're in edit mode, send a PUT request to update the book by its ID
                await api.put(`/library/${edit}`, formData);
                setEdit(null) // Exit edit mode after updating
            } else {
                // If we're in add mode, send a POST request to create a new book
                await api.post("/library", formData);
            }

            await fetchBooks(); // Refresh the book list to show the latest data
        } catch (err) {
            console.log("creation error", err);
            alert("book not created , some error");
        }

        // Clear the form fields after submission
        setFormData({
            title: "",
            author: "",
            price: ""
        })
    }

    // Updates formData state whenever the user types in any input field
    const handleChange = (e) => {
        const { name, value } = e.target; // Get the input's name and current value

        // Update only the field that changed, keep the rest as-is
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    }

    // Pre-fills the form with the selected book's data and switches to edit mode
    const handleEdit = (book) => {
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price,
        });
        setEdit(book._id); // Save the book's ID so we know which one to update
    }

    // Deletes a book by its ID after sending a DELETE request to the backend
    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/library/${id}`);

            if (res.data.success) {
                alert("Succcesfully Deleted");
                fetchBooks(); // Refresh the list after deletion
            }
        } catch (err) {
            console.log("Delete : something went wrong")
        }
    }

    return (
        <>
            <div className="library-container">

                {/* ── Form: used for both adding and editing a book ── */}
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

                    {/* Show "Update" button in edit mode, "Submit" button in add mode */}
                    {edit ? <button type="submit">Update</button> : <button type="submit">Submit</button>}

                </form>

                <h2 className="books-heading">Books</h2>

                {/* ── Book cards: one card rendered for each book in the list ── */}
                <div className="books-container">
                    {books.map((book) => (
                        <div key={book._id} className="book-card">
                            <h3>{book.title || "No Title"}</h3>
                            <p><strong>Author:</strong> {book.author}</p>
                            <p><strong>Price:</strong> ₹ {book.price}</p>

                            {/* Clicking Edit fills the form with this book's data */}
                            <button onClick={() => handleEdit(book)}>Edit</button>

                            {/* Clicking Delete removes this book from the database */}
                            <button onClick={() => handleDelete(book._id)}>Delete</button>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}