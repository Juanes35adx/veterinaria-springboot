package co.edu.upb.veterinaria.security;

import java.util.Date;
import javax.crypto.SecretKey;

import co.edu.upb.veterinaria.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Genera y valida los tokens JWT que la API entrega al iniciar sesion.
 *
 * El token lleva el username como "subject" y el rol como un claim extra,
 * y va firmado con una clave secreta: si alguien altera el contenido, la
 * firma deja de coincidir y el token se rechaza.
 */
@Service
public class JwtService {

	private final SecretKey clave;
	private final long expiracionMillis;

	public JwtService(@Value("${jwt.secret}") String secreto,
					  @Value("${jwt.expiracion-ms}") long expiracionMillis) {
		this.clave = Keys.hmacShaKeyFor(secreto.getBytes());
		this.expiracionMillis = expiracionMillis;
	}

	public String generarToken(Usuario usuario) {
		Date ahora = new Date();
		return Jwts.builder()
				.subject(usuario.getUsername())
				.claim("rol", usuario.getRol().name())
				.claim("nombreCompleto", usuario.getNombreCompleto())
				.issuedAt(ahora)
				.expiration(new Date(ahora.getTime() + expiracionMillis))
				.signWith(clave)
				.compact();
	}

	public String extraerUsername(String token) {
		return extraerClaims(token).getSubject();
	}

	public String extraerRol(String token) {
		return extraerClaims(token).get("rol", String.class);
	}

	/**
	 * @return true si el token esta bien firmado y no ha expirado.
	 */
	public boolean esValido(String token) {
		try {
			extraerClaims(token);
			return true;
		}
		catch (JwtException | IllegalArgumentException ex) {
			return false;
		}
	}

	public long getExpiracionMillis() {
		return expiracionMillis;
	}

	private Claims extraerClaims(String token) {
		return Jwts.parser()
				.verifyWith(clave)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

}
