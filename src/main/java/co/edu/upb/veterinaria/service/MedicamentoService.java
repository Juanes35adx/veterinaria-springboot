package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Medicamento;
import co.edu.upb.veterinaria.repository.MedicamentoRepository;
import org.springframework.stereotype.Service;

@Service
public class MedicamentoService {

	private final MedicamentoRepository medicamentoRepository;

	public MedicamentoService(MedicamentoRepository medicamentoRepository) {
		this.medicamentoRepository = medicamentoRepository;
	}

	public Medicamento guardar(Medicamento medicamento) {
		validar(medicamento);
		return medicamentoRepository.save(medicamento);
	}

	public List<Medicamento> listarTodos() {
		return medicamentoRepository.findAll();
	}

	public Medicamento obtenerPorId(Long id) {
		return medicamentoRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un medicamento con id " + id));
	}

	public Medicamento actualizar(Long id, Medicamento datosNuevos) {
		Medicamento existente = obtenerPorId(id);
		validar(datosNuevos);
		existente.setNombre(datosNuevos.getNombre());
		existente.setPrincipioActivo(datosNuevos.getPrincipioActivo());
		existente.setPresentacion(datosNuevos.getPresentacion());
		existente.setPrecio(datosNuevos.getPrecio());
		existente.setStock(datosNuevos.getStock());
		existente.setStockMinimo(datosNuevos.getStockMinimo());
		return medicamentoRepository.save(existente);
	}

	public void eliminar(Long id) {
		Medicamento existente = obtenerPorId(id);
		medicamentoRepository.delete(existente);
	}

	private void validar(Medicamento medicamento) {
		if (medicamento.getNombre() == null || medicamento.getNombre().isBlank()) {
			throw new IllegalArgumentException("El nombre del medicamento es obligatorio.");
		}
		if (medicamento.getPrecio() < 0) {
			throw new IllegalArgumentException("El precio del medicamento no puede ser negativo.");
		}
		if (medicamento.getStock() < 0) {
			throw new IllegalArgumentException("El stock del medicamento no puede ser negativo.");
		}
	}

}
