package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.model.Mascota;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class MascotaServiceTest {

	@Autowired
	private MascotaService mascotaService;

	@Autowired
	private ClienteService clienteService;

	private Cliente crearClienteDePrueba() {
		return clienteService.guardar(new Cliente("Dueño de Prueba", "3001112233", "dueno@mail.com"));
	}

	@Test
	void guardaUnaMascotaAsociadaAUnClienteExistente() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());

		Mascota guardada = mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, referenciaSoloConId));

		assertThat(guardada.getId()).isNotNull();
		assertThat(guardada.getCliente().getId()).isEqualTo(cliente.getId());
		assertThat(guardada.getCliente().getNombre()).isEqualTo("Dueño de Prueba");
	}

	@Test
	void rechazaMascotaSinCliente() {
		assertThatThrownBy(() -> mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, null)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("Debe indicar el id del cliente dueño de la mascota.");
	}

	@Test
	void rechazaMascotaConClienteInexistente() {
		Cliente clienteInexistente = new Cliente();
		clienteInexistente.setId(999_999L);

		assertThatThrownBy(() -> mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, clienteInexistente)))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

	@Test
	void rechazaEdadNegativa() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());

		assertThatThrownBy(() -> mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", -1, referenciaSoloConId)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("La edad de la mascota no puede ser negativa.");
	}

	@Test
	void listaLasMascotasDeUnCliente() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());
		mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, referenciaSoloConId));
		mascotaService.guardar(new Mascota("Michi", "Gato", "Criollo", 2, referenciaSoloConId));

		assertThat(mascotaService.listarPorCliente(cliente.getId())).hasSize(2);
	}

	@Test
	void rechazaMascotaSinNombre() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());

		assertThatThrownBy(() -> mascotaService.guardar(new Mascota("", "Perro", "Labrador", 3, referenciaSoloConId)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El nombre de la mascota es obligatorio.");
	}

	@Test
	void lanzaNoEncontradoAlListarMascotasDeUnClienteInexistente() {
		assertThatThrownBy(() -> mascotaService.listarPorCliente(999_999L))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("No existe un cliente con id 999999");
	}

	@Test
	void listaTodasLasMascotasRegistradas() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());
		Mascota creada = mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, referenciaSoloConId));

		assertThat(mascotaService.listarTodas())
				.extracting(Mascota::getId)
				.contains(creada.getId());
	}

	@Test
	void obtieneUnaMascotaPorId() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());
		Mascota creada = mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, referenciaSoloConId));

		assertThat(mascotaService.obtenerPorId(creada.getId()).getNombre()).isEqualTo("Firulais");
	}

	@Test
	void lanzaNoEncontradoAlObtenerUnaMascotaInexistente() {
		assertThatThrownBy(() -> mascotaService.obtenerPorId(999_999L))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("No existe una mascota con id 999999");
	}

	@Test
	void actualizaUnaMascotaExistente() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());
		Mascota creada = mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, referenciaSoloConId));

		Cliente otroCliente = crearClienteDePrueba();
		Cliente referenciaOtroCliente = new Cliente();
		referenciaOtroCliente.setId(otroCliente.getId());
		Mascota actualizada = mascotaService.actualizar(creada.getId(),
				new Mascota("Firulais II", "Perro", "Criollo", 4, referenciaOtroCliente));

		assertThat(actualizada.getNombre()).isEqualTo("Firulais II");
		assertThat(actualizada.getEdad()).isEqualTo(4);
		assertThat(actualizada.getCliente().getId()).isEqualTo(otroCliente.getId());
	}

	@Test
	void lanzaNoEncontradoAlActualizarUnaMascotaInexistente() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());

		assertThatThrownBy(() -> mascotaService.actualizar(999_999L,
				new Mascota("Firulais", "Perro", "Labrador", 3, referenciaSoloConId)))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("No existe una mascota con id 999999");
	}

	@Test
	void eliminaUnaMascotaExistente() {
		Cliente cliente = crearClienteDePrueba();
		Cliente referenciaSoloConId = new Cliente();
		referenciaSoloConId.setId(cliente.getId());
		Mascota creada = mascotaService.guardar(new Mascota("Firulais", "Perro", "Labrador", 3, referenciaSoloConId));

		mascotaService.eliminar(creada.getId());

		assertThatThrownBy(() -> mascotaService.obtenerPorId(creada.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

	@Test
	void lanzaNoEncontradoAlEliminarUnaMascotaInexistente() {
		assertThatThrownBy(() -> mascotaService.eliminar(999_999L))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("No existe una mascota con id 999999");
	}

}
