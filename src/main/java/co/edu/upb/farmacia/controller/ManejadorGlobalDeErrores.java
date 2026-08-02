package co.edu.upb.farmacia.controller;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Traduce las excepciones de validacion del servicio en respuestas HTTP 400,
 * en lugar de dejar que se propaguen como un error 500.
 */
@RestControllerAdvice
public class ManejadorGlobalDeErrores {

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> manejarValidacion(IllegalArgumentException ex) {
		Map<String, Object> cuerpo = new LinkedHashMap<>();
		cuerpo.put("timestamp", LocalDateTime.now());
		cuerpo.put("status", HttpStatus.BAD_REQUEST.value());
		cuerpo.put("error", "Bad Request");
		cuerpo.put("message", ex.getMessage());
		return ResponseEntity.badRequest().body(cuerpo);
	}

}
