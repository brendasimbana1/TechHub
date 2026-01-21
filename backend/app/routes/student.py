from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import mongo
from bson import ObjectId
from app.utils.logger import registrar_log
from datetime import datetime
import logging

logger = logging.getLogger("TechHub_Student")
student_bp = Blueprint('student', __name__)

@student_bp.route('/request-tutor', methods=['POST'])
@jwt_required()
def create_request():
    """Permite a un estudiante solicitar una tutoría"""
    estudiante_id = get_jwt_identity()
    claims = get_jwt()
    
    if claims.get('rol') != 'estudiante':
        return jsonify({"error": "Solo los estudiantes pueden solicitar tutorías"}), 403

    data = request.get_json()
    
    required_fields = ['tutor_id', 'materia', 'fecha', 'hora']
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Faltan datos obligatorios para la solicitud"}), 400

    try:
        estudiante_user = mongo.db.users.find_one({"_id": ObjectId(estudiante_id)})
        if not estudiante_user:
            return jsonify({"error": "Estudiante no encontrado"}), 404

        cita_existente = mongo.db.solicitudes.find_one({
                    "tutor_id": data['tutor_id'],
                    "fecha": data['fecha'], 
                    "hora": data['hora'],  
                    "estado": {"$in": ["pendiente", "aceptada"]} 
                })

        if cita_existente:
            return jsonify({
                "error": "Lo sentimos, este horario acaba de ser ocupado por otro estudiante."
            }), 409

        nueva_solicitud = {
            "estudiante_id": estudiante_id,
            "estudiante_nombre": estudiante_user.get('nombre'),
            "tutor_id": data['tutor_id'],
            "materia": data['materia'],
            "fecha": data['fecha'],
            "hora": data['hora'],
            "mensaje": data.get('mensaje', ""), 
            "estado": "pendiente",
            "creado_en": datetime.utcnow()
        }

        result = mongo.db.solicitudes.insert_one(nueva_solicitud)

        registrar_log(
            email=estudiante_user['email'],
            rol="estudiante",
            accion="SOLICITAR_TUTORIA",
            detalle=f"Solicitó tutoría de {data['materia']} para el {data['fecha']}",
            ip_address=request.remote_addr
        )

        logger.info(f"Solicitud creada exitosamente por: {estudiante_user['email']}")
        
        return jsonify({
            "message": "Solicitud enviada con éxito",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        logger.error(f"Error al crear solicitud: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500
    
@student_bp.route('/tutors', methods=['GET'])
@jwt_required()
def get_tutors_by_materia():
    materia = request.args.get('materia')
    try:
        cursor = mongo.db.users.find({
            "rol": "tutor",
            "materias": materia
        })
        
        output = []
        for tutor in cursor:
            tutor_id = str(tutor["_id"])
            all_disponibilidad = tutor.get("disponibilidad", [])
            
            citas_ocupadas = mongo.db.solicitudes.find({
                "tutor_id": tutor_id,
                "estado": {"$in": ["pendiente", "aceptada"]} 
            })

            horarios_ocupados = set()
            for cita in citas_ocupadas:
                key = f"{cita['fecha']}_{cita['hora']}" 
                horarios_ocupados.add(key)

            disponibilidad_real = []
            for slot in all_disponibilidad:
                slot_key = f"{slot['dia']}_{slot['horaInicio']} - {slot['horaFin']}"
                if slot_key not in horarios_ocupados:
                    disponibilidad_real.append(slot)

            if disponibilidad_real:
                output.append({
                    "id": tutor_id,
                    "nombre": tutor["nombre"],
                    "semestre": tutor.get("semestre"),
                    "disponibilidad": disponibilidad_real
                })
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@student_bp.route('/my-requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    """Obtiene el historial de tutorías del estudiante autenticado"""
    estudiante_id = get_jwt_identity()
    
    try:
        cursor = mongo.db.solicitudes.find({"estudiante_id": str(estudiante_id)}).sort("creado_en", -1)
        
        mis_citas = []
        for doc in cursor:
            mis_citas.append({
                "id": str(doc["_id"]),
                "materia": doc.get("materia"),
                "fecha": doc.get("fecha"),
                "hora": doc.get("hora"),
                "estado": doc.get("estado", "pendiente"),
                "mensaje": doc.get("mensaje", "Sin temas especificados"),
                "creado_en": doc.get("creado_en")
            })

        estudiante_user = mongo.db.users.find_one({"_id": ObjectId(estudiante_id)}, {"email": 1})
        email_log = estudiante_user['email'] if estudiante_user else "Estudiante Desconocido"

        registrar_log(
            email=email_log,
            rol="estudiante",
            accion="CONSULTAR_MIS_CITAS",
            detalle="El estudiante consultó su historial de solicitudes de tutoría",
            ip_address=request.remote_addr
        )

        return jsonify(mis_citas), 200

    except Exception as e:
        logger.error(f"Error al obtener citas del estudiante: {e}")
        return jsonify({"error": "Error al cargar el historial de tutorías"}), 500
    
@student_bp.route('/requests/<request_id>', methods=['DELETE'])
@jwt_required()
def cancel_request(request_id):
    """Permite al estudiante cancelar una solicitud de tutoría pendiente"""
    estudiante_id = get_jwt_identity()
    
    try:
        solicitud = mongo.db.solicitudes.find_one({
            "_id": ObjectId(request_id),
            "estudiante_id": str(estudiante_id)
        })

        if not solicitud:
            return jsonify({"error": "No se encontró la tutoría o no tienes permiso para cancelarla"}), 404
        
        if solicitud.get("estado") != "pendiente":
            return jsonify({"error": "No es posible cancelar una tutoría que ya ha sido marcada como completada"}), 400

        mongo.db.solicitudes.delete_one({"_id": ObjectId(request_id)})

        estudiante_user = mongo.db.users.find_one({"_id": ObjectId(estudiante_id)}, {"email": 1})
        email_log = estudiante_user['email'] if estudiante_user else "Estudiante"

        registrar_log(
            email=email_log,
            rol="estudiante",
            accion="CANCELAR_TUTORIA",
            detalle=f"Canceló la tutoría de {solicitud.get('materia')} programada para el {solicitud.get('fecha')}",
            ip_address=request.remote_addr
        )

        logger.info(f"Tutoría {request_id} cancelada por {email_log}")
        
        return jsonify({"message": "Tutoría cancelada correctamente"}), 200

    except Exception as e:
        logger.error(f"Error al cancelar solicitud: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500