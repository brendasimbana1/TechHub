from app import create_app
app = create_app()

if __name__ == "__main__":
    # debug=True: Permite ver errores detallados y reinicia el servidor al guardar cambios.
    # port=5000: Asegura que coincida con tu apiService.js del frontend.
    # host="0.0.0.0": Opcional, permite acceder desde otros dispositivos en tu red local.
    #                 Para mayor seguridad en desarrollo local, usa "127.0.0.1".
    
    app.run(debug=True, port=5000)