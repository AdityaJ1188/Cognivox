import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Chat from "./components/Chat";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route
          path="chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
