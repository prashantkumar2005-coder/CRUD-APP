import React, { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", login);
      if (response.data.success) {
        setLogin({ email: "", password: "" });
        localStorage.setItem("token", response.data.token);
        alert("Welcome " + login.email);
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      const { response } = err;
      console.log("login err : ", response);
      alert(response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">

      {/* Glow blob */}
      <div className="absolute w-96 h-96 bg-amber-600 opacity-5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">

        {/* Top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-t-2xl" />

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-b-2xl shadow-2xl px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="text-xl font-black text-stone-100 hover:text-amber-400 transition mb-6 inline-block">
              📚 <span className="italic text-amber-400">Kitab</span>Ghar
            </Link>
            <p className="text-xs font-mono tracking-widest uppercase text-amber-500 mb-2">Welcome back</p>
            <h1 className="text-3xl font-black text-stone-100 tracking-tight">
              Sign in to your <span className="italic text-amber-400">account</span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-widest uppercase text-stone-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={login.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono tracking-widest uppercase text-stone-500">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={login.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="bg-stone-800 text-stone-100 placeholder-stone-600 border border-stone-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition duration-200 hover:scale-105 active:scale-95 shadow-lg text-sm tracking-wide"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-stone-800" />
              <span className="text-stone-700 text-xs font-mono">or</span>
              <div className="flex-1 h-px bg-stone-800" />
            </div>

            {/* Register link */}
            <p className="text-center text-stone-500 text-sm">
              Don't have an account?{" "}
              <Link to="/Register" className="text-amber-400 hover:text-amber-300 font-semibold transition">
                Register
              </Link>
            </p>

            {/* Back */}
            <Link
              to="/"
              className="text-center text-xs font-mono tracking-widest uppercase text-stone-700 hover:text-stone-400 transition"
            >
              Back to Home
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;