package co.edu.upb.veterinaria.config;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Regenera openapi.yaml en la raiz del repositorio a partir de la API real.
 * No corre con el resto de pruebas; se ejecuta a proposito con:
 *   ./mvnw test -Dtest=ExportarOpenApiTest -Dopenapi.exportar=true -Djacoco.skip=true
 */
@SpringBootTest
@AutoConfigureMockMvc
@EnabledIfSystemProperty(named = "openapi.exportar", matches = "true")
class ExportarOpenApiTest {

	@Autowired
	private MockMvcTester mvc;

	@Test
	void exportaLaEspecificacionALaRaiz() throws Exception {
		var respuesta = mvc.get().uri("/v3/api-docs.yaml").exchange();
		assertThat(respuesta).hasStatus(200);

		String yaml = respuesta.getResponse().getContentAsString(StandardCharsets.UTF_8);
		Files.writeString(Path.of("openapi.yaml"), yaml, StandardCharsets.UTF_8);
	}

}
