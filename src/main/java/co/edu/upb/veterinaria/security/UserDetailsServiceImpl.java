package co.edu.upb.veterinaria.security;

import java.util.List;

import co.edu.upb.veterinaria.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Conecta Spring Security con la tabla real "usuario" (via UsuarioRepository).
 *
 * Al existir este bean, Spring Security deja de crear un usuario aleatorio
 * en memoria al arrancar ("Using generated security password..."). No se usa
 * directamente en el login (eso lo hace UsuarioService con BCrypt), pero es
 * la forma estandar de decirle a Spring Security de donde vienen los
 * usuarios reales de la aplicacion.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	private final UsuarioRepository usuarioRepository;

	public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		var usuario = usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("No existe el usuario '" + username + "'."));

		return new User(
				usuario.getUsername(),
				usuario.getPassword(),
				List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())));
	}

}
