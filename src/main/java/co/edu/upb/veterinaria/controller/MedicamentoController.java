package co.edu.upb.veterinaria.controller;

import java.util.List;

import co.edu.upb.veterinaria.model.Medicamento;
import co.edu.upb.veterinaria.service.MedicamentoService;
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
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

	private final MedicamentoService medicamentoService;

	public MedicamentoController(MedicamentoService medicamentoService) {
		this.medicamentoService = medicamentoService;
	}

	@PostMapping
	public ResponseEntity<Medicamento> crear(@RequestBody Medicamento medicamento) {
		Medicamento guardado = medicamentoService.guardar(medicamento);
		return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
	}

	@GetMapping
	public ResponseEntity<List<Medicamento>> listar() {
		return ResponseEntity.ok(medicamentoService.listarTodos());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Medicamento> obtener(@PathVariable Long id) {
		return ResponseEntity.ok(medicamentoService.obtenerPorId(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Medicamento> actualizar(@PathVariable Long id, @RequestBody Medicamento medicamento) {
		return ResponseEntity.ok(medicamentoService.actualizar(id, medicamento));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		medicamentoService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

}
