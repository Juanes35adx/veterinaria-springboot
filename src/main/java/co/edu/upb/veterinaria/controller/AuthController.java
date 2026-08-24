package co.edu.upb.veterinaria.controller;

import co.edu.upb.veterinaria.controller.dto.LoginRequest;
import co.edu.upb.veterinaria.controller.dto.LoginResponse;
import co.edu.upb.veterinaria.model.Usuario;
import co.edu.upb.veterinaria.security.JwtService;
import co.edu.upb.veterinaria.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Unica ruta publica de la API: permite obtener un token JWT.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final UsuarioService usuarioService;
	private final JwtService jwtService;

	public AuthController(UsuarioService usuarioService, JwtService jwtService) {
		this.usuarioService = usuarioService;
		this.jwtService = jwtService;
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest peticion) {
		Usuario usuario = usuarioService.autenticar(peticion.username(), peticion.password());
		String token = jwtService.generarToken(usuario);

		return ResponseEntity.ok(new LoginResponse(
				token,
				usuario.getUsername(),
				usuario.getRol().name(),
				usuario.getNombreCompleto(),
				jwtService.getExpiracionMillis()));
	}

}
