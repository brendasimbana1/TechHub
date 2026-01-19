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