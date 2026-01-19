import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated, rol }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    localStorage.removeItem('userId');

    setIsAuthenticated(false); 
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <NavLink  to="/"end>Inicio</NavLink >
        </li>
        {!isAuthenticated ? (
          <li>
            <NavLink  to="/login">Iniciar Sesión</NavLink >
          </li>
        ) : (
          <>
            {rol === "tutor" && (
              <>
                <li>
                  <NavLink  to="/gestionar">Gestionar</NavLink >
                </li>
                <li>
                  <NavLink  to="/horario">Horario</NavLink >
                </li>
              </>
            )}
            {rol === "estudiante" && (
              <>
                <li>
                  <NavLink  to="/cita">Tutorias</NavLink >
                </li>
                <li>
                  <NavLink  to="/MisCitas"> Mis Citas</NavLink >
                </li>
              </>
            )}
            <li>
              <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
