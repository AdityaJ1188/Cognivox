import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Chat from './components/Chat';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
