import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// Gradient colors for book covers
const spineColors = [
    "from-amber-700 to-amber-500",
    "from-emerald-800 to-emerald-600",
    "from-rose-800 to-rose-600",
    "from-violet-800 to-violet-600",
    "from-teal-800 to-teal-600",
    "from-orange-800 to-orange-600",
    "from-indigo-800 to-indigo-600",
    "from-cyan-800 to-cyan-600",
];

const ornaments = ["📖", "📕", "📗", "📘", "📙", "📓", "📒", "📔"];

export default function Store() {
    const navigate = useNavigate();

    // ─── State ────────────────────────────────────────────────
    const [books, setBooks] = useState([]);           // all books of current user
    const [loaded, setLoaded] = useState(false);      // for stagger animation
    const [editId, setEditId] = useState(null);       // which book is being edited
    const [formData, setFormData] = useState({ title: "", author: "", price: "" });
    const [loading, setLoading] = useState(false);    // form submit loading
    const [showForm, setShowForm] = useState(false);  // toggle add form

    // ─── On Mount ─────────────────────────────────────────────
    useEffect(() => {
        fetchStore();
        setTimeout(() => setLoaded(true), 100);
    }, []);

    // ─── Fetch books created by the logged-in user ────────────
    const fetchStore = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/store", {
                headers: { Authorization: "Bearer " + token },
            });

            console.log("API Response:", response.data);

            // SAFE CHECK
            if (Array.isArray(response.data)) {
                setBooks(response.data);
            }
            else if (Array.isArray(response.data.data)) {
                setBooks(response.data.data);
            }
            else {
                setBooks([]);
            }

        } catch (err) {
            console.log("fetchStore err:", err.response);

            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.clear();
                navigate("/");
                return;
            }

            alert("Failed to fetch books");
        }
    };

    // ─── Handle form input change ─────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ─── Add or Update book ───────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            if (editId) {
                // UPDATE existing book
                await api.put("/store/" + editId, formData, {
                    headers: { Authorization: "Bearer " + token },
                });
                setEditId(null);
            } else {
                // CREATE new book
                await api.post("/store", formData, {
                    headers: { Authorization: "Bearer " + token },
                });
            }

            // Reset form and refetch
            setFormData({ title: "", author: "", price: "" });
            setShowForm(false);
            await fetchStore();
        } catch (err) {
            console.log("Submit Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ─── Populate form for editing ────────────────────────────
    const handleEdit = (book) => {
        setFormData({ title: book.title, author: book.author, price: book.price });
        setEditId(book._id);
        setShowForm(true);
        // Scroll to top so form is visible
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ─── Delete a book ────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this book?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await api.delete("/store/" + id, {
                headers: { Authorization: "Bearer " + token },
            });
            if (res.data.success) fetchStore();
        } catch (err) {
            console.log("Delete Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    // ─── Cancel edit / close form ─────────────────────────────
    const handleCancel = () => {
        setEditId(null);
        setFormData({ title: "", author: "", price: "" });
        setShowForm(false);
    };

    // ─── Render ───────────────────────────────────────────────
    return (
        <>

            <Navbar />

            <div className="min-h-screen bg-stone-950 py-10 px-4">
                <div className="max-w-6xl mx-auto">

                    {/* ── Page Header ── */}
                    <div className="text-center mb-10">
                        <p className="text-xs font-mono tracking-widest uppercase text-amber-500 mb-3">My Collection</p>
                        <h1 className="text-5xl md:text-7xl font-black text-stone-100 leading-none tracking-tight">
                            My <span className="italic text-amber-400">Store</span>
                        </h1>
                        <p className="text-stone-500 italic mt-3 text-sm">Books added by you — only visible to you</p>
                        <div className="w-16 h-px bg-amber-700 mx-auto mt-5 opacity-50" />
                    </div>

                    {/* ── Add Book Toggle Button ── */}
                    {!showForm && (
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition duration-200 hover:scale-105 active:scale-95 shadow-lg"
                            >
                                + Add New Book
                            </button>
                        </div>
                    )}

                    {/* ── Add / Edit Form ── */}
                    {showForm && (
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 mb-10 shadow-2xl">
                            {/* Form heading changes based on edit or add mode */}
                            <h2 className={"text-xl font-bold mb-6 font-mono tracking-wide " + (editId ? "text-amber-400" : "text-stone-100")}>
                                {editId ? "✏️  Update Book" : "➕  Add New Book"}
                            </h2>

                            <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">

                                {/* Title */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-mono tracking-widest uppercase text-stone-500">Title</label>
                                    <input
                                        type="text" name="title" value={formData.title} onChange={handleChange}
                                        placeholder="Book title" required
                                        className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Author */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-mono tracking-widest uppercase text-stone-500">Author</label>
                                    <input
                                        type="text" name="author" value={formData.author} onChange={handleChange}
                                        placeholder="Author name" required
                                        className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Price */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-mono tracking-widest uppercase text-stone-500">Price (Rs.)</label>
                                    <input
                                        type="number" name="price" value={formData.price} onChange={handleChange}
                                        placeholder="Enter price" required
                                        className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="md:col-span-3 flex gap-3 justify-end pt-2">
                                    <button
                                        type="button" onClick={handleCancel}
                                        className="px-6 py-3 rounded-xl text-stone-400 font-semibold border border-stone-700 hover:border-stone-500 hover:text-stone-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" disabled={loading}
                                        className={"px-8 py-3 rounded-xl text-white font-bold shadow-lg transition duration-200 hover:scale-105 active:scale-95 " + (editId ? "bg-amber-500 hover:bg-amber-400" : "bg-amber-600 hover:bg-amber-500") + (loading ? " opacity-50 cursor-not-allowed" : "")}
                                    >
                                        {loading ? "Saving..." : editId ? "Update Book" : "Add Book"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    )}

                    {/* ── Volume Count Divider ── */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
                        <span className="text-xs font-mono tracking-widest uppercase text-stone-600">
                            {books.length} {books.length === 1 ? "volume" : "volumes"} in your store
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
                    </div>

                    {/* ── Empty State ── */}
                    {books.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-5xl mb-4 opacity-20">📦</p>
                            <p className="text-stone-600 italic text-xl mb-6">Your store is empty. Add your first book!</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition hover:scale-105"
                            >
                                + Add Book
                            </button>
                        </div>
                    ) : (

                        /* ── Books Grid ── */
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {books.map((book, index) => (
                                <div
                                    key={book._id}
                                    className={"group relative transition-all duration-700 " + (loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}
                                    style={{ transitionDelay: (index * 60) + "ms" }}
                                >
                                    {/* Index badge */}
                                    <div className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-stone-950 border border-amber-800 flex items-center justify-center">
                                        <span className="text-xs font-mono text-amber-500">{index + 1}</span>
                                    </div>

                                    {/* Book Cover */}
                                    <div
                                        className={"relative bg-gradient-to-br " + spineColors[index % spineColors.length] + " rounded-r-xl rounded-l-sm overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 cursor-pointer"}
                                        style={{ aspectRatio: "3/2" }}
                                    >
                                        {/* Gloss overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
                                        {/* Spine shadow */}
                                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/50 to-transparent" />
                                        {/* Cover content */}
                                        <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                            <span className="text-3xl opacity-70">{ornaments[index % ornaments.length]}</span>
                                            <div>
                                                <div className="w-8 h-px bg-white/30 mb-2" />
                                                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow">{book.title}</h3>
                                                <p className="text-white/60 text-xs italic mt-1 truncate">by {book.author}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="bg-stone-900 border border-stone-800 border-t-0 rounded-b-xl px-4 pt-3 pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-stone-400 italic text-xs truncate max-w-24">{book.author}</p>
                                            <span className="text-amber-400 text-xs font-mono bg-amber-950 border border-amber-900 px-2 py-0.5 rounded whitespace-nowrap">
                                                Rs.{book.price}
                                            </span>
                                        </div>

                                        {/* Edit / Delete buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(book)}
                                                className="flex-1 bg-stone-800 hover:bg-amber-500 text-stone-300 hover:text-white text-xs font-semibold py-2 rounded-lg border border-stone-700 hover:border-amber-500 transition duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book._id)}
                                                className="flex-1 bg-stone-800 hover:bg-red-600 text-stone-300 hover:text-white text-xs font-semibold py-2 rounded-lg border border-stone-700 hover:border-red-600 transition duration-200"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}