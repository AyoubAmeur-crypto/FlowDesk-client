import { useState } from "react";
import NavBar from "../pannelComponents/NavBar";
import { Outlet } from "react-router-dom";


export default function AdminPanel() {
 
  return <main className="flex flex-col items-center bg-white">
    <NavBar/>
    <Outlet/>
  </main>

}