package co.edu.upb.veterinaria.repository;

import java.util.List;

import co.edu.upb.veterinaria.model.ConsultaMedica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultaMedicaRepository extends JpaRepository<ConsultaMedica, Long> {

	List<ConsultaMedica> findByMascotaId(Long mascotaId);

	List<ConsultaMedica> findByVeterinarioId(Long veterinarioId);

}
