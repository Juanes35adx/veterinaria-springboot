package co.edu.upb.veterinaria.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
 * Una mascota, siempre asociada a un Cliente (su dueño).
 *
 * La relacion es unidireccional (Mascota conoce a su Cliente, pero Cliente
 * no carga la lista de sus mascotas) para mantenerlo simple y evitar
 * problemas de serializacion JSON con relaciones ciclicas.
 */
@Entity
public class Mascota {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nombre;

	private String especie;

	private String raza;

	private int edad;

	@ManyToOne
	@JoinColumn(name = "cliente_id")
	private Cliente cliente;

	public Mascota() {
	}

	/**
	 * Constructor de conveniencia para usar desde codigo Java y tests.
	 *
	 * Se marca como DISABLED para que Jackson NO lo use al deserializar JSON:
	 * debe usar el constructor vacio + los setters. De lo contrario, una
	 * referencia parcial como {"id": 2} intentaria pasar null al parametro
	 * primitivo 'edad' y la peticion fallaria con 400.
	 */
	@JsonCreator(mode = JsonCreator.Mode.DISABLED)
	public Mascota(String nombre, String especie, String raza, int edad, Cliente cliente) {
		this.nombre = nombre;
		this.especie = especie;
		this.raza = raza;
		this.edad = edad;
		this.cliente = cliente;
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

	public String getEspecie() {
		return especie;
	}

	public void setEspecie(String especie) {
		this.especie = especie;
	}

	public String getRaza() {
		return raza;
	}

	public void setRaza(String raza) {
		this.raza = raza;
	}

	public int getEdad() {
		return edad;
	}

	public void setEdad(int edad) {
		this.edad = edad;
	}

	public Cliente getCliente() {
		return cliente;
	}

	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}

	@Override
	public String toString() {
		return "Mascota{id=" + id + ", nombre='" + nombre + '\'' + ", especie='" + especie + '\'' + '}';
	}

}
