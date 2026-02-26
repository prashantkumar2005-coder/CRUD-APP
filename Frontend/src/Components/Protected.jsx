import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

export const Protected = () => {
  const navigate = useNavigate();
 let token = localStorage.getItem("token");

 if(!token){
  alert("Not authorized to this route / login first");
  return <Navigate to="/Login" />
 }
  return <Outlet />
}
