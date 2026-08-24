package co.edu.upb.veterinaria.controller;

import java.util.List;

import co.edu.upb.veterinaria.model.Diagnostico;
import co.edu.upb.veterinaria.service.DiagnosticoService;
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
@RequestMapping("/api/diagnosticos")
public class DiagnosticoController {

	private final DiagnosticoService diagnosticoService;

	public DiagnosticoController(DiagnosticoService diagnosticoService) {
		this.diagnosticoService = diagnosticoService;
	}

	@PostMapping
	public ResponseEntity<Diagnostico> crear(@RequestBody Diagnostico diagnostico) {
		Diagnostico guardado = diagnosticoService.guardar(diagnostico);
		return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
	}

	@GetMapping
	public ResponseEntity<List<Diagnostico>> listar() {
		return ResponseEntity.ok(diagnosticoService.listarTodos());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Diagnostico> obtener(@PathVariable Long id) {
		return ResponseEntity.ok(diagnosticoService.obtenerPorId(id));
	}

	@GetMapping("/consulta/{consultaId}")
	public ResponseEntity<List<Diagnostico>> listarPorConsulta(@PathVariable Long consultaId) {
		return ResponseEntity.ok(diagnosticoService.listarPorConsulta(consultaId));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Diagnostico> actualizar(@PathVariable Long id, @RequestBody Diagnostico diagnostico) {
		return ResponseEntity.ok(diagnosticoService.actualizar(id, diagnostico));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		diagnosticoService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

}
