package co.edu.upb.veterinaria.security;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

/**
 * Responde 401 cuando la peticion llega SIN token (o con uno invalido).
 *
 * Sin esto, Spring Security devolveria 403 en ambos casos, y el cliente no
 * podria distinguir "no iniciaste sesion" (401) de "iniciaste sesion pero tu
 * rol no tiene permiso" (403).
 */
@Component
public class ManejadorNoAutenticado implements AuthenticationEntryPoint {

	private final ObjectMapper objectMapper;

	public ManejadorNoAutenticado(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
						 AuthenticationException authException) throws IOException {

		Map<String, Object> cuerpo = new LinkedHashMap<>();
		cuerpo.put("timestamp", LocalDateTime.now().toString());
		cuerpo.put("status", HttpStatus.UNAUTHORIZED.value());
		cuerpo.put("error", "Unauthorized");
		cuerpo.put("message", "Debe iniciar sesion en /api/auth/login y enviar el token en la cabecera Authorization.");

		response.setStatus(HttpStatus.UNAUTHORIZED.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().write(objectMapper.writeValueAsString(cuerpo));
	}

}
