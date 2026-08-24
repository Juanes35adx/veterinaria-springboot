package co.edu.upb.veterinaria.repository;

import java.util.List;

import co.edu.upb.veterinaria.model.Prescripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescripcionRepository extends JpaRepository<Prescripcion, Long> {

	List<Prescripcion> findByConsultaId(Long consultaId);

}
