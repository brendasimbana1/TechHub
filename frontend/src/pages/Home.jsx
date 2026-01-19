import React from 'react';
import '../css/Home.css';
import logo from "../assets/ups2.jpg"; 

const Home = () => {
  return (
    <div className="home-page">
      <h1 className='titulo'>Bienvenido a TechHub</h1>
      
      <div className="intro-section">
        <p>
          <strong>TechHub</strong> es una plataforma académica desarrollada para la carrera de
          <strong> Ingeniería en Ciencias de la Computación</strong> de la
          <strong> Universidad Politécnica Salesiana</strong>.
        </p>
        <p>
          Nuestro objetivo es <strong>facilitar la gestión de citas para tutorías académicas</strong>, 
          promoviendo una cultura de acompañamiento y colaboración entre pares para fortalecer 
          el sentido de comunidad universitaria.
        </p>
      </div>
      
      <h2>¿Qué ofrece TechHub?</h2>
      <div className="columna">
        <div className="lista">
          <ul>
            <li>
              <strong>Agendamiento:</strong> Reserva citas académicas de forma sencilla y organizada.
            </li>
            <li>
              <strong>Tutorías entre pares:</strong> Apoyo brindado por estudiantes de niveles superiores.
            </li>
            <li>
              <strong>Gestión de horarios:</strong> Disponibilidad clara y horarios accesibles para todos.
            </li>
            <li>
              <strong>Seguimiento:</strong> Registro detallado para mejorar el acompañamiento estudiantil.
            </li>
          </ul>
        </div>

        <div className="logo">
          <img src={logo} alt="Sede UPS" className="login-logo" />
        </div>
      </div>

      <h2>¿Por qué elegir TechHub?</h2>
      <div className="features-list">
        <div className="feature-item">Fomenta el aprendizaje colaborativo.</div>
        <div className="feature-item">Refuerza valores salesianos de solidaridad.</div>
        <div className="feature-item">Mejora el rendimiento en niveles iniciales.</div>
        <div className="feature-item">Incentiva el liderazgo en tutores.</div>
      </div>

      <div className="footer-info">
        <h2>Dirigido a</h2>
        <p>
          Estudiantes de la carrera de Computación que requieran apoyo académico
          o deseen contribuir con su conocimiento como tutores.
        </p>

        <h2>Contáctanos</h2>
        <p>
          Para más información, comunícate con la coordinación de la carrera o con los 
          responsables del proyecto <strong>TechHub</strong>.
        </p>
      </div>
    </div>
  );
};

export default Home;