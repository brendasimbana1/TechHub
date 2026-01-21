import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import "../css/MisCitas.css";
import { fetchAuthorized } from '../services/api';

const MisCitas = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerCitas();
    }, []);

    const obtenerCitas = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetchAuthorized("http://localhost:5000/api/student/my-requests", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res || res.sessionExpired) return;
            const data = await res.json();
            if (res.ok) {
                setCitas(data);
            }
        } catch (error) {
            toast.error("Error al cargar tus tutorías");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (citaId) => {
        if (!window.confirm("¿Estás seguro de que deseas cancelar esta tutoría?")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/student/requests/${citaId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("Tutoría cancelada correctamente");
                setCitas(citas.filter(cita => cita.id !== citaId));
            } else {
                toast.error("No se pudo cancelar la tutoría");
            }
        } catch (error) {
            toast.error("Error de conexión");
        }
    };

    if (loading) return <div className="loading-screen">Cargando tus tutorías...</div>;

    return (
        <div className="mis-citas-container">
            <div className="mis-citas-box">
                <div className="header-section">
                    <h1>Mis Tutorías</h1>
                    <p className="subtitle">Consulta el estado y los detalles de tus solicitudes académicas.</p>
                </div>

                {citas.length === 0 ? (
                    <div className="empty-state-container">
                        <div className="empty-state-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2>No tienes citas programadas</h2>
                        <p>Cuando solicites una tutoría, aparecerá en este listado.</p>
                    </div>
                ) : (
                    <div className="citas-grid">
                        {citas.map((cita) => (
                            <div key={cita.id} className="cita-card">
                                <div className={`card-status-bar ${cita.estado}`}></div>
                                <div className="card-content">
                                    <div className="card-header">
                                        <h3>{cita.materia}</h3>
                                        <span className={`status-pill ${cita.estado}`}>
                                            {cita.estado.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="card-body">
                                        <div className="info-row">
                                            <span className="info-item">
                                                <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                {cita.fecha}
                                            </span>
                                            <span className="info-item">
                                                <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                {cita.hora}
                                            </span>
                                        </div>
                                        <p className="temas-text"><strong>Temas:</strong> {cita.mensaje}</p>
                                    </div>

                                    <div className="card-footer">
                                        {cita.estado === "pendiente" ? (
                                            <button 
                                                className="cancel-btn" 
                                                onClick={() => handleCancelar(cita.id)}
                                            >
                                                Cancelar Solicitud
                                            </button>
                                        ) : (
                                            <div className="status-label">
                                                {cita.estado === "completada" ? "Tutoría dictada exitosamente" : "Esta cita ya no está activa"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisCitas;