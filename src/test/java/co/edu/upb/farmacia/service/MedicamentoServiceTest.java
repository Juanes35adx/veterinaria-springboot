package co.edu.upb.farmacia.service;

import co.edu.upb.farmacia.model.Medicamento;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.tuple;

@SpringBootTest
class MedicamentoServiceTest {

	@Autowired
	private MedicamentoService medicamentoService;

	@Test
	void guardaUnMedicamentoValidoYLeAsignaId() {
		Medicamento guardado = medicamentoService.guardar(new Medicamento("Paracetamol", 15.5, 100));

		assertThat(guardado.getId()).isNotNull();
		assertThat(guardado.getNombre()).isEqualTo("Paracetamol");
		// Se relee desde H2: la entidad persistida es una instancia distinta,
		// asi que se compara por id y por contenido.
		assertThat(medicamentoService.listarTodos())
				.extracting(Medicamento::getId, Medicamento::getNombre, Medicamento::getPrecio)
				.contains(tuple(guardado.getId(), "Paracetamol", 15.5));
	}

	@Test
	void rechazaPrecioIgualACero() {
		assertThatThrownBy(() -> medicamentoService.guardar(new Medicamento("Aspirina", 0, 10)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El precio del medicamento debe ser mayor a cero.");
	}

	@Test
	void rechazaPrecioNegativo() {
		assertThatThrownBy(() -> medicamentoService.guardar(new Medicamento("Aspirina", -3.2, 10)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El precio del medicamento debe ser mayor a cero.");
	}

	@Test
	void rechazaCantidadNegativa() {
		assertThatThrownBy(() -> medicamentoService.guardar(new Medicamento("Ibuprofeno", 8.75, -5)))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("La cantidad en inventario no puede ser negativa.");
	}

	@Test
	void aceptaCantidadEnCeroPorqueElMedicamentoSeAgoto() {
		Medicamento guardado = medicamentoService.guardar(new Medicamento("Amoxicilina", 22.0, 0));

		assertThat(guardado.getId()).isNotNull();
		assertThat(guardado.getCantidadInventario()).isZero();
	}

}
