# TechHub - Plataforma de Gestión de Tutorías Académicas

## Descripción General
TechHub es una solución integral diseñada para formalizar y centralizar el proceso de tutorías académicas dentro del ámbito universitario. La plataforma permite la interacción eficiente entre estudiantes que requieren refuerzo académico y estudiantes de niveles superiores que actúan como tutores, garantizando que el flujo de información sea transparente, organizado y auditable.

El sistema se enfoca en la optimización de tiempos y en la creación de un registro histórico fidedigno de las actividades de apoyo estudiantil, facilitando el seguimiento tanto para los participantes como para las autoridades académicas.


## Arquitectura de la Solución
La aplicación se basa en una arquitectura de software moderna y escalable que separa la lógica de presentación de la lógica de negocio.

* **Interfaz de Usuario (Frontend):** Entorno desarrollado en React utilizando Vite para ofrecer una experiencia reactiva y fluida. El diseño se gestiona mediante CSS modular enfocado en la usabilidad.
* **Servicios de Aplicación (Backend):** Una interfaz de programación de aplicaciones (API) construida con Flask (Python) que gestiona las reglas de negocio, la validación de usuarios y el procesamiento de solicitudes.
* **Capa de Persistencia (Base de Datos):** Almacenamiento no relacional basado en MongoDB, que permite gestionar de forma flexible los perfiles de usuario, las agendas de tutoría y los registros de auditoría.


## Roles y Funcionalidades del Sistema

### Gestión Administrativa
El nivel administrativo se encarga de la supervisión global de la plataforma. Sus funciones incluyen:
* Supervisión de usuarios y asignación de privilegios.
* Acceso a bitácoras de actividad detalladas para fines de control y seguridad.
* Monitoreo de la trazabilidad de todas las acciones críticas realizadas en el sistema (Logins, actualizaciones, cierres de sesión).

### Gestión de Tutoría (Rol Tutor)
Los tutores son los encargados de brindar el apoyo académico y gestionar su propia agenda:
* Definición de bloques horarios de disponibilidad técnica.
* Revisión de temas y requerimientos específicos solicitados por los estudiantes para la preparación de sesiones.
* Validación y cierre de sesiones académicas para la actualización automática del historial.

### Consulta y Reserva (Rol Estudiante)
Los estudiantes pueden gestionar su aprendizaje mediante las siguientes herramientas:
* Búsqueda de asistencia técnica segmentada por asignatura.
* Reserva de turnos en tiempo real basados en la disponibilidad confirmada por los tutores.
* Gestión de historial personal de tutorías solicitadas y seguimiento de estados en tiempo real.

## Instalación y Configuración

Siga estos pasos para poner en marcha el entorno de desarrollo local.

### 1. Requisitos Previos
* Python 3.9 o superior.
* Node.js (versión LTS recomendada).
* MongoDB (instancia local o conexión a MongoDB Atlas).

### 2. Configuración del Backend
Acceda al directorio del servidor y configure el entorno virtual:
```bash
cd backend
python -m venv venv
```
# En Windows:
```
venv\Scripts\activate
```
# En Linux/Mac:
```
source venv/bin/activate
pip install -r requirements.txt
```
# Inicie el servidor Flask:
```Bash
python run.py
```
### 3. Configuración del Frontend
Acceda al directorio del cliente e instale las dependencias de Node:
```Bash
cd frontend
npm install
```
Inicie el servidor de desarrollo de Vite:
```Bash
npm run dev
```
## Tecnologías Utilizadas
* **Frontend:** React, React Router, CSS3.
* **Backend:** Python, Flask, Flask-JWT-Extended, Flask-CORS.
* **Base de Datos:** MongoDB (PyMongo).
* **Herramientas:** Vite, Node.js.
