package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService {

	private final ClienteRepository clienteRepository;

	public ClienteService(ClienteRepository clienteRepository) {
		this.clienteRepository = clienteRepository;
	}

	public Cliente guardar(Cliente cliente) {
		validar(cliente);
		return clienteRepository.save(cliente);
	}

	public List<Cliente> listarTodos() {
		return clienteRepository.findAll();
	}

	public Cliente obtenerPorId(Long id) {
		return clienteRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un cliente con id " + id));
	}

	public Cliente actualizar(Long id, Cliente datosNuevos) {
		Cliente existente = obtenerPorId(id);
		validar(datosNuevos);
		existente.setNombre(datosNuevos.getNombre());
		existente.setTelefono(datosNuevos.getTelefono());
		existente.setEmail(datosNuevos.getEmail());
		return clienteRepository.save(existente);
	}

	public void eliminar(Long id) {
		Cliente existente = obtenerPorId(id);
		clienteRepository.delete(existente);
	}

	private void validar(Cliente cliente) {
		if (cliente.getNombre() == null || cliente.getNombre().isBlank()) {
			throw new IllegalArgumentException("El nombre del cliente es obligatorio.");
		}
		if (cliente.getTelefono() == null || cliente.getTelefono().isBlank()) {
			throw new IllegalArgumentException("El telefono del cliente es obligatorio.");
		}
	}

}
