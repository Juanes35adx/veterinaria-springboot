package co.edu.upb.veterinaria.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Diagnóstico o dictamen médico resultante de una ConsultaMedica.
 */
@Entity
public class Diagnostico {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "consulta_id")
	private ConsultaMedica consulta;

	private String descripcion;

	private String gravedad;

	private String tratamiento;

	public Diagnostico() {
	}

	public Diagnostico(ConsultaMedica consulta, String descripcion, String gravedad, String tratamiento) {
		this.consulta = consulta;
		this.descripcion = descripcion;
		this.gravedad = gravedad;
		this.tratamiento = tratamiento;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ConsultaMedica getConsulta() {
		return consulta;
	}

	public void setConsulta(ConsultaMedica consulta) {
		this.consulta = consulta;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getGravedad() {
		return gravedad;
	}

	public void setGravedad(String gravedad) {
		this.gravedad = gravedad;
	}

	public String getTratamiento() {
		return tratamiento;
	}

	public void setTratamiento(String tratamiento) {
		this.tratamiento = tratamiento;
	}

	@Override
	public String toString() {
		return "Diagnostico{id=" + id + ", descripcion='" + descripcion + '\'' + ", gravedad='" + gravedad + '\'' + '}';
	}

}
