import React, { useState } from "react";
import { loginUser } from "../services/apiService";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import "../css/Login.css";

const Login = ({ setIsAuthenticated, setRole }) => {
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const credentials = {
      email: formData.correo,
      password: formData.password
    };

    try {
      const result = await loginUser(credentials);
      if (result.token) {
        toast.success(`¡Bienvenido, ${result.nombre}!`);

        setRole(result.rol);
        setIsAuthenticated(true);

        localStorage.setItem("token", result.token);
        localStorage.setItem("rol", result.rol);
        localStorage.setItem("nombre", result.nombre);
        localStorage.setItem("isAuthenticated", "true");

        navigate("/");

      } else {
        toast.error(result.error || "Credenciales incorrectas");
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" role="main" aria-label="Formulario de inicio de sesión">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              autoComplete="current-password"
              minLength={8}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading} aria-busy={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
        <p className="register-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
