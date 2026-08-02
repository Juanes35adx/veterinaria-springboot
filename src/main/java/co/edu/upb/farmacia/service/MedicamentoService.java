package co.edu.upb.farmacia.service;

import java.util.List;

import co.edu.upb.farmacia.model.Medicamento;
import co.edu.upb.farmacia.repository.MedicamentoRepository;
import org.springframework.stereotype.Service;

@Service
public class MedicamentoService {

	private final MedicamentoRepository medicamentoRepository;

	public MedicamentoService(MedicamentoRepository medicamentoRepository) {
		this.medicamentoRepository = medicamentoRepository;
	}

	/**
	 * Valida las reglas de negocio y persiste el medicamento en la base de datos.
	 *
	 * @throws IllegalArgumentException si el precio es menor o igual a cero,
	 *                                  o si la cantidad en inventario es negativa.
	 */
	public Medicamento guardar(Medicamento medicamento) {
		if (medicamento.getPrecio() <= 0) {
			throw new IllegalArgumentException("El precio del medicamento debe ser mayor a cero.");
		}
		if (medicamento.getCantidadInventario() < 0) {
			throw new IllegalArgumentException("La cantidad en inventario no puede ser negativa.");
		}
		return medicamentoRepository.save(medicamento);
	}

	public List<Medicamento> listarTodos() {
		return medicamentoRepository.findAll();
	}

}
