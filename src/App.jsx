import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Chat from './components/Chat';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
