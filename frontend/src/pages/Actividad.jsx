import React, { useState, useEffect } from "react";
import { Toaster, toast } from 'react-hot-toast';
import "../css/Actividad.css";
import { fetchAuthorized } from '../services/api';


const Actividad = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('es-EC', options);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetchAuthorized('http://localhost:5000/api/admin/logs', {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if(!response || response.sessionExpired ) return;
        if (response.ok) {
          const data = await response.json();
          setLogs(data); 
        } else {
          toast.error("Error al cargar la bitácora");
        }
      } catch (error) {
        console.error("Error cargando logs:", error);
        toast.error("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="actividad-container">
      <div className="actividad-card">
        <header className="actividad-header">
          <h1>Bitácora de Actividad</h1>
          <p>Registro histórico de eventos y seguridad del sistema.</p>
        </header>

        {loading ? (
          <div className="loading-state">Cargando registros...</div>
        ) : (
          <div className="table-responsive">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log._id}>
                      <td className="col-fecha">{formatDate(log.fecha)}</td>
                      <td className="col-user">{log.usuario}</td>
                      <td>
                        <span className={`badge badge-${log.rol}`}>
                          {log.rol}
                        </span>
                      </td>
                      <td className="col-accion">
                        <span style={{ 
                          color: log.accion.includes('FALLIDO') ? '#c62828' : '#2e7d32',
                          fontWeight: 'bold'
                        }}>
                          {log.accion}
                        </span>
                      </td>
                      <td className="col-detalle">{log.detalle}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">No hay actividad registrada aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actividad;