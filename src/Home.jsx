import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat");
  };

  return (
    <>
      <h1 className="text-white text-4xl">Hello</h1>
      <button onClick={handleClick}>Go to Chat</button>
    </>
  );
}

export default Home;
