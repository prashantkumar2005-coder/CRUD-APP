import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">MyApp</Link>
      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/Login">Login</NavLink>
        <NavLink to="/Register">Register</NavLink>
      </div>
    </nav>
  )
}