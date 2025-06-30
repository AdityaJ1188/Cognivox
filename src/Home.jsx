import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";


function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat");
  };

  return (
    <>
      {/* <h1 className="text-white text-4xl">Hello</h1>
      <button onClick={handleClick}>Go to Chat</button> */}
      <Navbar />

      {/* Hero Section */}
      <div className="flex h-screen justify-center items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center py-10">
              <div className="space-y-2">
                <img
                  src="/Cognivox_name-2.png"
                  alt="Study Smarter with AI"
                  className="h-[8rem] sm:h-[9rem] md:h-[10rem] lg:h-[12rem]"
                  style={{ boxShadow: "0 4px 12px rgba(255, 255, 255, 0.5)" }}
                />
                <p className="mx-auto max-w-[400px] text-white">
                  Let Cognivox AI guide your learning. Ask, explore, and
                  understand concepts quicker than ever before.
                </p>
              </div>
              <div className="space-x-4">
                <a href="/chat">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:bg-primary/90 h-9 px-4 py-2 bg-[#202020] border border-[#353535] text-white">
                    Get Started
                  </button>
                </a>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm h-9 px-4 py-2 bg-[#202020] border border-[#353535] hover:bg-[#181818] hover:text-white text-white">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
