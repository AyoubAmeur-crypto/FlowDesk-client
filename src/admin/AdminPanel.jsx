import { useState } from "react";
import NavBar from "../pannelComponents/NavBar";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../globalState/zustand";


export default function AdminPanel() {


  const userData = useAuthStore((state)=>state.userData)

  if(userData.roles.includes('ROLE_ADMIN'))return <main className="flex flex-col items-center bg-white">
    <NavBar/>
    <Outlet/>
  </main>
 
  return <Navigate to='/'/>

}