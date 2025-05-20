package utez.edu.mx.autos.servidor.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.autos.servidor.model.Auto;
import utez.edu.mx.autos.servidor.service.AutoService;

import java.util.List;

@RestController
@RequestMapping("/api/autos")
@CrossOrigin(origins = "*") // Permite peticiones desde cualquier origen
public class AutoController {

    @Autowired
    private AutoService service;

    @GetMapping
    public List<Auto> listar() {
        return service.listar();
    }

    @PostMapping
    public Auto guardar(@RequestBody Auto auto) {
        return service.guardar(auto);
    }

    @PutMapping("/{id}")
    public Auto actualizar(@PathVariable Long id, @RequestBody Auto auto) {
        return service.actualizar(id, auto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}

