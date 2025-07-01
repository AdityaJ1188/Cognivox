import React from 'react';

export default function Navbar() {
  return (
   <div
  className="container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent"
  style={{ fontFamily: "'PT Sans', sans-serif" }}
>
  <img src="logo_nav.png" alt="Logo" className="h-14 w-auto" />

  {/* Nav links */}
  <ul className="hidden md:flex gap-12 text-white">
    <a href="#Header" className="cursor-pointer hover:text-gray-400 ">Home</a>
    <a href="#About" className="cursor-pointer hover:text-gray-400">About</a>
    <a href="#Projects" className="cursor-pointer hover:text-gray-400">Contact Us</a>
  </ul>

  {/* Buttons with small gap */}
  <div className="hidden md:flex gap-2">
    <button className="px-6 py-2 border border-white text-white bg-transparent rounded-full hover:text-white transition hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]">Log in</button>
    <button className="bg-white px-6 py-2 rounded-full hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]">Sign up</button>
  </div>

  {/* Mobile menu icon */}
  <img
    src="data:image/svg+xml,%3csvg%20width='36'%20height='29'%20viewBox='0%200%2036%2029'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='35.9988'%20height='4'%20rx='2'%20fill='white'/%3e%3crect%20x='13.0898'%20y='12.5'%20width='22.9083'%20height='4'%20rx='2'%20fill='white'/%3e%3crect%20x='4.91016'%20y='25'%20width='31.0899'%20height='4'%20rx='2'%20fill='white'/%3e%3c/svg%3e"
    className="md:hidden w-7 cursor-pointer"
    alt="Menu"
  />
</div>

  );
}
