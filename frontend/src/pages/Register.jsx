import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/apiService";
import "../css/Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
      nombre: "",
      correo: "",
      password: "",
      semestre: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      if (!formData.nombre || !formData.correo || !formData.password || !formData.semestre) {
        alert("Por favor, completa todos los campos.")
        setLoading(false);
        return;
      }
  
      try {
        const datosParaBackend = {
            nombre: formData.nombre,
            email: formData.correo,     
            password: formData.password,
            semestre: parseInt(formData.semestre) 
        };
        const result = await registerUser(datosParaBackend);
  
        if (result.message === "Usuario creado" || result.message === "Usuario registrado exitosamente") {
          alert(result.message);
          navigate("/login"); 
        } else if (result.error){
          alert(result.error);
        }else {
          alert("Error al registrar el usuario")
          navigate("/login"); 
        }
        setFormData({
          nombre: "",
          correo: "",
          password: "",
          semestre: ""
        });
      } catch (error) {
        alert("Error al registrar el usuario.")
        console.error("Error al registrar el usuario:", error);
      }
  
      setLoading(false);
    };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="semestre">Semestre</label>
            <input
              type="number"
              id="semestre"
              name="semestre"
              min="1"
              max="8"
              value={formData.semestre}
              onChange={handleChange}
              placeholder="Ej: 4"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
              required
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
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
