package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Veterinario;
import co.edu.upb.veterinaria.repository.VeterinarioRepository;
import org.springframework.stereotype.Service;

@Service
public class VeterinarioService {

	private final VeterinarioRepository veterinarioRepository;

	public VeterinarioService(VeterinarioRepository veterinarioRepository) {
		this.veterinarioRepository = veterinarioRepository;
	}

	public Veterinario guardar(Veterinario veterinario) {
		validar(veterinario);
		return veterinarioRepository.save(veterinario);
	}

	public List<Veterinario> listarTodos() {
		return veterinarioRepository.findAll();
	}

	public Veterinario obtenerPorId(Long id) {
		return veterinarioRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un veterinario con id " + id));
	}

	public Veterinario actualizar(Long id, Veterinario datosNuevos) {
		Veterinario existente = obtenerPorId(id);
		validar(datosNuevos);
		existente.setNombre(datosNuevos.getNombre());
		existente.setTarjetaProfesional(datosNuevos.getTarjetaProfesional());
		existente.setEspecialidad(datosNuevos.getEspecialidad());
		existente.setTelefono(datosNuevos.getTelefono());
		existente.setEmail(datosNuevos.getEmail());
		return veterinarioRepository.save(existente);
	}

	public void eliminar(Long id) {
		Veterinario existente = obtenerPorId(id);
		veterinarioRepository.delete(existente);
	}

	private void validar(Veterinario veterinario) {
		if (veterinario.getNombre() == null || veterinario.getNombre().isBlank()) {
			throw new IllegalArgumentException("El nombre del veterinario es obligatorio.");
		}
		if (veterinario.getTarjetaProfesional() == null || veterinario.getTarjetaProfesional().isBlank()) {
			throw new IllegalArgumentException("La tarjeta profesional del veterinario es obligatoria.");
		}
	}

}
