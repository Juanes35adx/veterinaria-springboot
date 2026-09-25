package co.edu.upb.veterinaria.security;

import co.edu.upb.veterinaria.controller.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Prueba por HTTP lo que viaja en el JSON, que los tests de servicio no
 * pueden ver porque construyen los objetos directamente en Java:
 *  - la contrasena se acepta al crear un usuario, pero nunca se devuelve;
 *  - un POST con "id" crea un registro nuevo y no sobreescribe uno existente.
 */
@SpringBootTest
@AutoConfigureMockMvc
class CuerposDePeticionTest {

	@Autowired
	private MockMvcTester mvc;

	@Autowired
	private ObjectMapper objectMapper;

	private String tokenDe(String username, String password) {
		MvcTestResult respuesta = mvc.post().uri("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new LoginRequest(username, password)))
				.exchange();
		assertThat(respuesta).hasStatus(200);
		return leer(respuesta).get("token").asString();
	}

	private JsonNode leer(MvcTestResult respuesta) {
		try {
			return objectMapper.readTree(respuesta.getResponse().getContentAsString());
		}
		catch (java.io.UnsupportedEncodingException ex) {
			throw new IllegalStateException("No se pudo leer la respuesta", ex);
		}
	}

	@Test
	void elAdminCreaUnUsuarioPorApiYEsePuedeIniciarSesion() {
		MvcTestResult creado = mvc.post().uri("/api/usuarios")
				.header("Authorization", "Bearer " + tokenDe("admin", "admin123"))
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"username\":\"nuevo.por.api\",\"password\":\"clave1234\",\"rol\":\"RECEPCIONISTA\",\"nombreCompleto\":\"Nuevo\"}")
				.exchange();

		assertThat(creado).hasStatus(201);
		// La contrasena nunca sale en la respuesta, ni siquiera cifrada.
		assertThat(leer(creado).has("password")).isFalse();
		// Y como si se recibio, el usuario nuevo puede iniciar sesion.
		assertThat(tokenDe("nuevo.por.api", "clave1234")).isNotBlank();
	}

	@Test
	void unPostConIdNoSobreescribeUnRegistroExistente() {
		String token = tokenDe("recepcion", "recep123");

		MvcTestResult original = mvc.post().uri("/api/clientes")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"nombre\":\"Original\",\"telefono\":\"3000000001\",\"email\":\"o@mail.com\"}")
				.exchange();
		long idOriginal = leer(original).get("id").asLong();

		MvcTestResult intento = mvc.post().uri("/api/clientes")
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"id\":" + idOriginal + ",\"nombre\":\"Intruso\",\"telefono\":\"3000000002\",\"email\":\"i@mail.com\"}")
				.exchange();

		assertThat(intento).hasStatus(201);
		assertThat(leer(intento).get("id").asLong()).isNotEqualTo(idOriginal);

		MvcTestResult releido = mvc.get().uri("/api/clientes/" + idOriginal)
				.header("Authorization", "Bearer " + token)
				.exchange();
		assertThat(leer(releido).get("nombre").asString()).isEqualTo("Original");
	}

}
