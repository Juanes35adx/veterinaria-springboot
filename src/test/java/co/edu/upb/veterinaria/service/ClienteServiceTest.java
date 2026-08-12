package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Cliente;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class ClienteServiceTest {

	@Autowired
	private ClienteService clienteService;

	@Test
	void guardaUnClienteValidoYLeAsignaId() {
		Cliente guardado = clienteService.guardar(new Cliente("Camila Restrepo", "3001234567", "camila@mail.com"));

		assertThat(guardado.getId()).isNotNull();
		assertThat(clienteService.obtenerPorId(guardado.getId()).getNombre()).isEqualTo("Camila Restrepo");
	}

	@Test
	void rechazaClienteSinNombre() {
		assertThatThrownBy(() -> clienteService.guardar(new Cliente("", "3001234567", "camila@mail.com")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El nombre del cliente es obligatorio.");
	}

	@Test
	void rechazaClienteSinTelefono() {
		assertThatThrownBy(() -> clienteService.guardar(new Cliente("Camila Restrepo", "", "camila@mail.com")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El telefono del cliente es obligatorio.");
	}

	@Test
	void actualizaUnClienteExistente() {
		Cliente creado = clienteService.guardar(new Cliente("Juan Perez", "3009999999", "juan@mail.com"));

		Cliente actualizado = clienteService.actualizar(creado.getId(),
				new Cliente("Juan Perez G.", "3008888888", "juan.g@mail.com"));

		assertThat(actualizado.getNombre()).isEqualTo("Juan Perez G.");
		assertThat(actualizado.getTelefono()).isEqualTo("3008888888");
	}

	@Test
	void eliminaUnClienteExistente() {
		Cliente creado = clienteService.guardar(new Cliente("Ana Diaz", "3007777777", "ana@mail.com"));

		clienteService.eliminar(creado.getId());

		assertThatThrownBy(() -> clienteService.obtenerPorId(creado.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

	@Test
	void lanzaNoEncontradoParaUnIdInexistente() {
		assertThatThrownBy(() -> clienteService.obtenerPorId(999_999L))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("No existe un cliente con id 999999");
	}

}
