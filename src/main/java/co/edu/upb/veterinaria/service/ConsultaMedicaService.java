package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.model.Mascota;
import co.edu.upb.veterinaria.model.Veterinario;
import co.edu.upb.veterinaria.repository.ConsultaMedicaRepository;
import co.edu.upb.veterinaria.repository.MascotaRepository;
import co.edu.upb.veterinaria.repository.VeterinarioRepository;
import org.springframework.stereotype.Service;

@Service
public class ConsultaMedicaService {

	private final ConsultaMedicaRepository consultaMedicaRepository;
	private final MascotaRepository mascotaRepository;
	private final VeterinarioRepository veterinarioRepository;

	public ConsultaMedicaService(ConsultaMedicaRepository consultaMedicaRepository,
								 MascotaRepository mascotaRepository,
								 VeterinarioRepository veterinarioRepository) {
		this.consultaMedicaRepository = consultaMedicaRepository;
		this.mascotaRepository = mascotaRepository;
		this.veterinarioRepository = veterinarioRepository;
	}

	public ConsultaMedica guardar(ConsultaMedica consulta) {
		validarDatosBasicos(consulta);
		consulta.setMascota(resolverMascotaExistente(consulta));
		consulta.setVeterinario(resolverVeterinarioExistente(consulta));
		return consultaMedicaRepository.save(consulta);
	}

	public List<ConsultaMedica> listarTodas() {
		return consultaMedicaRepository.findAll();
	}

	public ConsultaMedica obtenerPorId(Long id) {
		return consultaMedicaRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe una consulta medica con id " + id));
	}

	public List<ConsultaMedica> listarPorMascota(Long mascotaId) {
		if (!mascotaRepository.existsById(mascotaId)) {
			throw new RecursoNoEncontradoException("No existe una mascota con id " + mascotaId);
		}
		return consultaMedicaRepository.findByMascotaId(mascotaId);
	}

	public List<ConsultaMedica> listarPorVeterinario(Long veterinarioId) {
		if (!veterinarioRepository.existsById(veterinarioId)) {
			throw new RecursoNoEncontradoException("No existe un veterinario con id " + veterinarioId);
		}
		return consultaMedicaRepository.findByVeterinarioId(veterinarioId);
	}

	public ConsultaMedica actualizar(Long id, ConsultaMedica datosNuevos) {
		ConsultaMedica existente = obtenerPorId(id);
		validarDatosBasicos(datosNuevos);
		existente.setMascota(resolverMascotaExistente(datosNuevos));
		existente.setVeterinario(resolverVeterinarioExistente(datosNuevos));
		if (datosNuevos.getFechaHora() != null) {
			existente.setFechaHora(datosNuevos.getFechaHora());
		}
		existente.setMotivo(datosNuevos.getMotivo());
		existente.setPesoKg(datosNuevos.getPesoKg());
		existente.setTemperaturaC(datosNuevos.getTemperaturaC());
		existente.setObservaciones(datosNuevos.getObservaciones());
		return consultaMedicaRepository.save(existente);
	}

	public void eliminar(Long id) {
		ConsultaMedica existente = obtenerPorId(id);
		consultaMedicaRepository.delete(existente);
	}

	private void validarDatosBasicos(ConsultaMedica consulta) {
		if (consulta.getMotivo() == null || consulta.getMotivo().isBlank()) {
			throw new IllegalArgumentException("El motivo de la consulta es obligatorio.");
		}
		if (consulta.getPesoKg() <= 0) {
			throw new IllegalArgumentException("El peso de la mascota debe ser mayor a 0 kg.");
		}
	}

	private Mascota resolverMascotaExistente(ConsultaMedica consulta) {
		if (consulta.getMascota() == null || consulta.getMascota().getId() == null) {
			throw new IllegalArgumentException("Debe indicar el id de la mascota.");
		}
		Long mascotaId = consulta.getMascota().getId();
		return mascotaRepository.findById(mascotaId)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe una mascota con id " + mascotaId));
	}

	private Veterinario resolverVeterinarioExistente(ConsultaMedica consulta) {
		if (consulta.getVeterinario() == null || consulta.getVeterinario().getId() == null) {
			throw new IllegalArgumentException("Debe indicar el id del veterinario.");
		}
		Long vetId = consulta.getVeterinario().getId();
		return veterinarioRepository.findById(vetId)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un veterinario con id " + vetId));
	}

}
