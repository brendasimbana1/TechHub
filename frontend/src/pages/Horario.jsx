import React, { useState, useEffect } from 'react';
import { fetchMaterias, fetchTutores, registerHorario } from '../services/apiService';
import '../css/Gestionar.css';

const Gestionar = () => {
  const [materias, setMaterias] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');

  useEffect(() => {
    const getMaterias = async () => {
      const data = await fetchMaterias();
      setMaterias(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMateria || !selectedTutor || !fecha || !horaInicio || !horaFin) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const horarioData = {
      tutor: selectedTutor, //backend debe recibir lo mismo!!!
      materias: selectedMateria,
      horario: [
        {
          fecha: new Date(fecha).toISOString().split('T')[0],
          inicio: horaInicio,
          fin: horaFin,
        },
      ],
    };

    try {
      const result = await registerHorario(horarioData);

      if (result.message === 'Horario registrado con éxito') {
        alert(result.message);
      } else {
        alert('Error al registrar el horario');
      }

      setSelectedMateria('');
      setSelectedTutor('');
      setFecha('');
      setHoraInicio('');
      setHoraFin('');
    } catch (error) {
      console.error('Error al registrar el horario', error);
      alert('Ocurrió un error, intente más tarde');
    }
  };

  return (
    <div className="form-container">
      <div className="form-container-box">
        <h2>Registro de Horarios de Tutorías</h2>

        <form className="appointment-form" onSubmit={handleSubmit}>

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
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Hora de inicio:</label>
            <input
              type="time"
              className="input-field"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Hora de fin:</label>
            <input
              type="time"
              className="input-field"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
            />
          </div>

          <button className="submit-button" type="submit">
            Enviar
          </button>

        </form>
      </div>
    </div>
  );
};

export default Gestionar;
