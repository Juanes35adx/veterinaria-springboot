package co.edu.upb.veterinaria.service;

import co.edu.upb.veterinaria.model.Veterinario;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class VeterinarioServiceTest {

	@Autowired
	private VeterinarioService veterinarioService;

	@Test
	void guardaUnVeterinarioValidoYLeAsignaId() {
		Veterinario vet = veterinarioService.guardar(new Veterinario("Dr. Carlos Gomez", "TP-12345", "Cirugía", "3101112233", "carlos@vet.com"));

		assertThat(vet.getId()).isNotNull();
		assertThat(veterinarioService.obtenerPorId(vet.getId()).getNombre()).isEqualTo("Dr. Carlos Gomez");
	}

	@Test
	void rechazaVeterinarioSinNombre() {
		assertThatThrownBy(() -> veterinarioService.guardar(new Veterinario("", "TP-12345", "General", "3101112233", "email@vet.com")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("El nombre del veterinario es obligatorio.");
	}

	@Test
	void rechazaVeterinarioSinTarjetaProfesional() {
		assertThatThrownBy(() -> veterinarioService.guardar(new Veterinario("Dr. Pedro", "", "General", "3101112233", "email@vet.com")))
				.isInstanceOf(IllegalArgumentException.class)
				.hasMessage("La tarjeta profesional del veterinario es obligatoria.");
	}

}
