from datetime import datetime, timezone
from app.extensions import mongo

def registrar_log(email, rol, accion, detalle, ip_address=None):
    """
    Guarda un evento en la colección 'logs' para auditoría SGSI.
    """
    try:
        log_entry = {
            "fecha": datetime.now(timezone.utc),
            "usuario": email,
            "rol": rol,
            "accion": accion,
            "detalle": detalle,
            "ip": ip_address or "N/A"
        }
        mongo.db.logs.insert_one(log_entry)
        print(f"[Evento] {accion}: {email}")
    except Exception as e:
        print(f"Error guardando log de auditoría: {e}")