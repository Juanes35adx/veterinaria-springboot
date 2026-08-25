package co.edu.upb.veterinaria.security;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtro que se ejecuta UNA vez por peticion, antes de llegar al controlador.
 *
 * Lee la cabecera "Authorization: Bearer <token>", valida el JWT y, si es
 * correcto, registra al usuario y su rol en el contexto de seguridad de
 * Spring. A partir de ahi, las reglas de SecurityConfig deciden si ese rol
 * puede o no acceder a la ruta pedida.
 *
 * Si no hay token o es invalido, simplemente no autentica a nadie y deja
 * que la cadena siga: Spring Security respondera 401/403 segun la ruta.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String PREFIJO_BEARER = "Bearer ";

	private final JwtService jwtService;

	public JwtAuthenticationFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request,
									HttpServletResponse response,
									FilterChain filterChain) throws ServletException, IOException {

		String cabecera = request.getHeader("Authorization");

		if (cabecera != null && cabecera.startsWith(PREFIJO_BEARER)) {
			String token = cabecera.substring(PREFIJO_BEARER.length());

			if (jwtService.esValido(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
				String username = jwtService.extraerUsername(token);
				String rol = jwtService.extraerRol(token);

				// Spring Security espera el prefijo "ROLE_" para usar hasRole(...)
				var autoridades = List.of(new SimpleGrantedAuthority("ROLE_" + rol));

				var autenticacion = new UsernamePasswordAuthenticationToken(username, null, autoridades);
				autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(autenticacion);
			}
		}

		filterChain.doFilter(request, response);
	}

}
