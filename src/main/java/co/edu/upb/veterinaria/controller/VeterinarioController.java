package co.edu.upb.veterinaria.controller;

import java.util.List;

import co.edu.upb.veterinaria.model.Veterinario;
import co.edu.upb.veterinaria.service.VeterinarioService;
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
@RequestMapping("/api/veterinarios")
public class VeterinarioController {

	private final VeterinarioService veterinarioService;

	public VeterinarioController(VeterinarioService veterinarioService) {
		this.veterinarioService = veterinarioService;
	}

	@PostMapping
	public ResponseEntity<Veterinario> crear(@RequestBody Veterinario veterinario) {
		Veterinario guardado = veterinarioService.guardar(veterinario);
		return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
	}

	@GetMapping
	public ResponseEntity<List<Veterinario>> listar() {
		return ResponseEntity.ok(veterinarioService.listarTodos());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Veterinario> obtener(@PathVariable Long id) {
		return ResponseEntity.ok(veterinarioService.obtenerPorId(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Veterinario> actualizar(@PathVariable Long id, @RequestBody Veterinario veterinario) {
		return ResponseEntity.ok(veterinarioService.actualizar(id, veterinario));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		veterinarioService.eliminar(id);
		return ResponseEntity.noContent().build();
	}

}
