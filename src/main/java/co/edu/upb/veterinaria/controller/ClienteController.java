package co.edu.upb.veterinaria.controller;

import java.util.List;

import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

	private final ClienteService clienteService;

	public ClienteController(ClienteService clienteService) {
		this.clienteService = clienteService;
	}

	@PostMapping
	public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
		Cliente guardado = clienteService.guardar(cliente);
		return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
	}

	@GetMapping
	public ResponseEntity<List<Cliente>> listar() {
		return ResponseEntity.ok(clienteService.listarTodos());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Cliente> obtener(@PathVariable Long id) {
		return ResponseEntity.ok(clienteService.obtenerPorId(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
		return ResponseEntity.ok(clienteService.actualizar(id, cliente));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		clienteService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

}
