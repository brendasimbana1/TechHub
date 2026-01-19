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
          <NavLink to="/" end>Inicio</NavLink>
        </li>
        
        {!isAuthenticated ? (
          <li>
            <NavLink to="/login">Iniciar Sesión</NavLink>
          </li>
        ) : (
          <>
            {rol === "tutor" && (
              <>
                <li>
                  <NavLink to="/gestionar">Mi Horario</NavLink>
                </li>
                <li>
                  <NavLink to="/solicitudes">Solicitudes</NavLink>
                </li>
              </>
            )}

            {rol === "estudiante" && (
              <>
                <li>
                  <NavLink to="/cita">Solicitar Tutoría</NavLink>
                </li>
                <li>
                  <NavLink to="/MisCitas">Mis Citas</NavLink>
                </li>
              </>
            )}

            {rol === "admin" && (
              <>
                <li>
                  <NavLink to="/admin/crear-tutor">Crear Tutor</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/actividad">Actividad</NavLink>
                </li>
              </>
            )}

            <li className="flex-spacer"></li>
            <li className="navbar-logout-container">
              <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;