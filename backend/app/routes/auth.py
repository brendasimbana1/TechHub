from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from bson.objectid import ObjectId

from app.models.user import User

auth_bp = Blueprint('auth', __name__)
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    semestre = int(data.get('semestre', 1))
    rol = "tutor" if semestre > 6 else "estudiante"
    
    nuevo_usuario = User(
        email=data['email'],
        password=data['password'],
        nombre=data['nombre'],
        semestre=semestre,
        rol=rol
    )
    
    respuesta, status = nuevo_usuario.save()
    return jsonify(respuesta), status

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Faltan credenciales"}), 400

    usuario_encontrado = User.login(email, password)

    if usuario_encontrado:
        token = create_access_token(
            identity=str(usuario_encontrado['_id']), 
            additional_claims={"rol": usuario_encontrado['rol']}
        )
        
        return jsonify({
            "message": "Login exitoso",
            "token": token,
            "rol": usuario_encontrado['rol'],
            "nombre": usuario_encontrado['nombre']
        }), 200
    
    return jsonify({"error": "Correo o contraseña incorrectos"}), 401