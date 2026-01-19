import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "../css/Gestionar.css";

const Gestionar = () => {
  const [horarios, setHorarios] = useState([]);
  const [nuevoBloque, setNuevoBloque] = useState({
    dia: "",
    horaInicio: "",
    horaFin: ""
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/tutor/availability", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setHorarios(data);
        }
      } catch (error) {
        console.error("Error al cargar disponibilidad:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchDisponibilidad();
  }, []);

  const handleInputChange = (e) => {
    setNuevoBloque({ ...nuevoBloque, [e.target.name]: e.target.value });
  };

  const isBloqueValid = nuevoBloque.dia !== "" && nuevoBloque.horaInicio !== "" && nuevoBloque.horaFin !== "";

  const agregarBloque = (e) => {
    e.preventDefault();
    if (nuevoBloque.horaInicio >= nuevoBloque.horaFin) {
      toast.error("La hora de inicio debe ser menor a la hora de fin");
      return;
    }
    setHorarios([...horarios, nuevoBloque]);
    setNuevoBloque({ dia: "", horaInicio: "", horaFin: "" }); 
  };

  const eliminarBloque = (index) => {
    const nuevosHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(nuevosHorarios);
  };

  const guardarDisponibilidad = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/tutor/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(horarios)
      });

      if (res.ok) {
        toast.success("Disponibilidad guardada correctamente");
      } else {
        toast.error("Error al guardar el horario");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading-screen">Cargando tu configuración...</div>;

  return (
    <div className="gestionar-container">
      <div className="gestionar-box">
        <h1>Gestionar Horario</h1>
        <p className="subtitle">Configura los días y horas en los que puedes brindar tutorías.</p>

        <div className="add-schedule-section">
          <h3>Añadir Bloque de Tiempo</h3>
          <div className="schedule-form">
            <div className="input-field">
              <label>Día</label>
              <select name="dia" value={nuevoBloque.dia} onChange={handleInputChange}>
                <option value="">Selecciona un día</option>
                {diasSemana.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="input-field">
              <label>Desde</label>
              <input type="time" name="horaInicio" value={nuevoBloque.horaInicio} onChange={handleInputChange} />
            </div>
            <div className="input-field">
              <label>Hasta</label>
              <input type="time" name="horaFin" value={nuevoBloque.horaFin} onChange={handleInputChange} />
            </div>
            <button 
              className="add-btn" 
              onClick={agregarBloque} 
              disabled={!isBloqueValid}
            >
              + Añadir
            </button>
          </div>
        </div>

        <hr className="divider" />

        <div className="current-schedule-section">
          <h3>Tu Horario Semanal</h3>
          {horarios.length === 0 ? (
            <p className="empty-msg">No has definido horarios aún.</p>
          ) : (
            <div className="schedule-list">
              {horarios.map((h, index) => (
                <div key={index} className="schedule-item">
                  <div className="item-info">
                    <strong>{h.dia}:</strong> {h.horaInicio} - {h.horaFin}
                  </div>
                  <button className="delete-btn" onClick={() => eliminarBloque(index)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          className="save-btn" 
          onClick={guardarDisponibilidad} 
          disabled={loading || horarios.length === 0}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default Gestionar;