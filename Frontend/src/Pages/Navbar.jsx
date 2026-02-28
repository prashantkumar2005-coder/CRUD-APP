import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Home</Link>
      <div className="navbar-links">
        <NavLink to="/Store">Store</NavLink>
        <NavLink to="/Login">Login</NavLink>
        <NavLink to="/Register">Register</NavLink>
      </div>
    </nav>
  )
}