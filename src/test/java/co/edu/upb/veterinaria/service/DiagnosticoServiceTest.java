package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.model.Diagnostico;
import co.edu.upb.veterinaria.model.Mascota;
import co.edu.upb.veterinaria.model.Veterinario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class DiagnosticoServiceTest {

	@Autowired
	private DiagnosticoService diagnosticoService;

	@Autowired
	private ConsultaMedicaService consultaMedicaService;

	@Autowired
	private ClienteService clienteService;

	@Autowired
	private MascotaService mascotaService;

	@Autowired
	private VeterinarioService veterinarioService;

	private ConsultaMedica consultaPrueba;

	@BeforeEach
	void setUp() {
		Cliente cliente = clienteService.guardar(new Cliente("Sandra Morales", "3004441122", "sandra@test.com"));
		Mascota mascota = mascotaService.guardar(new Mascota("Sasha", "Gato", "Siames", 3, cliente));
		Veterinario vet = veterinarioService.guardar(new Veterinario("Dr. Perez", "TP-555", "Felinos", "3001119988", "perez@vet.com"));
		consultaPrueba = consultaMedicaService.guardar(new ConsultaMedica(mascota, vet, "Gripe felina", 4.0, 39.0, "Estornudos"));
	}

	@Test
	void guardaDiagnosticoValidoYLeAsignaId() {
		Diagnostico diag = diagnosticoService.guardar(new Diagnostico(consultaPrueba, "Rinitis felina", "Leve", "Antihistamínico"));

		assertThat(diag.getId()).isNotNull();
		assertThat(diagnosticoService.obtenerPorId(diag.getId()).getDescripcion()).isEqualTo("Rinitis felina");
		assertThat(diagnosticoService.listarTodos()).isNotEmpty();
		assertThat(diagnosticoService.listarPorConsulta(consultaPrueba.getId())).isNotEmpty();
	}

	@Test
	void rechazaDiagnosticoSinDescripcion() {
		assertThatThrownBy(() -> diagnosticoService.guardar(new Diagnostico(consultaPrueba, "", "Leve", "Tratamiento")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("La descripcion del diagnostico es obligatoria.");
	}

	@Test
	void rechazaDiagnosticoSinConsulta() {
		assertThatThrownBy(() -> diagnosticoService.guardar(new Diagnostico(null, "Descripcion", "Leve", "Tratamiento")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("Debe indicar el id de la consulta medica.");
	}

	@Test
	void actualizaDiagnosticoExistente() {
		Diagnostico creado = diagnosticoService.guardar(new Diagnostico(consultaPrueba, "Diagnóstico 1", "Moderado", "Reposo"));
		Diagnostico actualizado = diagnosticoService.actualizar(creado.getId(), new Diagnostico(consultaPrueba, "Diagnóstico Modificado", "Grave", "Cuidados intensivos"));

		assertThat(actualizado.getDescripcion()).isEqualTo("Diagnóstico Modificado");
		assertThat(actualizado.getGravedad()).isEqualTo("Grave");
	}

	@Test
	void eliminaDiagnosticoExistente() {
		Diagnostico creado = diagnosticoService.guardar(new Diagnostico(consultaPrueba, "Diagnóstico 2", "Leve", "Reposo"));
		diagnosticoService.eliminar(creado.getId());

		assertThatThrownBy(() -> diagnosticoService.obtenerPorId(creado.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

	@Test
	void lanzaExcepcionSiConsultaInexistenteEnListados() {
		assertThatThrownBy(() -> diagnosticoService.listarPorConsulta(9999L))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

}
