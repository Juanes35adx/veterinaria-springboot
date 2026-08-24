package co.edu.upb.veterinaria.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Medicamento o insumo en el almacén de la farmacia veterinaria.
 */
@Entity
public class Medicamento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nombre;

	private String principioActivo;

	private String presentacion;

	private double precio;

	private int stock;

	private int stockMinimo;

	public Medicamento() {
	}

	/**
	 * Constructor de conveniencia para codigo Java y tests. Se marca como
	 * DISABLED para que Jackson use el constructor vacio + setters al leer
	 * JSON, y no falle al recibir referencias parciales como {"id": 4}.
	 */
	@JsonCreator(mode = JsonCreator.Mode.DISABLED)
	public Medicamento(String nombre, String principioActivo, String presentacion, double precio, int stock, int stockMinimo) {
		this.nombre = nombre;
		this.principioActivo = principioActivo;
		this.presentacion = presentacion;
		this.precio = precio;
		this.stock = stock;
		this.stockMinimo = stockMinimo;
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

	public String getPrincipioActivo() {
		return principioActivo;
	}

	public void setPrincipioActivo(String principioActivo) {
		this.principioActivo = principioActivo;
	}

	public String getPresentacion() {
		return presentacion;
	}

	public void setPresentacion(String presentacion) {
		this.presentacion = presentacion;
	}

	public double getPrecio() {
		return precio;
	}

	public void setPrecio(double precio) {
		this.precio = precio;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public int getStockMinimo() {
		return stockMinimo;
	}

	public void setStockMinimo(int stockMinimo) {
		this.stockMinimo = stockMinimo;
	}

	@Override
	public String toString() {
		return "Medicamento{id=" + id + ", nombre='" + nombre + '\'' + ", stock=" + stock + '}';
	}

}
