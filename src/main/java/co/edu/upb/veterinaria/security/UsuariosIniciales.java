package co.edu.upb.veterinaria.security;

import co.edu.upb.veterinaria.model.Rol;
import co.edu.upb.veterinaria.model.Usuario;
import co.edu.upb.veterinaria.repository.UsuarioRepository;
import co.edu.upb.veterinaria.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Crea un usuario de cada rol la primera vez que arranca la aplicacion,
 * para poder probar la API sin tener que insertar usuarios a mano.
 *
 * Si el usuario ya existe no hace nada, asi que es seguro reiniciar.
 */
@Component
public class UsuariosIniciales implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(UsuariosIniciales.class);

	private final UsuarioService usuarioService;
	private final UsuarioRepository usuarioRepository;

	public UsuariosIniciales(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
		this.usuarioService = usuarioService;
		this.usuarioRepository = usuarioRepository;
	}

	@Override
	public void run(String... args) {
		crearSiNoExiste("admin", "admin123", Rol.ADMIN, "Administrador del sistema");
		crearSiNoExiste("veterinario", "vet123", Rol.VETERINARIO, "Dra. Ana Ruiz");
		crearSiNoExiste("recepcion", "recep123", Rol.RECEPCIONISTA, "Carlos Mendoza");
	}

	private void crearSiNoExiste(String username, String password, Rol rol, String nombreCompleto) {
		if (usuarioRepository.existsByUsername(username)) {
			return;
		}
		usuarioService.registrar(new Usuario(username, password, rol, nombreCompleto));
		log.info("Usuario inicial creado: {} (rol {})", username, rol);
	}

}
