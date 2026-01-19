from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import mongo
from bson import ObjectId
from app.utils.logger import registrar_log
import logging

logger = logging.getLogger("TechHub_Tutor")
tutor_bp = Blueprint('tutor', __name__)

@tutor_bp.route('/availability', methods=['GET'])
@jwt_required()
def get_availability():
    """Recupera la disponibilidad del tutor actual"""
    user_id = get_jwt_identity()
    
    try:
        user = mongo.db.users.find_one(
            {"_id": ObjectId(user_id)}, 
            {"disponibilidad": 1, "_id": 0}
        )
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
            
        return jsonify(user.get("disponibilidad", [])), 200
        
    except Exception as e:
        logger.error(f"Error al obtener disponibilidad: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

@tutor_bp.route('/availability', methods=['POST'])
@jwt_required()
def set_availability():
    """Guarda o actualiza la lista completa de horarios del tutor"""
    user_id = get_jwt_identity()
    nuevos_horarios = request.get_json()

    if not isinstance(nuevos_horarios, list):
        return jsonify({"error": "Formato de datos incorrecto"}), 400

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"disponibilidad": nuevos_horarios}}
        )

        if result.matched_count > 0:
            try:
                tutor_user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
                tutor_email = tutor_user['email'] if tutor_user else "Tutor Desconocido"

                registrar_log(
                    email=tutor_email,
                    rol="tutor",
                    accion="ACTUALIZAR_DISPONIBILIDAD",
                    detalle=f"El tutor actualizó su horario. Total de bloques: {len(nuevos_horarios)}",
                    ip_address=request.remote_addr
                )
                logger.info(f"Disponibilidad actualizada y logeada para: {tutor_email}")
            except Exception as log_err:
                logger.error(f"Error no crítico en log de tutor: {log_err}")
            return jsonify({"message": "Disponibilidad actualizada correctamente"}), 200

        return jsonify({"error": "No se pudo encontrar al usuario para actualizar"}), 404

    except Exception as e:
        logger.error(f"Error al guardar disponibilidad: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

@tutor_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_tutor_requests():
    """Obtiene las tutorías que los estudiantes han pedido a este tutor"""
    tutor_id = get_jwt_identity()
    
    try:
        tutor_info = mongo.db.users.find_one({"_id": ObjectId(tutor_id)}, {"email": 1})
        tutor_email = tutor_info.get('email', 'Correo no encontrado') if tutor_info else "Tutor no encontrado"
        cursor = mongo.db.solicitudes.find({"tutor_id": str(tutor_id)}).sort("creado_en", -1)
        
        solicitudes = []
        for doc in cursor:
            solicitudes.append({
                "id": str(doc["_id"]),
                "estudiante": doc.get("estudiante_nombre", "Estudiante"),
                "materia": doc.get("materia"),
                "fecha": doc.get("fecha"), 
                "hora": doc.get("hora"), 
                "estado": doc.get("estado", "pendiente"),
                "mensaje": doc.get("mensaje", "")
            })

        registrar_log(
            email=tutor_email,
            rol="tutor",
            accion="CONSULTAR_SOLICITUDES",
            detalle="El tutor revisó su bandeja de tutorías asignadas.",
            ip_address=request.remote_addr
        )

        return jsonify(solicitudes), 200
    except Exception as e:
        logger.error(f"Error al obtener solicitudes: {e}")
        return jsonify({"error": "No se pudieron cargar las solicitudes"}), 500
    
@tutor_bp.route('/requests/<request_id>/complete', methods=['PATCH'])
@jwt_required()
def complete_request(request_id):
    """Actualiza el estado de una tutoría a 'completada'"""
    tutor_id = get_jwt_identity()
    
    try:
        solicitud = mongo.db.solicitudes.find_one({
            "_id": ObjectId(request_id), 
            "tutor_id": str(tutor_id)
        })
        
        if not solicitud:
            return jsonify({"error": "Solicitud no encontrada o acceso denegado"}), 404

        mongo.db.solicitudes.update_one(
            {"_id": ObjectId(request_id)},
            {"$set": {"estado": "completada"}}
        )

        tutor_info = mongo.db.users.find_one({"_id": ObjectId(tutor_id)}, {"email": 1})
        tutor_email = tutor_info.get('email', 'Tutor') if tutor_info else "Tutor"

        registrar_log(
            email=tutor_email,
            rol="tutor",
            accion="FINALIZAR_TUTORIA",
            detalle=f"Finalizó la tutoría de {solicitud.get('materia')} con el estudiante {solicitud.get('estudiante_nombre')}",
            ip_address=request.remote_addr
        )

        return jsonify({"message": "Tutoría finalizada con éxito"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500    