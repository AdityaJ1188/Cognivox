import React from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation  } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

export default function Layout() {
    const location = useLocation();
    const shouldHideNavbar = location.pathname.startsWith("/chat");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
     {!shouldHideNavbar && <Navbar />}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  );
}
