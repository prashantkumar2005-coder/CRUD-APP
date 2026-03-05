import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState(!!localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    "text-sm font-mono tracking-widest uppercase transition duration-200 " +
    (isActive ? "text-amber-400" : "text-stone-400 hover:text-amber-300");

  return (
    <nav className="bg-stone-950 border-b border-stone-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-black tracking-tight text-stone-100 hover:text-amber-400 transition duration-200"
        >
          📚 <span className="italic text-amber-400">Kitab</span>Ghar
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/Store" className={navLinkClass}>Store</NavLink>

          {token ? (
            <>
              <button
                onClick={handleLogout}
                className="text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-lg bg-red-950 text-red-400 border border-red-900 hover:bg-red-600 hover:text-white hover:border-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/Register" className={navLinkClass}>Register</NavLink>
              <NavLink
                to="/Login"
                className="text-xs font-mono tracking-widest uppercase px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition duration-200"
              >
                Login
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={"block w-6 h-px bg-stone-300 transition-all duration-300 " + (menuOpen ? "rotate-45 translate-y-2" : "")} />
          <span className={"block w-6 h-px bg-stone-300 transition-all duration-300 " + (menuOpen ? "opacity-0" : "")} />
          <span className={"block w-6 h-px bg-stone-300 transition-all duration-300 " + (menuOpen ? "-rotate-45 -translate-y-2" : "")} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={"md:hidden overflow-hidden transition-all duration-300 " + (menuOpen ? "max-h-64 border-t border-stone-800" : "max-h-0")}>
        <div className="flex flex-col px-6 py-4 gap-4 bg-stone-950">
          <NavLink to="/Store" className={navLinkClass} onClick={() => setMenuOpen(false)}>Store</NavLink>

          {token ? (
            <>
              <button
                onClick={handleLogout}
                className="text-left text-xs font-mono tracking-widest uppercase text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/Register" className={navLinkClass} onClick={() => setMenuOpen(false)}>Register</NavLink>
              <NavLink to="/Login" className={navLinkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}