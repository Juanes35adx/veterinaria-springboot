package co.edu.upb.veterinaria.service;

/**
 * Se lanza cuando el usuario o la contraseña de inicio de sesion no son correctos.
 * Se traduce a un HTTP 401 en ManejadorGlobalDeErrores.
 */
public class CredencialesInvalidasException extends RuntimeException {

	public CredencialesInvalidasException(String mensaje) {
		super(mensaje);
	}

}
