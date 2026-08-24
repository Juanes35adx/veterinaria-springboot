package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.model.Medicamento;
import co.edu.upb.veterinaria.model.Prescripcion;
import co.edu.upb.veterinaria.repository.ConsultaMedicaRepository;
import co.edu.upb.veterinaria.repository.MedicamentoRepository;
import co.edu.upb.veterinaria.repository.PrescripcionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PrescripcionService {

	private final PrescripcionRepository prescripcionRepository;
	private final ConsultaMedicaRepository consultaMedicaRepository;
	private final MedicamentoRepository medicamentoRepository;

	public PrescripcionService(PrescripcionRepository prescripcionRepository,
							  ConsultaMedicaRepository consultaMedicaRepository,
							  MedicamentoRepository medicamentoRepository) {
		this.prescripcionRepository = prescripcionRepository;
		this.consultaMedicaRepository = consultaMedicaRepository;
		this.medicamentoRepository = medicamentoRepository;
	}

	@Transactional
	public Prescripcion guardar(Prescripcion prescripcion) {
		validar(prescripcion);
		ConsultaMedica consulta = resolverConsultaExistente(prescripcion);
		Medicamento medicamento = resolverMedicamentoExistente(prescripcion);

		if (medicamento.getStock() < prescripcion.getCantidad()) {
			throw new IllegalArgumentException("Stock insuficiente para el medicamento '" + medicamento.getNombre()
					+ "'. Disponible: " + medicamento.getStock() + ", Solicitado: " + prescripcion.getCantidad());
		}

		// Descuenta del stock de farmacia
		medicamento.setStock(medicamento.getStock() - prescripcion.getCantidad());
		medicamentoRepository.save(medicamento);

		prescripcion.setConsulta(consulta);
		prescripcion.setMedicamento(medicamento);
		return prescripcionRepository.save(prescripcion);
	}

	public List<Prescripcion> listarTodas() {
		return prescripcionRepository.findAll();
	}

	public Prescripcion obtenerPorId(Long id) {
		return prescripcionRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe una prescripcion con id " + id));
	}

	public List<Prescripcion> listarPorConsulta(Long consultaId) {
		if (!consultaMedicaRepository.existsById(consultaId)) {
			throw new RecursoNoEncontradoException("No existe una consulta medica con id " + consultaId);
		}
		return prescripcionRepository.findByConsultaId(consultaId);
	}

	@Transactional
	public void eliminar(Long id) {
		Prescripcion existente = obtenerPorId(id);
		// Devuelve la cantidad al stock del medicamento al cancelar/eliminar la receta
		Medicamento med = existente.getMedicamento();
		med.setStock(med.getStock() + existente.getCantidad());
		medicamentoRepository.save(med);

		prescripcionRepository.delete(existente);
	}

	private void validar(Prescripcion prescripcion) {
		if (prescripcion.getDosis() == null || prescripcion.getDosis().isBlank()) {
			throw new IllegalArgumentException("La dosis de la prescripcion es obligatoria.");
		}
		if (prescripcion.getCantidad() <= 0) {
			throw new IllegalArgumentException("La cantidad recetada debe ser mayor a 0.");
		}
	}

	private ConsultaMedica resolverConsultaExistente(Prescripcion prescripcion) {
		if (prescripcion.getConsulta() == null || prescripcion.getConsulta().getId() == null) {
			throw new IllegalArgumentException("Debe indicar el id de la consulta medica.");
		}
		Long consultaId = prescripcion.getConsulta().getId();
		return consultaMedicaRepository.findById(consultaId)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe una consulta medica con id " + consultaId));
	}

	private Medicamento resolverMedicamentoExistente(Prescripcion prescripcion) {
		if (prescripcion.getMedicamento() == null || prescripcion.getMedicamento().getId() == null) {
			throw new IllegalArgumentException("Debe indicar el id del medicamento.");
		}
		Long medId = prescripcion.getMedicamento().getId();
		return medicamentoRepository.findById(medId)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un medicamento con id " + medId));
	}

}
