package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Medicamento;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class MedicamentoServiceTest {

	@Autowired
	private MedicamentoService medicamentoService;

	@Test
	void guardaUnMedicamentoValidoYLeAsignaId() {
		Medicamento med = medicamentoService.guardar(new Medicamento("Ibuprofeno Vet", "Ibuprofeno", "Tabletas", 12000.0, 100, 10));

		assertThat(med.getId()).isNotNull();
		assertThat(medicamentoService.obtenerPorId(med.getId()).getNombre()).isEqualTo("Ibuprofeno Vet");
		assertThat(medicamentoService.listarTodos()).isNotEmpty();
	}

	@Test
	void rechazaMedicamentoSinNombre() {
		assertThatThrownBy(() -> medicamentoService.guardar(new Medicamento("", "Principio", "Presentacion", 10000.0, 50, 5)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El nombre del medicamento es obligatorio.");
	}

	@Test
	void rechazaMedicamentoConPrecioNegativo() {
		assertThatThrownBy(() -> medicamentoService.guardar(new Medicamento("Nombre", "Principio", "Presentacion", -500.0, 50, 5)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El precio del medicamento no puede ser negativo.");
	}

	@Test
	void rechazaMedicamentoConStockNegativo() {
		assertThatThrownBy(() -> medicamentoService.guardar(new Medicamento("Nombre", "Principio", "Presentacion", 5000.0, -10, 5)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El stock del medicamento no puede ser negativo.");
	}

	@Test
	void actualizaMedicamentoExistente() {
		Medicamento creado = medicamentoService.guardar(new Medicamento("Paracetamol Vet", "Paracetamol", "Jarabe", 8000.0, 30, 5));
		Medicamento actualizado = medicamentoService.actualizar(creado.getId(), new Medicamento("Paracetamol Vet 250mg", "Paracetamol", "Jarabe x 100ml", 9500.0, 40, 5));

		assertThat(actualizado.getNombre()).isEqualTo("Paracetamol Vet 250mg");
		assertThat(actualizado.getPrecio()).isEqualTo(9500.0);
		assertThat(actualizado.getStock()).isEqualTo(40);
	}

	@Test
	void eliminaMedicamentoExistente() {
		Medicamento creado = medicamentoService.guardar(new Medicamento("Eliminar Med", "Principio", "Jarabe", 5000.0, 10, 2));
		medicamentoService.eliminar(creado.getId());

		assertThatThrownBy(() -> medicamentoService.obtenerPorId(creado.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class);
	}

}
