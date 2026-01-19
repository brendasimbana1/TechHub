import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "../css/Solicitudes.css";

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const fetchSolicitudes = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/tutor/requests", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setSolicitudes(data);
            } else {
                toast.error("No se pudieron cargar las solicitudes");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Cargando solicitudes...</div>;

    return (
        <div className="solicitudes-container">
            <div className="solicitudes-box">
                <div className="header-section">
                    <h1>Solicitudes de Tutoría</h1>
                    <p className="subtitle">Gestión de sesiones académicas asignadas por los estudiantes.</p>
                </div>

                {solicitudes.length === 0 ? (
                    <div className="empty-state-container">
                        <div className="empty-state-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2>Bandeja de entrada vacía</h2>
                        <p>No tienes solicitudes de tutoría pendientes en este momento.</p>
                        <button className="refresh-btn" onClick={fetchSolicitudes}>Actualizar ahora</button>
                    </div>
                ) : (
                    <div className="requests-list">
                        {solicitudes.map((sol) => (
                            <div key={sol.id} className="request-card">
                                <div className="card-status-bar"></div>
                                <div className="card-content">
                                    <div className="card-header">
                                        <h3>{sol.materia}</h3>
                                        <span className={`status-pill ${sol.estado}`}>
                                            {sol.estado.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="card-body">
                                        <p><strong>Estudiante:</strong> {sol.estudiante}</p>
                                        <div className="info-row">
                                            <span><i className="calendar-icon">📅</i> {sol.fecha}</span>
                                            <span><i className="clock-icon">⏰</i> {sol.hora}</span>
                                        </div>
                                        {sol.mensaje && (
                                            <p className="request-note">"{sol.mensaje}"</p>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        <button
                                            className="action-btn"
                                            onClick={() => toast.success("Sesión marcada como completada")}
                                        >
                                            Marcar como Dictada
                                        </button>
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

export default Solicitudes;