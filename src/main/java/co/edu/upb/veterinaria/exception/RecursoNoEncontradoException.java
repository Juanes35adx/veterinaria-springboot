package co.edu.upb.veterinaria.exception;

/**
 * Se lanza cuando se pide, actualiza o elimina un recurso por id
 * y ese id no existe en la base de datos.
 */
public class RecursoNoEncontradoException extends RuntimeException {

	public RecursoNoEncontradoException(String mensaje) {
		super(mensaje);
	}

}
