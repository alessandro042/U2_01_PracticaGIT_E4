package utez.edu.mx.autos.servidor.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import utez.edu.mx.autos.servidor.model.Auto;

public interface AutoRepository extends JpaRepository<Auto, Long> {
}
