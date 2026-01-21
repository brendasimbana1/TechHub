import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "../css/Cita.css";
import { fetchAuthorized } from '../services/api';


const Cita = () => {
  const [materias, setMaterias] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null); // Nuevo estado
  const [formData, setFormData] = useState({
    mensaje: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMaterias = async () => {
      const token = localStorage.getItem("token");
      const res = await fetchAuthorized("http://localhost:5000/api/admin/materias", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res || res.sessionExpired) return;
      if (res.ok) setMaterias(await res.json());
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    if (!materiaSeleccionada) return;
    const fetchTutoresPorMateria = async () => {
      const token = localStorage.getItem("token");
      const res = await fetchAuthorized(`http://localhost:5000/api/student/tutors?materia=${materiaSeleccionada}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res || res.sessionExpired) return;
      if (res.ok) setTutores(await res.json());
    };
    fetchTutoresPorMateria();
    setTutorSeleccionado(null);
    setHorarioSeleccionado(null);
  }, [materiaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mensaje.trim()) {
      toast.error("Por favor, describe los temas a revisar.");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        tutor_id: tutorSeleccionado.id,
        materia: materiaSeleccionada,
        fecha: horarioSeleccionado.dia,
        hora: `${horarioSeleccionado.horaInicio} - ${horarioSeleccionado.horaFin}`,
        mensaje: formData.mensaje
      };

      const res = await fetch("http://localhost:5000/api/student/request-tutor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Tutoría solicitada correctamente");
        setMateriaSeleccionada("");
        setTutorSeleccionado(null);
        setHorarioSeleccionado(null);
        setFormData({ mensaje: "" });
      } else {
        const err = await res.json();
        toast.error(err.error || "Error al procesar solicitud");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cita-container">
      <div className="cita-box">
        <div className="header-section">
          <h1>Solicitar Tutoría</h1>
          <p className="subtitle">Encuentra apoyo académico en cuatro pasos.</p>
        </div>

        <form onSubmit={handleSubmit} className="cita-form">
          <div className="form-group">
            <label className="step-label">1. Selecciona la Asignatura</label>
            <select
              value={materiaSeleccionada}
              onChange={(e) => setMateriaSeleccionada(e.target.value)}
              required
            >
              <option value="">Buscar materia...</option>
              {materias.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {materiaSeleccionada && (
            <div className="form-group fade-in">
              <label className="step-label">2. Elige un Tutor disponible</label>
              <div className="tutor-grid">
                {tutores.map(t => (
                  <div
                    key={t.id}
                    className={`tutor-card ${tutorSeleccionado?.id === t.id ? 'active' : ''}`}
                    onClick={() => {
                      setTutorSeleccionado(t);
                      setHorarioSeleccionado(null); // Reset horario al cambiar tutor
                    }}
                  >
                    <div className="tutor-avatar">{t.nombre.charAt(0)}</div>
                    <div className="tutor-info">
                      <strong>{t.nombre}</strong>
                      <span>{t.semestre}º Semestre</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tutorSeleccionado && (
            <div className="details-section fade-in">

              <label className="step-label">3. Selecciona un horario de {tutorSeleccionado.nombre}</label>
              <div className="horarios-grid">
                {tutorSeleccionado.disponibilidad && tutorSeleccionado.disponibilidad.length > 0 ? (
                  tutorSeleccionado.disponibilidad.map((h, i) => (
                    <div
                      key={i}
                      className={`horario-slot ${horarioSeleccionado === h ? 'selected' : ''}`}
                      onClick={() => setHorarioSeleccionado(h)}
                    >
                      <span className="dia-tag">{h.dia}</span>
                      <span className="hora-tag">{h.horaInicio} - {h.horaFin}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-data-msg">Este tutor no ha configurado su disponibilidad aún.</p>
                )}
              </div>

              {horarioSeleccionado && (
                <div className="fade-in">
                  <div className="form-group">
                    <label className="step-label required-label">4. Comenta los temas que deseas revisar</label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Ej: Resolución de ejercicios sobre herencia y polimorfismo en Java..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || !horarioSeleccionado || !formData.mensaje.trim()}
                  >
                    {loading ? "Procesando..." : "Enviar   Solicitud de Tutoría"}
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Cita;