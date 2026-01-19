from flask import Blueprint, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from bson.objectid import ObjectId

from app.models.user import User
from app.utils.logger import registrar_log

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    rol = "estudiante"
    
    nuevo_usuario = User(
        email=data['email'],
        password=data['password'],
        nombre=data['nombre'],
        rol=rol,
        semestre=data.get('semestre')
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
            additional_claims={
                "rol": usuario_encontrado['rol'],
                "nombre": usuario_encontrado['nombre']
            }
        )

        registrar_log(
            email=email,
            rol=usuario_encontrado['rol'],
            accion="LOGIN_EXITOSO",
            detalle=f"Usuario {usuario_encontrado['nombre']} inició sesión correctamente.",
            ip_address=request.remote_addr
        )

        return jsonify({
            "message": "Login exitoso",
            "token": token,
            "rol": usuario_encontrado['rol'],
            "nombre": usuario_encontrado['nombre'],
            "id": str(usuario_encontrado['_id'])
        }), 200
    
    registrar_log(
        email=email if email else "Anónimo",
        rol="desconocido",
        accion="LOGIN_FALLIDO",
        detalle="Intento de acceso con credenciales incorrectas o inexistentes.",
        ip_address=request.remote_addr
    )
    return jsonify({"error": "Correo o contraseña incorrectos"}), 401