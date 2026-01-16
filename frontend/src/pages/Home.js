import React from 'react';
import '../css/Home.css';
import logo from "../assets/ups2.jpg"; 

const Home = () => {
  return (
    <div className="home-page">
      <h1 className='titulo'>Bienvenido a TechHub</h1>
      
      <p>
        <strong>TechHub</strong> es una plataforma académica desarrollada para la carrera de
        <strong> Ingeniería en Ciencias de la Computación</strong> de la
        <strong> Universidad Politécnica Salesiana</strong>, cuyo objetivo es
        <strong> facilitar la gestión de citas para tutorías académicas</strong> entre
        estudiantes de niveles inferiores y tutores de niveles superiores.
      </p>

      <p>
        A través de TechHub se promueve una <strong>cultura salesiana de ayuda,
        acompañamiento y colaboración</strong>, fortaleciendo el aprendizaje entre pares
        y el sentido de comunidad universitaria.
      </p>
      
      <h2>¿Qué ofrece TechHub?</h2>
      <div className="columna">
        <div className="lista">
          <ul>
            <li>
              <strong>Agendamiento de tutorías:</strong> Los estudiantes pueden reservar
              citas académicas de forma sencilla y organizada.
            </li>
            <li>
              <strong>Tutorías entre pares:</strong> Estudiantes de niveles superiores
              brindan apoyo académico en distintas asignaturas.
            </li>
            <li>
              <strong>Gestión de horarios:</strong> Disponibilidad clara de tutores y
              horarios accesibles para todos.
            </li>
            <li>
              <strong>Seguimiento académico:</strong> Registro de tutorías para mejorar
              el acompañamiento estudiantil.
            </li>
          </ul>
        </div>

        <div className="logo">
          <img src={logo} alt="Logo TechHub" className="login-logo" />
        </div>
      </div>

      <h2>¿Por qué TechHub?</h2>
      <p>
        - Fomenta el aprendizaje colaborativo. <br />
        - Refuerza los valores salesianos de solidaridad y apoyo mutuo. <br />
        - Mejora el rendimiento académico de estudiantes de niveles iniciales. <br />
        - Incentiva el liderazgo académico en estudiantes de niveles superiores.
      </p>

      <h2>Dirigido a</h2>
      <p>
        Estudiantes de la carrera de Computación de la
        <strong> Universidad Politécnica Salesiana</strong> que requieran apoyo académico
        o deseen contribuir como tutores.
      </p>

      <h2>Contáctanos</h2>
      <p>
        Para más información sobre el uso de la plataforma o el programa de tutorías,
        comunícate con la coordinación de la carrera o con los responsables del proyecto
        TechHub.
      </p>
    </div>
  );
};

export default Home;
