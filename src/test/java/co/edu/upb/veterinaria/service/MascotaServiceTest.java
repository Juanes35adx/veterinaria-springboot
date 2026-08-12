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

}
