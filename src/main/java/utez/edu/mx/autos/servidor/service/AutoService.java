package utez.edu.mx.autos.servidor.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utez.edu.mx.autos.servidor.model.Auto;
import utez.edu.mx.autos.servidor.repository.AutoRepository;

import java.util.List;

@Service
public class AutoService {

    @Autowired
    private AutoRepository repository;

    public List<Auto> listar() {
        return repository.findAll();
    }

    public Auto guardar(Auto auto) {
        return repository.save(auto);
    }

    public Auto actualizar(Long id, Auto auto) {
        auto.setId(id);
        return repository.save(auto);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
