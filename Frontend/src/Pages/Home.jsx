import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "./Navbar";

const spineColors = [
  "from-amber-800 to-amber-600",
  "from-emerald-900 to-emerald-700",
  "from-rose-900 to-rose-700",
  "from-slate-700 to-slate-500",
  "from-violet-900 to-violet-700",
  "from-teal-900 to-teal-600",
  "from-orange-900 to-orange-700",
  "from-indigo-900 to-indigo-700",
];

const ornaments = ["📖", "📕", "📗", "📘", "📙"];

export const Home = () => {
  const [store, setStore] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchData();
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/library", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStore(response.data.data);
    } catch (err) {
      console.log("store error", err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950">
      <Navbar />

      <div className="text-center px-6 pt-16 pb-8">
        <p className="text-xs tracking-widest uppercase text-amber-500 font-mono mb-4">
          Curated Collection
        </p>
        <h1 className="text-6xl md:text-8xl font-black text-stone-100 leading-none tracking-tight">
          Book <span className="italic text-amber-400">Store</span>
        </h1>
        <p className="text-stone-500 italic mt-4 text-base">
          A haven for the discerning reader
        </p>
        <div className="w-16 h-px bg-amber-600 mx-auto mt-6 opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900 to-transparent" />
        <span className="text-xs font-mono tracking-widest uppercase text-amber-700">
          {store.length > 0 ? store.length + " volumes" : "Browse"}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {store && store.length > 0 ? (
          store.map((book, index) => (
            <div
              key={book._id}
              className={"group relative transition-all duration-700 " + (loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
              style={{ transitionDelay: index * 60 + "ms" }}
            >
              <div className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-stone-900 border border-amber-800 flex items-center justify-center">
                <span className="text-xs font-mono text-amber-500">{index + 1}</span>
              </div>

              <div className={"relative bg-gradient-to-br " + spineColors[index % spineColors.length] + " rounded-r-lg rounded-l-sm aspect-video flex flex-col justify-between p-4 overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 ease-out cursor-pointer"} style={{aspectRatio: "2/3"}}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/50 to-transparent" />
                <span className="text-2xl opacity-60 relative z-10">{ornaments[index % ornaments.length]}</span>
                <div className="relative z-10">
                  <div className="w-6 h-px bg-white/40 mb-2" />
                  <h2 className="text-white font-bold text-sm leading-snug">{book.title}</h2>
                  <p className="text-white/60 text-xs italic mt-1 truncate">by {book.author}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-800">
                <p className="text-stone-500 italic text-xs truncate max-w-24">{book.author}</p>
                <span className="text-amber-400 text-xs font-mono bg-amber-950 border border-amber-800 px-2 py-1 rounded whitespace-nowrap">
                  Rs.{book.price}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-24">
            <p className="text-5xl mb-4 opacity-30">📚</p>
            <p className="text-stone-600 italic text-xl">The shelves await their stories...</p>
          </div>
        )}
      </div>
    </div>
  );
};