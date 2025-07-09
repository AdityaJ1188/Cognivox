import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const signup = () => navigate("/signup");

  return (
    <div className="h-full bg-[url('/background.png')] bg-cover bg-no-repeat bg-center md:bg-fixed overflow-hidden">
      <div className="flex flex-col justify-center items-center h-full space-y-6">
        <h1
          className="text-center text-white font-bold"
          style={{
            fontFamily: "'PT Sans', sans-serif",
            fontSize: "3.5rem",
            textShadow: `
              0 0 10px rgba(255, 255, 255, 0.6),
              0 0 20px rgba(255, 255, 255, 0.4)
            `,
          }}
        >
          Learn better. Faster. Smarter <br /> — with COGNIVOX
        </h1>

        <button onClick={signup} className="px-6 py-2 bg-white text-black rounded-full transition hover:bg-gray-200 hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]">
          Try it now
        </button>
      </div>
    </div>
  );
}

export default Home;
