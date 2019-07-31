package fi.academy;

import fi.academy.dao.TodoDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/todo")
public class TodoController {
    private TodoDao dao;

    @Autowired
    public TodoController(TodoDao dao) {
        this.dao = dao;
    }

    @GetMapping("")
    public List<Todo> listaaKaikki() {
        List<Todo> kaikki = dao.haeKaikki();
        System.out.printf("Haetaan tehtävät, tehtäviä: %d kpl\n", kaikki.size());
        return kaikki;
    }

    @PostMapping("")
    public ResponseEntity<?> luoUusi(@RequestBody Todo tehtava) {
        int id = dao.lisaa(tehtava);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).body(tehtava);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> poista(@PathVariable int id) {
        Todo poistettu = dao.poista(id);
        if (poistettu != null) {
            return ResponseEntity.ok(poistettu);
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new Virheviesti(String.format("Id %d ei löytynyt; ei poistettu.", id)));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> muokkaa(@RequestBody Todo tehtava, @PathVariable("id") int id) {
        boolean muuttiko = dao.muuta(id, tehtava);
        if (muuttiko) {
            tehtava.setId(id);
            return ResponseEntity.ok(tehtava);
        }
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new Virheviesti(String.format("Id %d ei ole olemassa; ei muutettu", id)));
    }

}
