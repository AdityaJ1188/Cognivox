import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1025);
    handleResize(); // Run on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const signupcomp = () => navigate("/signup");
  const logincomp = () => navigate("/login");

  return (
    <div
      className="h-20 w-full flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent relative z-50"
      style={{ fontFamily: "'PT Sans', sans-serif" }}
    >
      <img src="logo_nav.png" alt="Logo" className="h-14 w-auto" />

      {!isMobile && (
        <>
          <ul className="hidden md:flex gap-12 text-white">
            <a href="/" className="cursor-pointer hover:text-gray-400">Home</a>
            <a href="about" className="cursor-pointer hover:text-gray-400">About</a>
            <a href="contact" className="cursor-pointer hover:text-gray-400">Contact Us</a>
          </ul>

          <div className="hidden md:flex gap-2">
            <button onClick={logincomp} className="px-6 py-2 border border-white text-white bg-transparent rounded-full hover:bg-white hover:text-black transition hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]">Log in</button>
            <button onClick={signupcomp} className="px-6 py-2 bg-white text-black rounded-full hover:bg-white hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]">Sign up</button>
          </div>
        </>
      )}

      {isMobile && (
        <>
          <img
            onClick={() => setMenuOpen(!menuOpen)}
            src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='36'%20height='28'%20viewBox='0%200%2036%2028'%3E%3Crect%20width='36'%20height='4'%20rx='2'%20fill='white'/%3E%3Crect%20y='12'%20width='36'%20height='4'%20rx='2'%20fill='white'/%3E%3Crect%20y='24'%20width='36'%20height='4'%20rx='2'%20fill='white'/%3E%3C/svg%3E"
            className="w-7 cursor-pointer"
            alt="Menu"
          />

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-20 right-6 bg-zinc-900 p-4 rounded-md shadow-md flex flex-col space-y-3 z-50"
            >
              <a href="/" className="text-white hover:text-gray-300">Home</a>
              <a href="about" className="text-white hover:text-gray-300">About</a>
              <a href="contact" className="text-white hover:text-gray-300">Contact Us</a>
              <button onClick={logincomp} className="mt-2 px-6 py-2 border border-white text-white bg-transparent rounded-full hover:bg-white hover:text-black transition">Log in</button>
              <button onClick={signupcomp} className="px-6 py-2 bg-white text-black rounded-full">Sign up</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
