package co.edu.upb.veterinaria.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Medicamento recetado durante una ConsultaMedica.
 */
@Entity
public class Prescripcion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "consulta_id")
	private ConsultaMedica consulta;

	@ManyToOne
	@JoinColumn(name = "medicamento_id")
	private Medicamento medicamento;

	private String dosis;

	private String duracion;

	private int cantidad;

	public Prescripcion() {
	}

	/**
	 * Constructor de conveniencia para codigo Java y tests. Se marca como
	 * DISABLED para que Jackson use el constructor vacio + setters al leer
	 * JSON, y no falle al recibir referencias parciales como {"id": 1}.
	 */
	@JsonCreator(mode = JsonCreator.Mode.DISABLED)
	public Prescripcion(ConsultaMedica consulta, Medicamento medicamento, String dosis, String duracion, int cantidad) {
		this.consulta = consulta;
		this.medicamento = medicamento;
		this.dosis = dosis;
		this.duracion = duracion;
		this.cantidad = cantidad;
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

	public Medicamento getMedicamento() {
		return medicamento;
	}

	public void setMedicamento(Medicamento medicamento) {
		this.medicamento = medicamento;
	}

	public String getDosis() {
		return dosis;
	}

	public void setDosis(String dosis) {
		this.dosis = dosis;
	}

	public String getDuracion() {
		return duracion;
	}

	public void setDuracion(String duracion) {
		this.duracion = duracion;
	}

	public int getCantidad() {
		return cantidad;
	}

	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}

	@Override
	public String toString() {
		return "Prescripcion{id=" + id + ", dosis='" + dosis + '\'' + ", cantidad=" + cantidad + '}';
	}

}
