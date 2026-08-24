package co.edu.upb.veterinaria.service;

import java.util.List;

import co.edu.upb.veterinaria.exception.RecursoNoEncontradoException;
import co.edu.upb.veterinaria.model.Usuario;
import co.edu.upb.veterinaria.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * Registra un usuario nuevo, cifrando su contraseña antes de guardarla.
	 */
	public Usuario registrar(Usuario usuario) {
		validar(usuario);
		if (usuarioRepository.existsByUsername(usuario.getUsername())) {
			throw new IllegalArgumentException("Ya existe un usuario con el username '" + usuario.getUsername() + "'.");
		}
		usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
		return usuarioRepository.save(usuario);
	}

	/**
	 * Comprueba las credenciales de inicio de sesion.
	 *
	 * @return el usuario si la contraseña coincide.
	 * @throws CredencialesInvalidasException si el usuario no existe o la clave no coincide.
	 */
	public Usuario autenticar(String username, String password) {
		Usuario usuario = usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new CredencialesInvalidasException("Usuario o contraseña incorrectos."));

		if (!passwordEncoder.matches(password, usuario.getPassword())) {
			throw new CredencialesInvalidasException("Usuario o contraseña incorrectos.");
		}
		return usuario;
	}

	public List<Usuario> listarTodos() {
		return usuarioRepository.findAll();
	}

	public Usuario obtenerPorId(Long id) {
		return usuarioRepository.findById(id)
				.orElseThrow(() -> new RecursoNoEncontradoException("No existe un usuario con id " + id));
	}

	public void eliminar(Long id) {
		Usuario existente = obtenerPorId(id);
		usuarioRepository.delete(existente);
	}

	private void validar(Usuario usuario) {
		if (usuario.getUsername() == null || usuario.getUsername().isBlank()) {
			throw new IllegalArgumentException("El username es obligatorio.");
		}
		if (usuario.getPassword() == null || usuario.getPassword().length() < 4) {
			throw new IllegalArgumentException("La contraseña debe tener al menos 4 caracteres.");
		}
		if (usuario.getRol() == null) {
			throw new IllegalArgumentException("El rol del usuario es obligatorio.");
		}
	}

}
