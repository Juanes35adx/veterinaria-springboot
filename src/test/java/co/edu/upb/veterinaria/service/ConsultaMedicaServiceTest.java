package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.model.Mascota;
import co.edu.upb.veterinaria.model.Veterinario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class ConsultaMedicaServiceTest {

	@Autowired
	private ConsultaMedicaService consultaMedicaService;

	@Autowired
	private ClienteService clienteService;

	@Autowired
	private MascotaService mascotaService;

	@Autowired
	private VeterinarioService veterinarioService;

	private Mascota mascotaPrueba;
	private Veterinario vetPrueba;

	@BeforeEach
	void setUp() {
		Cliente cliente = clienteService.guardar(new Cliente("Carlos Ruiz", "3007778899", "carlos@test.com"));
		mascotaPrueba = mascotaService.guardar(new Mascota("Toby", "Perro", "Poodle", 5, cliente));
		vetPrueba = veterinarioService.guardar(new Veterinario("Dr. Lopez", "TP-777", "General", "3005554433", "lopez@vet.com"));
	}

	@Test
	void guardaConsultaValidaYLeAsignaId() {
		ConsultaMedica consulta = consultaMedicaService.guardar(new ConsultaMedica(mascotaPrueba, vetPrueba, "Control anual", 8.5, 38.2, "Sano"));

		assertThat(consulta.getId()).isNotNull();
		assertThat(consultaMedicaService.obtenerPorId(consulta.getId()).getMotivo()).isEqualTo("Control anual");
		assertThat(consultaMedicaService.listarTodas()).isNotEmpty();
		assertThat(consultaMedicaService.listarPorMascota(mascotaPrueba.getId())).isNotEmpty();
		assertThat(consultaMedicaService.listarPorVeterinario(vetPrueba.getId())).isNotEmpty();
	}

	@Test
	void rechazaConsultaSinMotivo() {
		assertThatThrownBy(() -> consultaMedicaService.guardar(new ConsultaMedica(mascotaPrueba, vetPrueba, "", 8.5, 38.2, "Sano")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El motivo de la consulta es obligatorio.");
	}

	@Test
	void rechazaConsultaConPesoInvalido() {
		assertThatThrownBy(() -> consultaMedicaService.guardar(new ConsultaMedica(mascotaPrueba, vetPrueba, "Control", 0, 38.2, "Sano")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El peso de la mascota debe ser mayor a 0 kg.");
	}

	@Test
	void rechazaConsultaSinMascota() {
		assertThatThrownBy(() -> consultaMedicaService.guardar(new ConsultaMedica(null, vetPrueba, "Control", 5.0, 38.2, "Sano")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("Debe indicar el id de la mascota.");
	}

	@Test
	void rechazaConsultaSinVeterinario() {
		assertThatThrownBy(() -> consultaMedicaService.guardar(new ConsultaMedica(mascotaPrueba, null, "Control", 5.0, 38.2, "Sano")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("Debe indicar el id del veterinario.");
	}

	@Test
	void actualizaConsultaExistente() {
		ConsultaMedica creada = consultaMedicaService.guardar(new ConsultaMedica(mascotaPrueba, vetPrueba, "Revision", 8.5, 38.2, "Ok"));
		ConsultaMedica actualizada = consultaMedicaService.actualizar(creada.getId(), new ConsultaMedica(mascotaPrueba, vetPrueba, "Revision avanzada", 9.0, 38.5, "Todo bien"));

		assertThat(actualizada.getMotivo()).isEqualTo("Revision avanzada");
		assertThat(actualizada.getPesoKg()).isEqualTo(9.0);
	}

	@Test
	void eliminaConsultaExistente() {
		ConsultaMedica creada = consultaMedicaService.guardar(new ConsultaMedica(mascotaPrueba, vetPrueba, "Eliminar", 8.5, 38.2, "Ok"));
		consultaMedicaService.eliminar(creada.getId());

		assertThatThrownBy(() -> consultaMedicaService.obtenerPorId(creada.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

	@Test
	void lanzaExcepcionSiMascotaOVeterinarioInexistenteEnListados() {
		assertThatThrownBy(() -> consultaMedicaService.listarPorMascota(9999L))
				.isInstanceOf(RecursoNoEncontradoException.class);

		assertThatThrownBy(() -> consultaMedicaService.listarPorVeterinario(9999L))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

}
