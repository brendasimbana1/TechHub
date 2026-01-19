import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';


// Componentes Globales
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Banner from "./components/Banner";

// Páginas Públicas
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Páginas de Estudiante
import Cita from "./pages/Cita.jsx";
import MisCitas from "./pages/MisCitas.jsx";

// Páginas de Tutor
import Gestionar from "./pages/Gestionar.jsx";
// import Solicitudes from "./pages/Solicitudes.jsx";

// Páginas de Admin
import CrearTutor from "./pages/CrearTutor.jsx";
import Actividad from "./pages/Actividad.jsx";  

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const storedRol = localStorage.getItem("rol");

    if (auth === "true") {
      setIsAuthenticated(true);
      setRol(storedRol);
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

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRol} />} 
          />
          <Route path="/register" element={<Register />} />

          {/* --- RUTAS DE ESTUDIANTE --- */}
          {isAuthenticated && rol === 'estudiante' && (
            <>
              <Route path="/cita" element={<Cita />} />
              <Route path="/MisCitas" element={<MisCitas />} />
            </>
          )}

          {/* --- RUTAS DE TUTOR --- */}
          {isAuthenticated && rol === 'tutor' && (
            <>
              <Route path="/gestionar" element={<Gestionar />} /> 
              {/* <Route path="/solicitudes" element={<Solicitudes />} /> */}
            </>
          )}

          {/* --- RUTAS DE ADMIN --- */}
          {isAuthenticated && rol === 'admin' && (
            <>
              <Route path="/admin/crear-tutor" element={<CrearTutor />} />
              <Route path="/admin/actividad" element={<Actividad />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
