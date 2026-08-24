package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Rol;
import co.edu.upb.veterinaria.model.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class UsuarioServiceTest {

	@Autowired
	private UsuarioService usuarioService;

	@Test
	void registraUnUsuarioYCifraSuContrasena() {
		Usuario guardado = usuarioService.registrar(
				new Usuario("nuevo.usuario", "clave1234", Rol.RECEPCIONISTA, "Usuario Nuevo"));

		assertThat(guardado.getId()).isNotNull();
		// La contraseña nunca debe quedar guardada en texto plano.
		assertThat(guardado.getPassword()).isNotEqualTo("clave1234");
		assertThat(guardado.getPassword()).startsWith("$2");
	}

	@Test
	void autenticaConLaContrasenaCorrecta() {
		usuarioService.registrar(new Usuario("login.ok", "clave1234", Rol.VETERINARIO, "Vet Prueba"));

		Usuario autenticado = usuarioService.autenticar("login.ok", "clave1234");

		assertThat(autenticado.getRol()).isEqualTo(Rol.VETERINARIO);
	}

	@Test
	void rechazaLaContrasenaIncorrecta() {
		usuarioService.registrar(new Usuario("login.malo", "clave1234", Rol.VETERINARIO, "Vet Prueba"));

		assertThatThrownBy(() -> usuarioService.autenticar("login.malo", "otraClave"))
				.isInstanceOf(CredencialesInvalidasException.class)
				.hasMessage("Usuario o contraseña incorrectos.");
	}

	@Test
	void rechazaUnUsuarioInexistente() {
		assertThatThrownBy(() -> usuarioService.autenticar("no.existe", "loquesea"))
				.isInstanceOf(CredencialesInvalidasException.class);
	}

	@Test
	void rechazaUsernameDuplicado() {
		usuarioService.registrar(new Usuario("repetido", "clave1234", Rol.ADMIN, "Primero"));

		assertThatThrownBy(() -> usuarioService.registrar(
				new Usuario("repetido", "clave1234", Rol.ADMIN, "Segundo")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Ya existe un usuario");
	}

	@Test
	void rechazaContrasenaMuyCorta() {
		assertThatThrownBy(() -> usuarioService.registrar(
				new Usuario("corto", "abc", Rol.ADMIN, "Clave corta")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("al menos 4 caracteres");
	}

	@Test
	void rechazaUsuarioSinRol() {
		assertThatThrownBy(() -> usuarioService.registrar(
				new Usuario("sin.rol", "clave1234", null, "Sin rol")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("rol del usuario es obligatorio");
	}

	@Test
	void rechazaUsuarioSinUsername() {
		assertThatThrownBy(() -> usuarioService.registrar(
				new Usuario("", "clave1234", Rol.ADMIN, "Sin username")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("username es obligatorio");
	}

	@Test
	void listaYObtieneUsuarios() {
		Usuario creado = usuarioService.registrar(
				new Usuario("consultable", "clave1234", Rol.ADMIN, "Consultable"));

		assertThat(usuarioService.obtenerPorId(creado.getId()).getUsername()).isEqualTo("consultable");
		assertThat(usuarioService.listarTodos()).extracting(Usuario::getId).contains(creado.getId());
	}

	@Test
	void eliminaUnUsuarioExistente() {
		Usuario creado = usuarioService.registrar(
				new Usuario("borrable", "clave1234", Rol.ADMIN, "Borrable"));

		usuarioService.eliminar(creado.getId());

		assertThatThrownBy(() -> usuarioService.obtenerPorId(creado.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

	@Test
	void lanzaNoEncontradoAlEliminarUnIdInexistente() {
		assertThatThrownBy(() -> usuarioService.eliminar(999_999L))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

}
