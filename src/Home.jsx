import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";


function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat");
  };

  return (
    < div style={{
          backgroundColor: "rgb(24, 24, 27)",
          backgroundImage: "url('/background.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}>
      {/* <h1 className="text-white text-4xl">Hello</h1>
      <button onClick={handleClick}>Go to Chat</button> */}
      <Navbar />

      {/* Hero Section */}
      <div
        className="flex h-screen justify-center items-center"
        
      >
        <h1
          className="text-center text-white"
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
      </div>
    </div>
  );
}

export default Home;
