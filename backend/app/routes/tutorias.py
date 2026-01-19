from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import mongo
from datetime import datetime

citas_bp = Blueprint('citas', __name__)

@citas_bp.route('/agendar', methods=['POST'])
@jwt_required()
def agendar_cita():
    claims = get_jwt()
    usuario_id = get_jwt_identity()
    if claims['rol'] != 'estudiante':
        return jsonify({"error": "Solo estudiantes pueden solicitar tutorías"}), 403

    datos = request.json
    nueva_cita = {
        "estudiante_id": usuario_id,
        "tutor_id": datos['tutor_id'],
        "materia": datos['materia'],
        "fecha": datos['fecha'], # Formato ISO
        "estado": "pendiente",
        "creado_en": datetime.utcnow() # Importante para logs de auditoría
    }

    mongo.db.citas.insert_one(nueva_cita)
    return jsonify({"mensaje": "Cita solicitada correctamente"}), 201

@citas_bp.route('/mis-citas', methods=['GET'])
@jwt_required()
def ver_citas():
    usuario_id = get_jwt_identity()
    # Busca citas donde el usuario sea estudiante O tutor
    citas = mongo.db.citas.find({
        "$or": [{"estudiante_id": usuario_id}, {"tutor_id": usuario_id}]
    })
    
    # Convertir ObjectId a string para JSON
    resultado = []
    for cita in citas:
        cita['_id'] = str(cita['_id'])
        resultado.append(cita)
        
    return jsonify(resultado), 200