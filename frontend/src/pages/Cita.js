import React, { useState, useEffect } from 'react';
import '../css/Cita.css';
import { fetchMaterias, registrarCita, fetchTutores, fetchHorariosDisponibles } from '../services/apiService';
import { useNavigate } from "react-router-dom";

const Cita = () => {
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [date, setDate] = useState("");
  const [tutores, setTutores] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [availableHours, setAvailableHours] = useState([]);
  const [hour, setHour] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
  const getMaterias = async () => {
    try {
      const data = await fetchMaterias();
      if (Array.isArray(data)) {
        setMaterias(data);
      } else {
        console.error("Materias no es un array:", data);
        setMaterias([]);
      }
    } catch (error) {
      console.error("Error al obtener materias:", error);
      setMaterias([]);
    }
  };
  getMaterias();
}, []);
    useEffect(() => {
      const getTutores = async () => {
        if (selectedMateria) {
          const data = await fetchTutores(selectedMateria);
          setTutores(data);
        }
      };
      getTutores();
    }, [selectedMateria]);

    useEffect(() => {
      const getHorarios = async () => {
        if (selectedTutor && date) {
          const data = await fetchHorariosDisponibles(selectedTutor, date);
          setAvailableHours(data);
        }
      };
      getHorarios();
    }, [selectedTutor, date]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMateria || !selectedTutor || !selectedMateria || !date || !hour || !reason) {
      alert('Por favor, completa todos los campos.');
      return;
  }
    const userId = localStorage.getItem('userId');
    const CitaData = { 
      pacienteId: userId,
      tutorId: selectedTutor,
      materia: selectedMateria,
      fecha: date,
      hora: hour,
      motivo: reason,
  }
    const result = await registrarCita(CitaData);
    if (result.message === 'Cita registrada exitosamente.') {
        alert(result.message);
        navigate("/MisCitas"); 
      }else{
      alert("Error al registar la cita");
      }
  };

  return (
    <div className="form-container">
      <div className="form-container-box">
        <h2>Formulario de Cita Médica</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-group">
          <div className="form-group">
            <label>Materia:</label>
            <select
              className="input-field"
              value={selectedMateria}
              onChange={(e) => setSelectedMateria(e.target.value)}
            >
              <option value="">Seleccione una materia</option>
              {materias.map((materia, index) => (
                <option key={index} value={materia.nombre}>
                  {materia.nombre}
                </option>
              ))}
            </select>
          </div>
          </div>

          {tutores.length > 0 && (
            <div className="form-group">
              <label>Tutor:</label>
              <select
                className="input-field"
                value={selectedTutor}
                onChange={(e) => setSelectedTutor(e.target.value)}
              >
                <option value="">Seleccione un tutor</option>
                {tutores.map((tutor, index) => (
                  <option key={index} value={tutor}>
                    {tutor}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          
          {availableHours.length > 0 && (
          <div className="form-group">
          <label>Hora:</label>
          <select
            className="select-input"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
          >
            <option value="">Seleccione una hora</option>
            {availableHours.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
              </option>
            ))}
          </select>
          </div>
        )}
          

          
          <div className="form-group">
            <label>Motivo de consulta:</label>
            <input
              type="text"
              className="input-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ingrese el motivo de consulta"
            />
          </div>

          <button className="submit-button" type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Cita;
