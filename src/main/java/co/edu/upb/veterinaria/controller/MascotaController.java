package co.edu.upb.veterinaria.controller;

import java.util.List;

import co.edu.upb.veterinaria.model.Mascota;
import co.edu.upb.veterinaria.service.MascotaService;
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
@RequestMapping("/api/mascotas")
public class MascotaController {

	private final MascotaService mascotaService;

	public MascotaController(MascotaService mascotaService) {
		this.mascotaService = mascotaService;
	}

	@PostMapping
	public ResponseEntity<Mascota> crear(@RequestBody Mascota mascota) {
		Mascota guardada = mascotaService.guardar(mascota);
		return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
	}

	@GetMapping
	public ResponseEntity<List<Mascota>> listar() {
		return ResponseEntity.ok(mascotaService.listarTodas());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Mascota> obtener(@PathVariable Long id) {
		return ResponseEntity.ok(mascotaService.obtenerPorId(id));
	}

	@GetMapping("/cliente/{clienteId}")
	public ResponseEntity<List<Mascota>> listarPorCliente(@PathVariable Long clienteId) {
		return ResponseEntity.ok(mascotaService.listarPorCliente(clienteId));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Mascota> actualizar(@PathVariable Long id, @RequestBody Mascota mascota) {
		return ResponseEntity.ok(mascotaService.actualizar(id, mascota));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		mascotaService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

}
