package co.edu.upb.veterinaria.security;

import co.edu.upb.veterinaria.controller.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifica de punta a punta (peticiones HTTP reales contra la app) que:
 *  - sin token no se entra,
 *  - con token invalido tampoco,
 *  - y que cada rol solo alcanza las rutas que le corresponden.
 *
 * Usa los usuarios que crea UsuariosIniciales al arrancar.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AutorizacionPorRolTest {

	@Autowired
	private MockMvcTester mvc;

	@Autowired
	private ObjectMapper objectMapper;

	private String tokenDe(String username, String password) {
		var respuesta = mvc.post().uri("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new LoginRequest(username, password)))
				.exchange();

		assertThat(respuesta).hasStatus(200);
		try {
			return objectMapper.readTree(respuesta.getResponse().getContentAsString()).get("token").asString();
		}
		catch (java.io.UnsupportedEncodingException ex) {
			throw new IllegalStateException("No se pudo leer la respuesta del login", ex);
		}
	}

	// ---------- Autenticacion ----------

	@Test
	void sinTokenNoSePuedeAccederALosClientes() {
		assertThat(mvc.get().uri("/api/clientes").exchange()).hasStatus(401);
	}

	@Test
	void conTokenInvalidoTampocoSePuedeAcceder() {
		assertThat(mvc.get().uri("/api/clientes")
				.header("Authorization", "Bearer token.completamente.falso")
				.exchange()).hasStatus(401);
	}

	@Test
	void elLoginConCredencialesCorrectasDevuelveUnToken() {
		assertThat(tokenDe("admin", "admin123")).isNotBlank();
	}

	@Test
	void elLoginConCredencialesIncorrectasDevuelve401() {
		var respuesta = mvc.post().uri("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new LoginRequest("admin", "claveIncorrecta")))
				.exchange();

		assertThat(respuesta).hasStatus(401);
	}

	// ---------- Autorizacion por rol ----------

	@Test
	void elAdminPuedeGestionarUsuarios() {
		assertThat(mvc.get().uri("/api/usuarios")
				.header("Authorization", "Bearer " + tokenDe("admin", "admin123"))
				.exchange()).hasStatus(200);
	}

	@Test
	void elVeterinarioNoPuedeGestionarUsuarios() {
		assertThat(mvc.get().uri("/api/usuarios")
				.header("Authorization", "Bearer " + tokenDe("veterinario", "vet123"))
				.exchange()).hasStatus(403);
	}

	@Test
	void laRecepcionistaNoPuedeGestionarUsuarios() {
		assertThat(mvc.get().uri("/api/usuarios")
				.header("Authorization", "Bearer " + tokenDe("recepcion", "recep123"))
				.exchange()).hasStatus(403);
	}

	@Test
	void elVeterinarioSiPuedeVerLasConsultasMedicas() {
		assertThat(mvc.get().uri("/api/consultas")
				.header("Authorization", "Bearer " + tokenDe("veterinario", "vet123"))
				.exchange()).hasStatus(200);
	}

	@Test
	void laRecepcionistaNoPuedeVerLasConsultasMedicas() {
		assertThat(mvc.get().uri("/api/consultas")
				.header("Authorization", "Bearer " + tokenDe("recepcion", "recep123"))
				.exchange()).hasStatus(403);
	}

	@Test
	void laRecepcionistaSiPuedeVerLosClientes() {
		assertThat(mvc.get().uri("/api/clientes")
				.header("Authorization", "Bearer " + tokenDe("recepcion", "recep123"))
				.exchange()).hasStatus(200);
	}

	@Test
	void losTresRolesPuedenVerLasMascotas() {
		for (String[] credenciales : new String[][] {
				{ "admin", "admin123" }, { "veterinario", "vet123" }, { "recepcion", "recep123" } }) {
			assertThat(mvc.get().uri("/api/mascotas")
					.header("Authorization", "Bearer " + tokenDe(credenciales[0], credenciales[1]))
					.exchange()).hasStatus(200);
		}
	}

	@Test
	void soloElAdminPuedeEliminarRecursos() {
		// El veterinario recibe 403 (prohibido), no 404: nunca llega al controlador.
		assertThat(mvc.delete().uri("/api/clientes/999999")
				.header("Authorization", "Bearer " + tokenDe("veterinario", "vet123"))
				.exchange()).hasStatus(403);

		// El admin si pasa el filtro de seguridad, y por eso obtiene 404 (no existe).
		assertThat(mvc.delete().uri("/api/clientes/999999")
				.header("Authorization", "Bearer " + tokenDe("admin", "admin123"))
				.exchange()).hasStatus(404);
	}

	@Test
	void laRecepcionistaPuedeConsultarMedicamentosPeroNoCrearlos() {
		String token = tokenDe("recepcion", "recep123");

		assertThat(mvc.get().uri("/api/medicamentos")
				.header("Authorization", "Bearer " + token)
				.exchange()).hasStatus(200);

		assertThat(mvc.post().uri("/api/medicamentos")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"nombre\":\"X\",\"precio\":1.0,\"stock\":1,\"stockMinimo\":1}")
				.exchange()).hasStatus(403);
	}

}
