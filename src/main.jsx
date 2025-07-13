import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // ✅ import here

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Wrap everything */}
      <BrowserRouter>       
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
