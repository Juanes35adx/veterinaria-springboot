package co.edu.upb.veterinaria.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Representa al personal médico veterinario que atiende las consultas.
 */
@Entity
public class Veterinario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nombre;

	private String tarjetaProfesional;

	private String especialidad;

	private String telefono;

	private String email;

	public Veterinario() {
	}

	public Veterinario(String nombre, String tarjetaProfesional, String especialidad, String telefono, String email) {
		this.nombre = nombre;
		this.tarjetaProfesional = tarjetaProfesional;
		this.especialidad = especialidad;
		this.telefono = telefono;
		this.email = email;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getTarjetaProfesional() {
		return tarjetaProfesional;
	}

	public void setTarjetaProfesional(String tarjetaProfesional) {
		this.tarjetaProfesional = tarjetaProfesional;
	}

	public String getEspecialidad() {
		return especialidad;
	}

	public void setEspecialidad(String especialidad) {
		this.especialidad = especialidad;
	}

	public String getTelefono() {
		return telefono;
	}

	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "Veterinario{id=" + id + ", nombre='" + nombre + '\'' + ", tarjetaProfesional='" + tarjetaProfesional + '\'' + '}';
	}

}
