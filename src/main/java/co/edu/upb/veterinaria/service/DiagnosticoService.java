package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.model.Diagnostico;
import co.edu.upb.veterinaria.repository.ConsultaMedicaRepository;
import co.edu.upb.veterinaria.repository.DiagnosticoRepository;
import org.springframework.stereotype.Service;

@Service
public class DiagnosticoService {

	private final DiagnosticoRepository diagnosticoRepository;
	private final ConsultaMedicaRepository consultaMedicaRepository;

	public DiagnosticoService(DiagnosticoRepository diagnosticoRepository, ConsultaMedicaRepository consultaMedicaRepository) {
		this.diagnosticoRepository = diagnosticoRepository;
		this.consultaMedicaRepository = consultaMedicaRepository;
	}

	public Diagnostico guardar(Diagnostico diagnostico) {
		validar(diagnostico);
		diagnostico.setConsulta(resolverConsultaExistente(diagnostico));
		return diagnosticoRepository.save(diagnostico);
	}

	public List<Diagnostico> listarTodos() {
		return diagnosticoRepository.findAll();
	}

	public Diagnostico obtenerPorId(Long id) {
		return diagnosticoRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un diagnostico con id " + id));
	}

	public List<Diagnostico> listarPorConsulta(Long consultaId) {
		if (!consultaMedicaRepository.existsById(consultaId)) {
			throw new RecursoNoEncontradoException("No existe una consulta medica con id " + consultaId);
		}
		return diagnosticoRepository.findByConsultaId(consultaId);
	}

	public Diagnostico actualizar(Long id, Diagnostico datosNuevos) {
		Diagnostico existente = obtenerPorId(id);
		validar(datosNuevos);
		existente.setConsulta(resolverConsultaExistente(datosNuevos));
		existente.setDescripcion(datosNuevos.getDescripcion());
		existente.setGravedad(datosNuevos.getGravedad());
		existente.setTratamiento(datosNuevos.getTratamiento());
		return diagnosticoRepository.save(existente);
	}

	public void eliminar(Long id) {
		Diagnostico existente = obtenerPorId(id);
		diagnosticoRepository.delete(existente);
	}

	private void validar(Diagnostico diagnostico) {
		if (diagnostico.getDescripcion() == null || diagnostico.getDescripcion().isBlank()) {
			throw new IllegalArgumentException("La descripcion del diagnostico es obligatoria.");
		}
	}

	private ConsultaMedica resolverConsultaExistente(Diagnostico diagnostico) {
		if (diagnostico.getConsulta() == null || diagnostico.getConsulta().getId() == null) {
			throw new IllegalArgumentException("Debe indicar el id de la consulta medica.");
		}
		Long consultaId = diagnostico.getConsulta().getId();
		return consultaMedicaRepository.findById(consultaId)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe una consulta medica con id " + consultaId));
	}

}
