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
            output.append({
                "id": str(tutor["_id"]),
                "nombre": tutor["nombre"],
                "semestre": tutor.get("semestre"),
                "disponibilidad": tutor.get("disponibilidad", [])
            })
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500