package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Station;
import municipal_transport_backend.alternate.smartbus.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @GetMapping
    public List<Station> getAll() {
        return stationService.findAll();
    }

    @GetMapping("/all")
    public List<Station> getAllUnpaged() {
        return stationService.findAll();
    }

    @GetMapping("/{id}")
    public Station getById(@PathVariable Integer id) {
        return stationService.findById(id);
    }

    @PostMapping
    public Station create(@RequestBody Station station) {
        return stationService.save(station);
    }

    @PutMapping("/{id}")
    public Station update(@PathVariable Integer id, @RequestBody Station station) {
        return stationService.update(id, station);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        stationService.delete(id);
    }
}