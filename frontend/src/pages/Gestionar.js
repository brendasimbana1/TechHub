import React, { useState } from 'react';
import '../css/Gestionar.css';
import { registerMateria } from "../services/apiService";

const Gestionar = () => {
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!specialty || !name || !date) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const materiaData = {
      nombre: specialty,
      tutor: name,
      fechaIngreso: date,
    };

    try {
      const result = await registerMateria(materiaData);
      if (result.message === 'Materia registrada con éxito') {
        alert(result.message);

      }else if (result.message === 'Error al registrar la materia'){
        alert(result.message);
      }else if (result.message === "El nombre ya está registrado."){
        alert(result.message);
      }else{
        alert(result.message);
      }
      setSpecialty('');
      setDate('');
      setName('');
      
    } catch (error) {
      alert("Error al registrar la materia")
      console.error("Error al registrar la materia", error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-container-box">
        <h2>Registro de Materias</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <br></br>
            <label>Materia:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Programación"
                  checked={specialty === 'Programación'}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
                Programación
              </label>
              <label>
                <input
                  type="radio"
                  value="Estructura de Datos"
                  checked={specialty === 'Estructura de Datos'}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
                Estructura de Datos
              </label>
              <label>
                <input
                  type="radio"
                  value="Fundamentos de BD"
                  checked={specialty === 'Fundamentos de BD'}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
                Fundamentos de BD
              </label>
              <label>
                <input
                  type="radio"
                  value="Electrónica"
                  checked={specialty === 'Electrónica'}
                  onChange={(e) => setSpecialty(e.target.value)}
                />
                Electrónica
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre del tutor/a"
            />
          </div>

          <div className="form-group">
            <label>Fecha de ingreso:</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button className="submit-button" type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Gestionar;
