import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Banner from "./components/Banner";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Cita from "./pages/Cita.jsx";
import MisCitas from "./pages/MisCitas.jsx";
import Gestionar from "./pages/Gestionar.jsx";
import Register
  from "./pages/Register.jsx";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const storedRol = localStorage.getItem("rol");

    if (auth === "true") {
      setIsAuthenticated(true);
      setRol(Number(storedRol));
    }
  }, []);

  return (
    <>
      <Banner />
      <Toaster
        position="top-right"
        containerStyle={{
          top: 40,
          right: 40,
          zIndex: 999999,
        }}
        toastOptions={{
          style: {
            minWidth: '350px', 
            fontSize: '18px', 
            fontWeight: '600',       
            padding: '20px',         
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          },
          success: {
            style: {
              background: '#e8f5e9',
              color: '#2e7d32',
              border: '2px solid #4caf50',
            },
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#ffebee', 
              color: '#c62828',      
              border: '2px solid #ef5350', 
            },
            iconTheme: {
              primary: '#ef5350',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        rol={rol}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setRole={setRol}
              />
            }
          />
          <Route path="/cita" element={<Cita />} />
          <Route path="/MisCitas" element={<MisCitas />} />
          <Route path="/gestionar" element={<Gestionar />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
