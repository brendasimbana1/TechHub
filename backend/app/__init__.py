from flask import Flask, app
from app.config import Config
from app.extensions import mongo, jwt, bcrypt, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    mongo.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, supports_credentials=True, origins=["http://localhost:5173"])

    from app.routes.auth import auth_bp
    from app.routes.tutorias import citas_bp
    from app.routes.admin import admin_bp
    from app.routes.tutor import tutor_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(citas_bp, url_prefix='/api/tutorias')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(tutor_bp, url_prefix='/api/tutor')

    return app