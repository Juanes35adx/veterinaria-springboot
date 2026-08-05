package co.edu.upb.farmacia.controller;

import java.util.List;

import co.edu.upb.farmacia.model.Medicamento;
import co.edu.upb.farmacia.service.MedicamentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

}