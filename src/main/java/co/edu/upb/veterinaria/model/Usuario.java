package co.edu.upb.veterinaria.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Usuario que puede autenticarse en la API.
 *
 * La contraseña se guarda siempre cifrada con BCrypt (nunca en texto plano)
 * y se marca con @JsonIgnore para que jamas salga en una respuesta JSON.
 */
@Entity
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String username;

	@JsonIgnore
	@Column(nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Rol rol;

	private String nombreCompleto;

	public Usuario() {
	}

	/**
	 * Constructor de conveniencia para codigo Java y tests. Se marca como
	 * DISABLED para que Jackson use el constructor vacio + setters al leer JSON.
	 */
	@JsonCreator(mode = JsonCreator.Mode.DISABLED)
	public Usuario(String username, String password, Rol rol, String nombreCompleto) {
		this.username = username;
		this.password = password;
		this.rol = rol;
		this.nombreCompleto = nombreCompleto;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Rol getRol() {
		return rol;
	}

	public void setRol(Rol rol) {
		this.rol = rol;
	}

	public String getNombreCompleto() {
		return nombreCompleto;
	}

	public void setNombreCompleto(String nombreCompleto) {
		this.nombreCompleto = nombreCompleto;
	}

	@Override
	public String toString() {
		return "Usuario{id=" + id + ", username='" + username + '\'' + ", rol=" + rol + '}';
	}

}
