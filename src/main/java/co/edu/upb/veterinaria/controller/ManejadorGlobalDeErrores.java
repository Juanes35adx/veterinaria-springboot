package co.edu.upb.veterinaria.controller;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.service.CredencialesInvalidasException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Traduce las excepciones del servicio en respuestas HTTP con significado
 * (400, 401, 403, 404), en lugar de dejar que se propaguen como un error 500.
 */
@RestControllerAdvice
public class ManejadorGlobalDeErrores {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> manejarValidacion(IllegalArgumentException ex) {
		return construirRespuesta(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(RecursoNoEncontradoException.class)
	public ResponseEntity<Map<String, Object>> manejarNoEncontrado(RecursoNoEncontradoException ex) {
		return construirRespuesta(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	/** Usuario o contraseña incorrectos al iniciar sesion. */
	@ExceptionHandler(CredencialesInvalidasException.class)
	public ResponseEntity<Map<String, Object>> manejarCredenciales(CredencialesInvalidasException ex) {
		return construirRespuesta(HttpStatus.UNAUTHORIZED, ex.getMessage());
	}

	/** Autenticado, pero su rol no tiene permiso sobre esa ruta. */
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, Object>> manejarAccesoDenegado(AccessDeniedException ex) {
		return construirRespuesta(HttpStatus.FORBIDDEN, "No tiene permisos para realizar esta accion.");
	}

	private ResponseEntity<Map<String, Object>> construirRespuesta(HttpStatus status, String mensaje) {
		Map<String, Object> cuerpo = new LinkedHashMap<>();
		cuerpo.put("timestamp", LocalDateTime.now());
		cuerpo.put("status", status.value());
		cuerpo.put("error", status.getReasonPhrase());
		cuerpo.put("message", mensaje);
		return ResponseEntity.status(status).body(cuerpo);
	}

}
