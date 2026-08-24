package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.model.Mascota;
import co.edu.upb.veterinaria.model.Medicamento;
import co.edu.upb.veterinaria.model.Prescripcion;
import co.edu.upb.veterinaria.model.Veterinario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class PrescripcionServiceTest {

	@Autowired
	private PrescripcionService prescripcionService;

	@Autowired
	private ClienteService clienteService;

	@Autowired
	private MascotaService mascotaService;

	@Autowired
	private VeterinarioService veterinarioService;

	@Autowired
	private ConsultaMedicaService consultaMedicaService;

	@Autowired
	private MedicamentoService medicamentoService;

	@Test
	void descuentaStockAlGuardarPrescripcion() {
		Cliente cliente = clienteService.guardar(new Cliente("Laura Restrepo", "3001112233", "laura@test.com"));
		Mascota mascota = mascotaService.guardar(new Mascota("Max", "Perro", "Beagle", 4, cliente));
		Veterinario vet = veterinarioService.guardar(new Veterinario("Dra. Ana", "TP-999", "Dermatología", "3009998877", "ana@vet.com"));
		ConsultaMedica consulta = consultaMedicaService.guardar(new ConsultaMedica(mascota, vet, "Alergia en piel", 10.5, 38.5, "Piel irritada"));

		Medicamento med = medicamentoService.guardar(new Medicamento("Amoxicilina", "Amoxicilina", "Pastillas 500mg", 15000.0, 50, 5));

		Prescripcion pres = prescripcionService.guardar(new Prescripcion(consulta, med, "1 pastilla cada 12h", "7 días", 14));

		assertThat(pres.getId()).isNotNull();

		Medicamento medActualizado = medicamentoService.obtenerPorId(med.getId());
		assertThat(medActualizado.getStock()).isEqualTo(36); // 50 - 14 = 36
	}

	@Test
	void rechazaPrescripcionSiStockInsuficiente() {
		Cliente cliente = clienteService.guardar(new Cliente("Mario Gomez", "3004445566", "mario@test.com"));
		Mascota mascota = mascotaService.guardar(new Mascota("Rocky", "Perro", "Bulldog", 2, cliente));
		Veterinario vet = veterinarioService.guardar(new Veterinario("Dr. Hugo", "TP-888", "General", "3008887766", "hugo@vet.com"));
		ConsultaMedica consulta = consultaMedicaService.guardar(new ConsultaMedica(mascota, vet, "Dolor articular", 15.0, 38.0, "Cojera"));

		Medicamento med = medicamentoService.guardar(new Medicamento("Meloxicam", "Meloxicam", "Gotas", 25000.0, 5, 2));

		assertThatThrownBy(() -> prescripcionService.guardar(new Prescripcion(consulta, med, "5 gotas al día", "10 días", 10)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessageContaining("Stock insuficiente");
	}

}
