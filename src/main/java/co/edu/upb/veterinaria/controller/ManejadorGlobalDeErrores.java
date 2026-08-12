package co.edu.upb.veterinaria.controller;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Traduce las excepciones de validacion y de "no encontrado" del servicio
 * en respuestas HTTP 400/404, en lugar de dejar que se propaguen como un
 * error 500.
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

	private ResponseEntity<Map<String, Object>> construirRespuesta(HttpStatus status, String mensaje) {
		Map<String, Object> cuerpo = new LinkedHashMap<>();
		cuerpo.put("timestamp", LocalDateTime.now());
		cuerpo.put("status", status.value());
		cuerpo.put("error", status.getReasonPhrase());
		cuerpo.put("message", mensaje);
		return ResponseEntity.status(status).body(cuerpo);
	}

}
