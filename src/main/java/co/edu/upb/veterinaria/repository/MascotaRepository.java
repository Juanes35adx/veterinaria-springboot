package co.edu.upb.veterinaria.repository;

import java.util.List;

import co.edu.upb.veterinaria.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {

	/**
	 * Spring Data JPA genera la consulta solo a partir del nombre del metodo:
	 * "busca todas las Mascota cuyo cliente.id sea el que se pasa".
	 */
	List<Mascota> findByClienteId(Long clienteId);

}
