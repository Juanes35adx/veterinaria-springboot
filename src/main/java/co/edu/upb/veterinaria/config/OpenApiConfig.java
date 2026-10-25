package co.edu.upb.veterinaria.config;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Completa la especificacion OpenAPI que springdoc genera a partir de los
 * controllers: declara el esquema Bearer (JWT), corrige los codigos de exito
 * (201 al crear, 204 al eliminar) y agrega los codigos de error que devuelven
 * SecurityConfig y ManejadorGlobalDeErrores.
 */
@Configuration
public class OpenApiConfig {

	private static final String ESQUEMA_JWT = "bearerAuth";
	private static final String REF_ERROR = "#/components/schemas/ErrorRespuesta";
	private static final String RUTA_LOGIN = "/api/auth/login";

	@Bean
	public OpenAPI especificacionBase() {
		return new OpenAPI()
				.info(new Info()
						.title("ProtoZOO - API de gestion veterinaria")
						.version("1.0.0")
						.description("Clientes, mascotas, veterinarios, farmacia, consultas, diagnosticos y recetas. "
								+ "Todas las rutas, salvo el login, exigen un token JWT en la cabecera Authorization."))
				.servers(List.of(new Server().url("http://localhost:8080").description("Backend local")))
				.components(new Components()
						.addSecuritySchemes(ESQUEMA_JWT, new SecurityScheme()
								.type(SecurityScheme.Type.HTTP)
								.scheme("bearer")
								.bearerFormat("JWT")
								.description("Token obtenido en POST /api/auth/login")));
	}

	@Bean
	public OpenApiCustomizer codigosDeRespuesta() {
		return openApi -> {
			// Se agrega aqui y no en especificacionBase: springdoc reconstruye los esquemas.
			openApi.getComponents().addSchemas("ErrorRespuesta", esquemaError());
			openApi.getPaths().forEach((ruta, item) ->
					item.readOperationsMap().forEach((metodo, operacion) -> completar(ruta, metodo, operacion)));
		};
	}

	/** Recurso de cada ruta: [singular, plural] para nombrar operaciones y etiquetas. */
	private static final Map<String, String[]> RECURSOS = Map.of(
			"clientes", new String[] {"Cliente", "Clientes"},
			"mascotas", new String[] {"Mascota", "Mascotas"},
			"veterinarios", new String[] {"Veterinario", "Veterinarios"},
			"medicamentos", new String[] {"Medicamento", "Medicamentos"},
			"consultas", new String[] {"Consulta", "Consultas"},
			"diagnosticos", new String[] {"Diagnostico", "Diagnosticos"},
			"prescripciones", new String[] {"Prescripcion", "Prescripciones"},
			"usuarios", new String[] {"Usuario", "Usuarios"});

	private void completar(String ruta, PathItem.HttpMethod metodo, Operation operacion) {
		ApiResponses respuestas = operacion.getResponses();

		if (RUTA_LOGIN.equals(ruta)) {
			operacion.setTags(List.of("Autenticacion"));
			operacion.setSummary("Iniciar sesion y obtener un token JWT");
			operacion.setSecurity(List.of());
			respuestas.addApiResponse("401", error("Usuario o contrasena incorrectos"));
			return;
		}

		nombrar(ruta, operacion);
		operacion.setSecurity(List.of(new SecurityRequirement().addList(ESQUEMA_JWT)));

		if (metodo == PathItem.HttpMethod.POST) {
			ApiResponse creado = respuestas.remove("200");
			respuestas.addApiResponse("201", (creado != null ? creado : new ApiResponse()).description("Recurso creado"));
		}
		if (metodo == PathItem.HttpMethod.DELETE) {
			respuestas.remove("200");
			respuestas.addApiResponse("204", new ApiResponse().description("Recurso eliminado"));
			respuestas.addApiResponse("409", error("El registro tiene otros datos asociados"));
		}
		if (metodo == PathItem.HttpMethod.POST || metodo == PathItem.HttpMethod.PUT) {
			respuestas.addApiResponse("400", error("Datos invalidos o regla de negocio incumplida"));
		}

		respuestas.addApiResponse("401", error("Falta el token o es invalido o expirado"));
		if (!permitidoATodosLosRoles(ruta, metodo)) {
			respuestas.addApiResponse("403", error("El rol del usuario no tiene permiso sobre esta ruta"));
		}
		if (ruta.contains("{") || referenciaOtrosRecursos(ruta, metodo)) {
			respuestas.addApiResponse("404", error("El recurso o uno de los que referencia no existe"));
		}
	}

	/**
	 * springdoc nombra las operaciones como el metodo Java (crear, crear_1...).
	 * Aqui se cambian por nombres unicos y legibles: crearCliente, listarMascotas...
	 */
	private void nombrar(String ruta, Operation operacion) {
		String[] recurso = RECURSOS.get(ruta.split("/")[2]);
		String metodoJava = operacion.getOperationId().replaceAll("_\\d+$", "");
		operacion.setTags(List.of(recurso[1]));

		switch (metodoJava) {
			case "crear" -> nombrar(operacion, "crear" + recurso[0], "Crear " + recurso[0].toLowerCase());
			case "listar" -> nombrar(operacion, "listar" + recurso[1], "Listar " + recurso[1].toLowerCase());
			case "obtener" -> nombrar(operacion, "obtener" + recurso[0], "Obtener " + recurso[0].toLowerCase() + " por id");
			case "actualizar" -> nombrar(operacion, "actualizar" + recurso[0], "Actualizar " + recurso[0].toLowerCase());
			case "eliminar" -> nombrar(operacion, "eliminar" + recurso[0], "Eliminar " + recurso[0].toLowerCase());
			default -> {
				// listarPorCliente, listarPorConsulta...: el criterio va despues de "listarPor".
				String criterio = metodoJava.substring("listarPor".length());
				nombrar(operacion, "listar" + recurso[1] + "Por" + criterio,
						"Listar " + recurso[1].toLowerCase() + " por " + criterio.toLowerCase());
			}
		}
	}

	private void nombrar(Operation operacion, String id, String resumen) {
		operacion.setOperationId(id);
		operacion.setSummary(resumen);
	}

	/** Refleja las reglas de SecurityConfig: que rutas alcanzan los tres roles. */
	private boolean permitidoATodosLosRoles(String ruta, PathItem.HttpMethod metodo) {
		if (metodo == PathItem.HttpMethod.DELETE) {
			return false;
		}
		if (ruta.startsWith("/api/clientes") || ruta.startsWith("/api/mascotas")) {
			return true;
		}
		return metodo == PathItem.HttpMethod.GET
				&& (ruta.startsWith("/api/veterinarios") || ruta.startsWith("/api/medicamentos"));
	}

	/** Al crear estos recursos el servicio busca el cliente, la mascota, la consulta, etc. */
	private boolean referenciaOtrosRecursos(String ruta, PathItem.HttpMethod metodo) {
		return metodo == PathItem.HttpMethod.POST && List.of(
				"/api/mascotas", "/api/consultas", "/api/diagnosticos", "/api/prescripciones").contains(ruta);
	}

	private ApiResponse error(String descripcion) {
		return new ApiResponse()
				.description(descripcion)
				.content(new Content().addMediaType("application/json",
						new MediaType().schema(new Schema<>().$ref(REF_ERROR))));
	}

	private Schema<?> esquemaError() {
		Map<String, Schema> campos = new LinkedHashMap<>();
		campos.put("timestamp", new StringSchema().example("2026-11-05T18:30:00"));
		campos.put("status", new IntegerSchema().example(404));
		campos.put("error", new StringSchema().example("Not Found"));
		campos.put("message", new StringSchema().example("Cliente no encontrado con id 99"));
		return new ObjectSchema()
				.description("Cuerpo de todas las respuestas de error")
				.properties(campos);
	}

}
