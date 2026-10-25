package co.edu.upb.veterinaria.security;

import co.edu.upb.veterinaria.model.Cliente;
import co.edu.upb.veterinaria.model.ConsultaMedica;
import co.edu.upb.veterinaria.model.Diagnostico;
import co.edu.upb.veterinaria.model.Mascota;
import co.edu.upb.veterinaria.model.Medicamento;
import co.edu.upb.veterinaria.model.Veterinario;
import co.edu.upb.veterinaria.repository.ClienteRepository;
import co.edu.upb.veterinaria.repository.ConsultaMedicaRepository;
import co.edu.upb.veterinaria.repository.DiagnosticoRepository;
import co.edu.upb.veterinaria.repository.MascotaRepository;
import co.edu.upb.veterinaria.repository.MedicamentoRepository;
import co.edu.upb.veterinaria.repository.VeterinarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class DatosInicialesDemo implements CommandLineRunner {

	private final ClienteRepository clienteRepository;
	private final MascotaRepository mascotaRepository;
	private final VeterinarioRepository veterinarioRepository;
	private final MedicamentoRepository medicamentoRepository;
	private final ConsultaMedicaRepository consultaMedicaRepository;
	private final DiagnosticoRepository diagnosticoRepository;

	public DatosInicialesDemo(ClienteRepository clienteRepository,
							 MascotaRepository mascotaRepository,
							 VeterinarioRepository veterinarioRepository,
							 MedicamentoRepository medicamentoRepository,
							 ConsultaMedicaRepository consultaMedicaRepository,
							 DiagnosticoRepository diagnosticoRepository) {
		this.clienteRepository = clienteRepository;
		this.mascotaRepository = mascotaRepository;
		this.veterinarioRepository = veterinarioRepository;
		this.medicamentoRepository = medicamentoRepository;
		this.consultaMedicaRepository = consultaMedicaRepository;
		this.diagnosticoRepository = diagnosticoRepository;
	}

	@Override
	public void run(String... args) {
		if (clienteRepository.count() == 0) {
			Cliente c1 = clienteRepository.save(new Cliente("Camila Restrepo", "3001234567", "camila@mail.com"));
			Cliente c2 = clienteRepository.save(new Cliente("Juan Pablo Gomez", "3109876543", "juanpablo@mail.com"));

			Mascota firulais = mascotaRepository.save(new Mascota("Firulais", "Perro", "Labrador", 3, c1));
			mascotaRepository.save(new Mascota("Michi", "Gato", "Siames", 2, c1));
			mascotaRepository.save(new Mascota("Rocky", "Perro", "Pastor Aleman", 4, c2));

			Veterinario carlos = veterinarioRepository.save(new Veterinario("Dr. Carlos Gomez", "TP-88492", "Cirugia y Medicina General", "3109876543", "carlos@vet.com"));
			veterinarioRepository.save(new Veterinario("Dra. Maria Fernandez", "TP-99214", "Dermatologia Veterinaria", "3154567890", "maria@vet.com"));

			medicamentoRepository.save(new Medicamento("Amoxicilina 500mg", "Amoxicilina", "Caja x 20 tabletas", 25000.0, 45, 10));
			medicamentoRepository.save(new Medicamento("Meloxicam 1mg", "Meloxicam", "Frasco gotero 15ml", 32000.0, 8, 10));
			medicamentoRepository.save(new Medicamento("Antiparasitario Canino", "Praziquantel", "Caja x 4 tabletas", 18000.0, 20, 5));

			// Una consulta con su diagnostico, para emitir recetas sin crear datos antes.
			ConsultaMedica consulta = consultaMedicaRepository.save(new ConsultaMedica(
					firulais, carlos, "Tos persistente y decaimiento", 14.2, 39.1, "Congestion leve"));
			diagnosticoRepository.save(new Diagnostico(consulta, "Traqueobronquitis infecciosa", "Leve", "Antibiotico por 7 dias"));
		}
	}
}