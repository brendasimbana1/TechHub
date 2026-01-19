import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

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
