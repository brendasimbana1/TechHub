from app.extensions import mongo, bcrypt
from datetime import datetime, timezone
from bson import ObjectId


class User:
    def __init__(self, email, password, nombre, rol="estudiante", **kwargs):
        self.email = email
        self.password = password
        self.nombre = nombre
        self.rol = rol
        
        self.semestre = kwargs.get('semestre')
        self.materias = kwargs.get('materias', [])
        self.disponibilidad = kwargs.get('disponibilidad', [])
        
        # Campos de Auditoría (SGSI)
        self.created_at = datetime.now(timezone.utc)
        self.last_login = None
        self.is_active = True  

    def save(self):
        """Guarda el usuario en la BD con la contraseña hasheada"""
        usuario_existente = mongo.db.users.find_one({"email": self.email})
        if usuario_existente:
            return {"error": "El correo ya está registrado"}, 400

        pw_hash = bcrypt.generate_password_hash(self.password).decode('utf-8')

        user_data = {
            "nombre": self.nombre,
            "email": self.email,
            "password": pw_hash,
            "rol": self.rol,
            "created_at": self.created_at,
            "last_login": self.last_login,
            "is_active": self.is_active
        }

        if self.rol == "estudiante":
            if not self.semestre:
                return {"error": "El semestre es obligatorio para estudiantes"}, 400
            user_data["semestre"] = int(self.semestre)
        elif self.rol == "tutor":
            if not self.semestre:
                return {"error": "El semestre es obligatorio para tutores"}, 400
            user_data["semestre"] = int(self.semestre)
            user_data["materias"] = self.materias
            user_data["disponibilidad"] = self.disponibilidad
        elif self.rol == "admin":
            pass

        result = mongo.db.users.insert_one(user_data)
        return {"id": str(result.inserted_id), "message": "Usuario creado"}, 201

    @staticmethod
    def login(email, password_candidato):
        """Verifica credenciales y actualiza last_login"""
        user_data = mongo.db.users.find_one({"email": email, "is_active": True})
        
        if user_data and bcrypt.check_password_hash(user_data['password'], password_candidato):
            mongo.db.users.update_one(
                {"_id": user_data["_id"]},
                {"$set": {"last_login": datetime.now(timezone.utc)}}
            )
            return user_data
        return None

    @staticmethod
    def get_by_id(user_id):
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def editar_materia(user_id, materia_nombre):
        """Soporta endpoint /register-materia"""
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id), "rol": "tutor"},
            {"$addToSet": {"materias": materia_nombre}} 
        )

    @staticmethod
    def editar_horario(user_id, horario_data):
        """Soporta endpoint /register-horario"""
        # horario_data ejemplo: {"dia": "Lunes", "hora_inicio": "14:00", "hora_fin": "16:00"}
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id), "rol": "tutor"},
            {"$push": {"disponibilidad": horario_data}}
        )