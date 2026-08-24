package co.edu.upb.veterinaria.controller;

import java.util.List;

import co.edu.upb.veterinaria.model.Prescripcion;
import co.edu.upb.veterinaria.service.PrescripcionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prescripciones")
public class PrescripcionController {

	private final PrescripcionService prescripcionService;

	public PrescripcionController(PrescripcionService prescripcionService) {
		this.prescripcionService = prescripcionService;
	}

	@PostMapping
	public ResponseEntity<Prescripcion> crear(@RequestBody Prescripcion prescripcion) {
		Prescripcion guardada = prescripcionService.guardar(prescripcion);
		return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
	}

	@GetMapping
	public ResponseEntity<List<Prescripcion>> listar() {
		return ResponseEntity.ok(prescripcionService.listarTodas());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Prescripcion> obtener(@PathVariable Long id) {
		return ResponseEntity.ok(prescripcionService.obtenerPorId(id));
	}

	@GetMapping("/consulta/{consultaId}")
	public ResponseEntity<List<Prescripcion>> listarPorConsulta(@PathVariable Long consultaId) {
		return ResponseEntity.ok(prescripcionService.listarPorConsulta(consultaId));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		prescripcionService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

}
