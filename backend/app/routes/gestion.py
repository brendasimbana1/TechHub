from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import mongo

from app.models.user import User

gestion_bp = Blueprint('gestion', __name__)

@gestion_bp.route('/register-materia', methods=['POST'])
@jwt_required()
def register_materia():
    user_id = get_jwt_identity() 
    data = request.json
    
    User.agregar_materia(user_id, data['materia'])
    
    return jsonify({"mensaje": "Materia agregada al perfil del tutor"}), 200

@gestion_bp.route('/register-horario', methods=['POST'])
@jwt_required()
def register_horario():
    user_id = get_jwt_identity()
    data = request.json # { "dia": "Lunes", "hora": "10:00" }
    
    User.agregar_horario(user_id, data)
    
    return jsonify({"mensaje": "Horario disponible agregado"}), 200 

@gestion_bp.route('/get-tutores/<materia>', methods=['GET'])
def get_tutores(materia):
    tutores = mongo.db.users.find(
        {
            "rol": "tutor", 
            "materias": materia,
            "is_active": True 
        },
        {"password": 0, "email": 0}
    )
    
    lista_tutores = []
    for tutor in tutores:
        tutor['_id'] = str(tutor['_id'])
        lista_tutores.append(tutor)
        
    return jsonify(lista_tutores), 200