package co.edu.upb.veterinaria.repository;

import java.util.List;

import co.edu.upb.veterinaria.model.Diagnostico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiagnosticoRepository extends JpaRepository<Diagnostico, Long> {

	List<Diagnostico> findByConsultaId(Long consultaId);

}
