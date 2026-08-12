package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.model.Mascota;
import co.edu.upb.veterinaria.repository.ClienteRepository;
import co.edu.upb.veterinaria.repository.MascotaRepository;
import org.springframework.stereotype.Service;

@Service
public class MascotaService {

	private final MascotaRepository mascotaRepository;
	private final ClienteRepository clienteRepository;

	public MascotaService(MascotaRepository mascotaRepository, ClienteRepository clienteRepository) {
		this.mascotaRepository = mascotaRepository;
		this.clienteRepository = clienteRepository;
	}

	public Mascota guardar(Mascota mascota) {
		validarDatosBasicos(mascota);
		mascota.setCliente(resolverClienteExistente(mascota));
		return mascotaRepository.save(mascota);
	}

	public List<Mascota> listarTodas() {
		return mascotaRepository.findAll();
	}

	public List<Mascota> listarPorCliente(Long clienteId) {
		// Verifica que el cliente exista antes de buscar sus mascotas,
		// para devolver un 404 claro en vez de una lista vacia engañosa.
		if (!clienteRepository.existsById(clienteId)) {
			throw new RecursoNoEncontradoException("No existe un cliente con id " + clienteId);
		}
		return mascotaRepository.findByClienteId(clienteId);
	}

	public Mascota obtenerPorId(Long id) {
		return mascotaRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe una mascota con id " + id));
	}

	public Mascota actualizar(Long id, Mascota datosNuevos) {
		Mascota existente = obtenerPorId(id);
		validarDatosBasicos(datosNuevos);
		existente.setNombre(datosNuevos.getNombre());
		existente.setEspecie(datosNuevos.getEspecie());
		existente.setRaza(datosNuevos.getRaza());
		existente.setEdad(datosNuevos.getEdad());
		existente.setCliente(resolverClienteExistente(datosNuevos));
		return mascotaRepository.save(existente);
	}

	public void eliminar(Long id) {
		Mascota existente = obtenerPorId(id);
		mascotaRepository.delete(existente);
	}

	private void validarDatosBasicos(Mascota mascota) {
		if (mascota.getNombre() == null || mascota.getNombre().isBlank()) {
			throw new IllegalArgumentException("El nombre de la mascota es obligatorio.");
		}
		if (mascota.getEdad() < 0) {
			throw new IllegalArgumentException("La edad de la mascota no puede ser negativa.");
		}
	}

	/**
	 * El cliente que llega en el JSON solo trae el id (ej. {"id": 3}).
	 * Aqui se busca el Cliente real en la base de datos para confirmar
	 * que existe, y se reemplaza la referencia parcial por la completa.
	 */
	private Cliente resolverClienteExistente(Mascota mascota) {
		if (mascota.getCliente() == null || mascota.getCliente().getId() == null) {
			throw new IllegalArgumentException("Debe indicar el id del cliente dueño de la mascota.");
		}
		Long clienteId = mascota.getCliente().getId();
		return clienteRepository.findById(clienteId)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un cliente con id " + clienteId));
	}

}
