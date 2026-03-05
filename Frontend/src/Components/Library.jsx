import React, { useEffect, useState } from "react";
import api from "../../services/api";

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

export default function Library() {
  const [books, setBooks] = useState([]);
  const [edit, setEdit] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", price: "" });

  useEffect(() => {
    fetchBooks();
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/library", { headers: { Authorization: "Bearer " + token } });
      setBooks(res.data.data);
    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (edit) {
        await api.put("/library/" + edit, formData, { headers: { Authorization: "Bearer " + token } });
        setEdit(null);
      } else {
        await api.post("/library", formData, { headers: { Authorization: "Bearer " + token } });
      }
      await fetchBooks();
      setFormData({ title: "", author: "", price: "" });
    } catch (err) {
      console.log("Creation Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (book) => {
    setFormData({ title: book.title, author: book.author, price: book.price });
    setEdit(book._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.delete("/library/" + id, { headers: { Authorization: "Bearer " + token } });
      if (res.data.success) fetchBooks();
    } catch (err) {
      console.log("Delete Error:", err.response?.data || err.message);
    }
  };

  const handleCancel = () => {
    setEdit(null);
    setFormData({ title: "", author: "", price: "" });
  };

  return (
    <div className="min-h-screen bg-stone-950 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-amber-500 font-mono mb-3">Admin Panel</p>
          <h1 className="text-5xl md:text-7xl font-black text-stone-100 leading-none tracking-tight">
            Library <span className="italic text-amber-400">Dashboard</span>
          </h1>
          <div className="w-20 h-px bg-amber-600 mx-auto mt-5 opacity-50" />
        </div>

        {/* Form Card */}
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8 mb-12 shadow-2xl">
          <h2 className={"text-xl font-bold mb-6 font-mono tracking-wide " + (edit ? "text-amber-400" : "text-stone-100")}>
            {edit ? "✏️  Update Book" : "➕  Add New Book"}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono tracking-widest uppercase text-stone-500">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono tracking-widest uppercase text-stone-500">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-mono tracking-widest uppercase text-stone-500">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                required
              />
            </div>

            <div className="md:col-span-3 flex gap-3 justify-end pt-2">
              {edit && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-xl text-stone-400 font-semibold border border-stone-700 hover:border-stone-500 hover:text-stone-200 transition duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={"px-8 py-3 rounded-xl text-white font-bold shadow-lg transition duration-200 hover:scale-105 active:scale-95 " + (edit ? "bg-amber-500 hover:bg-amber-400" : "bg-amber-600 hover:bg-amber-500")}
              >
                {edit ? "Update Book" : "Add Book"}
              </button>
            </div>
          </form>
        </div>

        {/* Books Count */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
          <span className="text-xs font-mono tracking-widest uppercase text-stone-600">
            {books.length} {books.length === 1 ? "volume" : "volumes"} in collection
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent" />
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4 opacity-20">📚</p>
            <p className="text-stone-600 italic text-xl">No books yet. Add your first one above!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <div
                key={book._id}
                className={"group relative transition-all duration-700 " + (loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}
                style={{ transitionDelay: (index * 60) + "ms" }}
              >
                {/* Number badge */}
                <div className="absolute -top-2 -right-2 z-10 w-7 h-7 rounded-full bg-stone-950 border border-amber-800 flex items-center justify-center">
                  <span className="text-xs font-mono text-amber-500">{index + 1}</span>
                </div>

                {/* Book Cover */}
                <div
                  className={"relative bg-gradient-to-br " + spineColors[index % spineColors.length] + " rounded-r-xl rounded-l-sm overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-400 cursor-pointer"}
                  style={{ aspectRatio: "3/2" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/50 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <span className="text-3xl opacity-70">{ornaments[index % ornaments.length]}</span>
                    <div>
                      <div className="w-8 h-px bg-white/30 mb-2" />
                      <h3 className="text-white font-bold text-base leading-snug line-clamp-2 drop-shadow">{book.title}</h3>
                      <p className="text-white/60 text-xs italic mt-1 truncate">by {book.author}</p>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="bg-stone-900 border border-stone-800 rounded-b-xl rounded-t-none px-4 pt-3 pb-4 -mt-1">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-stone-400 italic text-xs truncate max-w-28">{book.author}</p>
                    <span className="text-amber-400 text-xs font-mono bg-amber-950 border border-amber-900 px-2 py-0.5 rounded whitespace-nowrap">
                      Rs.{book.price}
                    </span>
                  </div>

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
  );
}