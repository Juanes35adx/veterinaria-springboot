package co.edu.upb.veterinaria.controller;

import java.util.List;

import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.service.ConsultaMedicaService;
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
@RequestMapping("/api/consultas")
public class ConsultaMedicaController {

	private final ConsultaMedicaService consultaMedicaService;

	public ConsultaMedicaController(ConsultaMedicaService consultaMedicaService) {
		this.consultaMedicaService = consultaMedicaService;
	}

	@PostMapping
	public ResponseEntity<ConsultaMedica> crear(@RequestBody ConsultaMedica consulta) {
		ConsultaMedica guardada = consultaMedicaService.guardar(consulta);
		return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
	}

	@GetMapping
	public ResponseEntity<List<ConsultaMedica>> listar() {
		return ResponseEntity.ok(consultaMedicaService.listarTodas());
	}

	@GetMapping("/{id}")
	public ResponseEntity<ConsultaMedica> obtener(@PathVariable Long id) {
		return ResponseEntity.ok(consultaMedicaService.obtenerPorId(id));
	}

	@GetMapping("/mascota/{mascotaId}")
	public ResponseEntity<List<ConsultaMedica>> listarPorMascota(@PathVariable Long mascotaId) {
		return ResponseEntity.ok(consultaMedicaService.listarPorMascota(mascotaId));
	}

	@GetMapping("/veterinario/{veterinarioId}")
	public ResponseEntity<List<ConsultaMedica>> listarPorVeterinario(@PathVariable Long veterinarioId) {
		return ResponseEntity.ok(consultaMedicaService.listarPorVeterinario(veterinarioId));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ConsultaMedica> actualizar(@PathVariable Long id, @RequestBody ConsultaMedica consulta) {
		return ResponseEntity.ok(consultaMedicaService.actualizar(id, consulta));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		consultaMedicaService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

}
