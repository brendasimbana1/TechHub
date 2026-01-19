from flask import Blueprint, request, jsonify
import logging
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from bson import ObjectId
from app.extensions import mongo, bcrypt
from app.utils.logger import registrar_log

from app.models.user import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TechHub_Admin")
admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/create-tutor', methods=['POST'])
@jwt_required()
def create_tutor():
    claims = get_jwt()
    if claims.get('rol') != 'admin':
        return jsonify({"error": "Acceso denegado. Se requieren permisos de administrador."}), 403

    data = request.get_json()
    
    if not data.get('email') or not data.get('password') or not data.get('semestre'):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    try:
        nuevo_tutor = User(
            email=data['email'],
            password=data['password'],
            nombre=data['nombre'],
            rol="tutor",
            semestre=data['semestre'],
            materias=data.get('materias', [])
        )

        respuesta, status = nuevo_tutor.save()
        
        if status == 201: 
            try:
                admin_id = get_jwt_identity()

                admin_user = mongo.db.users.find_one({"_id": ObjectId(admin_id)})
                admin_email = admin_user['email'] if admin_user else "Admin ID: " + str(admin_id)

                registrar_log(
                    email=admin_email,
                    rol="admin",
                    accion="CREAR_TUTOR",
                    detalle=f"Se registró al tutor: {data['email']}",
                    ip_address=request.remote_addr
                )
                logger.info(f"Log de auditoría guardado para: {admin_email}")
            except Exception as log_error:
                logger.error(f"ERROR EN AUDITORÍA: {log_error}")
        return jsonify(respuesta), status
    except Exception as e:
        print(f"Error creando tutor: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500
    
@admin_bp.route('/materias', methods=['GET'])
@jwt_required()
def get_materias():
    try:
        cursor = mongo.db.materias.find()
        lista_materias = [doc['nombre'] for doc in cursor]
        
        return jsonify(lista_materias), 200
    except Exception as e:
        return jsonify({"error": "Error al cargar materias"}), 500
    
@admin_bp.route('/logs', methods=['GET'])
@jwt_required()
def get_logs():
    try:
        cursor = mongo.db.logs.find().sort("fecha", -1).limit(100)
        
        logs = []
        for doc in cursor:
            logs.append({
                "_id": str(doc["_id"]),
                "fecha": doc["fecha"].isoformat(), 
                "usuario": doc["usuario"],
                "rol": doc["rol"],
                "accion": doc["accion"],
                "detalle": doc["detalle"]
            })
            
        return jsonify(logs), 200
    except Exception as e:
        return jsonify({"error": "No se pudo recuperar el historial"}), 500