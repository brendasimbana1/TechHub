import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "../css/CrearTutor.css";
import { fetchAuthorized } from '../services/api';


const CrearTutor = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    semestre: "1",
  });

  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [listaMaterias, setListaMaterias] = useState([]);
  const [loading, setLoading] = useState(false);

  const isFormValid = 
    formData.nombre.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    materiasSeleccionadas.length > 0;

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetchAuthorized("http://localhost:5000/api/admin/materias", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response || response.sessionExpired) return;
        if (response.ok) {
          const data = await response.json();
          setListaMaterias(data);
        } else {
          toast.error("No se pudieron cargar las asignaturas");
        }
      } catch (error) {
        console.error("Error cargando materias:", error);
      }
    };

    fetchMaterias();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMateriaToggle = (materia) => {
    if (materiasSeleccionadas.includes(materia)) {
      setMateriasSeleccionadas(materiasSeleccionadas.filter((m) => m !== materia));
    } else {
      setMateriasSeleccionadas([...materiasSeleccionadas, materia]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        semestre: parseInt(formData.semestre),
        materias: materiasSeleccionadas,
        rol: "tutor"
      };

      const response = await fetch("http://localhost:5000/api/admin/create-tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Tutor registrado exitosamente");
        setFormData({ nombre: "", email: "", password: "", semestre: "1" });
        setMateriasSeleccionadas([]);
      } else {
        toast.error(data.error || "Error al registrar tutor");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-tutor-container">
      <div className="crear-tutor-box">
        <h1>Registrar Nuevo Tutor</h1>
        <p className="subtitle">Asigna las credenciales y carga académica del tutor.</p>

        <form onSubmit={handleSubmit} className="tutor-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo Institucional</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jdoe@est.ups.edu.ec"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa la contraseña"
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label>Semestre</label>
            <select name="semestre" value={formData.semestre} onChange={handleChange}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>{num}º Semestre</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Asignaturas Autorizadas</label>

            {listaMaterias.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                Cargando materias disponibles...
              </p>
            ) : (
              <div className="materias-grid">
                {listaMaterias.map((materia) => (
                  <label key={materia} className="materia-checkbox">
                    <input
                      type="checkbox"
                      checked={materiasSeleccionadas.includes(materia)}
                      onChange={() => handleMateriaToggle(materia)}
                    />
                    <span>{materia}</span>
                  </label>
                ))}
              </div>
            )}

            <p className="selection-count">
              {materiasSeleccionadas.length} materias seleccionadas
            </p>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading || !isFormValid}
          >
            {loading ? "Registrando..." : "Crear Perfil de Tutor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearTutor;