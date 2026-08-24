package co.edu.upb.veterinaria.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuracion central de seguridad: define que rutas son publicas y que
 * rol se necesita para cada una.
 *
 * Reparto de responsabilidades por rol:
 *   ADMIN         -> todo, incluido eliminar y gestionar usuarios/veterinarios.
 *   VETERINARIO   -> la parte clinica: consultas, diagnosticos, prescripciones.
 *   RECEPCIONISTA -> el mostrador: clientes y mascotas.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final ManejadorNoAutenticado manejadorNoAutenticado;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
						  ManejadorNoAutenticado manejadorNoAutenticado) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.manejadorNoAutenticado = manejadorNoAutenticado;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			// La API no usa formularios ni cookies de sesion, asi que CSRF no aplica.
			.csrf(csrf -> csrf.disable())

			// Cada peticion se autentica con su token: no se guarda estado en el servidor.
			.sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

			.authorizeHttpRequests(auth -> auth
				// --- Rutas publicas: iniciar sesion no requiere estar autenticado ---
				.requestMatchers("/api/auth/login").permitAll()

				// Spring Boot reenvia internamente a /error para renderizar cualquier
				// error HTTP (403, 404, 500...). Si esta ruta no se permite aqui, esa
				// segunda pasada por el filtro vuelve a evaluar seguridad -sin la
				// autenticacion de la primera pasada- y termina reemplazando el
				// codigo de estado original (p. ej. 403) por un 401 enganoso.
				.requestMatchers("/error").permitAll()

				// --- Gestion de usuarios: solo ADMIN ---
				.requestMatchers("/api/usuarios/**").hasRole("ADMIN")

				// --- Eliminar cualquier recurso: solo ADMIN ---
				.requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")

				// --- Veterinarios: ADMIN gestiona, los demas solo consultan ---
				.requestMatchers(HttpMethod.GET, "/api/veterinarios/**")
					.hasAnyRole("ADMIN", "VETERINARIO", "RECEPCIONISTA")
				.requestMatchers("/api/veterinarios/**").hasRole("ADMIN")

				// --- Area clinica: ADMIN y VETERINARIO ---
				.requestMatchers("/api/consultas/**").hasAnyRole("ADMIN", "VETERINARIO")
				.requestMatchers("/api/diagnosticos/**").hasAnyRole("ADMIN", "VETERINARIO")
				.requestMatchers("/api/prescripciones/**").hasAnyRole("ADMIN", "VETERINARIO")

				// --- Farmacia: todos consultan, solo ADMIN y VETERINARIO modifican ---
				.requestMatchers(HttpMethod.GET, "/api/medicamentos/**")
					.hasAnyRole("ADMIN", "VETERINARIO", "RECEPCIONISTA")
				.requestMatchers("/api/medicamentos/**").hasAnyRole("ADMIN", "VETERINARIO")

				// --- Mostrador: los tres roles pueden ver y registrar clientes/mascotas ---
				.requestMatchers("/api/clientes/**")
					.hasAnyRole("ADMIN", "VETERINARIO", "RECEPCIONISTA")
				.requestMatchers("/api/mascotas/**")
					.hasAnyRole("ADMIN", "VETERINARIO", "RECEPCIONISTA")

				// Cualquier otra ruta exige al menos estar autenticado.
				.anyRequest().authenticated()
			)

			// Sin token -> 401 (y no el 403 que Spring devuelve por defecto).
			.exceptionHandling(ex -> ex.authenticationEntryPoint(manejadorNoAutenticado))

			// Nuestro filtro corre ANTES del de usuario/contraseña de Spring.
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

}
