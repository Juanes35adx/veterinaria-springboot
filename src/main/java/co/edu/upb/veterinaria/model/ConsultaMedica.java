package co.edu.upb.veterinaria.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

/**
 * Consulta médica realizada a una Mascota por un Veterinario.
 */
@Entity
public class ConsultaMedica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "mascota_id")
	private Mascota mascota;

	@ManyToOne
	@JoinColumn(name = "veterinario_id")
	private Veterinario veterinario;

	private LocalDateTime fechaHora;

	private String motivo;

	private double pesoKg;

	private double temperaturaC;

	private String observaciones;

	public ConsultaMedica() {
	}

	/**
	 * Constructor de conveniencia para codigo Java y tests. Se marca como
	 * DISABLED para que Jackson use el constructor vacio + setters al leer
	 * JSON, y no falle al recibir referencias parciales como {"id": 1}.
	 */
	@JsonCreator(mode = JsonCreator.Mode.DISABLED)
	public ConsultaMedica(Mascota mascota, Veterinario veterinario, String motivo, double pesoKg, double temperaturaC, String observaciones) {
		this.mascota = mascota;
		this.veterinario = veterinario;
		this.motivo = motivo;
		this.pesoKg = pesoKg;
		this.temperaturaC = temperaturaC;
		this.observaciones = observaciones;
	}

	@PrePersist
	public void prePersist() {
		if (this.fechaHora == null) {
			this.fechaHora = LocalDateTime.now();
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Mascota getMascota() {
		return mascota;
	}

	public void setMascota(Mascota mascota) {
		this.mascota = mascota;
	}

	public Veterinario getVeterinario() {
		return veterinario;
	}

	public void setVeterinario(Veterinario veterinario) {
		this.veterinario = veterinario;
	}

	public LocalDateTime getFechaHora() {
		return fechaHora;
	}

	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}

	public double getPesoKg() {
		return pesoKg;
	}

	public void setPesoKg(double pesoKg) {
		this.pesoKg = pesoKg;
	}

	public double getTemperaturaC() {
		return temperaturaC;
	}

	public void setTemperaturaC(double temperaturaC) {
		this.temperaturaC = temperaturaC;
	}

	public String getObservaciones() {
		return observaciones;
	}

	public void setObservaciones(String observaciones) {
		this.observaciones = observaciones;
	}

	@Override
	public String toString() {
		return "ConsultaMedica{id=" + id + ", fechaHora=" + fechaHora + ", motivo='" + motivo + '\'' + '}';
	}

}
