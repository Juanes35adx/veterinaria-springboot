package co.edu.upb.farmacia.model;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Medicamento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Date fechaExpedicion;

	private String nombre;

	private double precio;

	private int cantidadInventario;

	/**
	 * Constructor vacio, obligatorio para JPA.
	 */
	public Medicamento() {
	}

	public Medicamento(String nombre, double precio, int cantidadInventario, Date fechaExpedicion) {
		this.nombre = nombre;
		this.precio = precio;
		this.cantidadInventario = cantidadInventario;
		this.fechaExpedicion = fechaExpedicion;
	}

	public Medicamento(Long id, String nombre, double precio, int cantidadInventario, Date fechaExpedicion) {
		this.id = id;
		this.nombre = nombre;
		this.precio = precio;
		this.cantidadInventario = cantidadInventario;
		this.fechaExpedicion = fechaExpedicion;
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

	public double getPrecio() {
		return precio;
	}

	public void setPrecio(double precio) {
		this.precio = precio;
	}

	public int getCantidadInventario() {
		return cantidadInventario;
	}

	public void setCantidadInventario(int cantidadInventario) {
		this.cantidadInventario = cantidadInventario;
	}

	public Date getFechaExpedicion() {
		return fechaExpedicion;
	}

	public void setFechaExpedicion(Date fechaExpedicion) {
		this.fechaExpedicion = fechaExpedicion;
	}

	@Override
	public String toString() {
		return "Medicamento{id=" + id
				+ ", nombre='" + nombre + '\''
				+ ", precio=" + precio
				+ ", cantidadInventario=" + cantidadInventario
				+ ", fechaExpedicion=" + fechaExpedicion
				+ '}';
	}

}
