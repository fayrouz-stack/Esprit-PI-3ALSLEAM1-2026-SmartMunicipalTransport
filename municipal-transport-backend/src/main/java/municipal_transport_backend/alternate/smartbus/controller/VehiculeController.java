package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Vehicule;
import municipal_transport_backend.alternate.smartbus.service.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.time.Period;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicules")
public class VehiculeController {

    @Autowired
    private VehiculeService vehiculeService;

    @GetMapping
    public List<Vehicule> getAllVehicules() {
        return vehiculeService.findAll();
    }

    @GetMapping("/all")
    public List<Vehicule> getAllVehiculesUnpaged() {
        return vehiculeService.findAll();
    }

    @GetMapping("/{id}")
    public Vehicule getVehiculeById(@PathVariable Long id) {
        return vehiculeService.findById(id);
    }

    @PostMapping
    public Vehicule createVehicule(@RequestBody Vehicule vehicule) {
        return vehiculeService.save(vehicule);
    }

    @PutMapping("/{id}")
    public Vehicule updateVehicule(@PathVariable Long id, @RequestBody Vehicule vehiculeDetails) {
        return vehiculeService.update(id, vehiculeDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteVehicule(@PathVariable Long id) {
        vehiculeService.delete(id);
    }

    /**
     * Endpoint appelé par le dispositif embarqué (ESP32/GPS) via Wokwi ou matériel réel.
     * Met à jour uniquement la position GPS du véhicule.
     * Exemple : PATCH /api/vehicules/3/position
     * Body : { "latitude": 36.8065, "longitude": 10.1815 }
     */
    @PatchMapping("/{id}/position")
    public ResponseEntity<?> updatePosition(
            @PathVariable Long id,
            @RequestBody Map<String, Double> body) {
        Double lat = body.get("latitude");
        Double lon = body.get("longitude");
        if (lat == null || lon == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "latitude et longitude sont obligatoires"));
        }
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Coordonnées GPS invalides"));
        }
        Vehicule v = vehiculeService.findById(id);
        if (v == null) {
            return ResponseEntity.notFound().build();
        }
        v.setLatitude(lat);
        v.setLongitude(lon);
        vehiculeService.save(v);
        return ResponseEntity.ok(Map.of(
                "id", id,
                "latitude", lat,
                "longitude", lon,
                "message", "Position mise à jour"
        ));
    }

    @GetMapping("/etat/{etat}")
    public List<Vehicule> getByEtat(@PathVariable String etat) {
        return vehiculeService.findByEtat(etat);
    }

    @GetMapping("/disponibles")
    public List<Vehicule> getDisponibles() {
        return vehiculeService.findDisponibles();
    }

    @GetMapping("/type/{type}")
    public List<Vehicule> getByType(@PathVariable String type) {
        return vehiculeService.findByTypeVehicule(type);
    }
    @GetMapping("/traffic")
    public Map<String, Object> getTraffic(@RequestParam double lat, @RequestParam double lon) {
        Map<String, Object> response = new HashMap<>();
        LocalTime now = LocalTime.now();
        DayOfWeek day = LocalDate.now().getDayOfWeek();
        int hour = now.getHour();
        boolean isWeekend = (day == DayOfWeek.FRIDAY || day == DayOfWeek.SATURDAY);

        if (isWeekend) {
            response.put("description", "✅ Trafic fluide (week-end)");
            response.put("color", "green");
            response.put("level", "faible");
        } else if (hour >= 7 && hour <= 9) {
            response.put("description", "🚦 Trafic dense (heure de pointe matin)");
            response.put("color", "red");
            response.put("level", "élevé");
        } else if (hour >= 12 && hour <= 13) {
            response.put("description", "🚗 Trafic modéré (pause déjeuner)");
            response.put("color", "orange");
            response.put("level", "modéré");
        } else if (hour >= 17 && hour <= 19) {
            response.put("description", "🚦 Trafic dense (heure de pointe soir)");
            response.put("color", "red");
            response.put("level", "élevé");
        } else if (hour >= 22 || hour <= 5) {
            response.put("description", "✅ Trafic fluide (nuit)");
            response.put("color", "green");
            response.put("level", "faible");
        } else {
            response.put("description", "🚗 Trafic normal");
            response.put("color", "orange");
            response.put("level", "normal");
        }
        return response;
    }
   @GetMapping("/alertes")
    public List<Map<String, Object>> getAlertes() {
    List<Vehicule> vehicules = vehiculeService.findAll();
    List<Map<String, Object>> alertes = new ArrayList<>();
    LocalDate now = LocalDate.now();

    for (Vehicule v : vehicules) {

        // 1. Assurance
        if (v.getDateFinAssurance() != null) {
            LocalDate date = v.getDateFinAssurance();
            String color;

            if (date.isBefore(now)) {
                color = "red";
            } else if (date.isBefore(now.plusMonths(1))) {
                color = "orange";
            } else {
                color = "green";
            }

            Map<String, Object> alerte = new HashMap<>();
            alerte.put("title", "🔧 Assurance expirant - " + v.getMatriculeFourni());
            alerte.put("date", date.toString());
            alerte.put("color", color);
            alerte.put("vehicle", v.getMatriculeFourni());
            alerte.put("vehiculeId", v.getId());
            alertes.add(alerte);
        }

        // 2. Contrôle Technique (CT)
        if (v.getDateProchainCt() != null) {
            LocalDate date = v.getDateProchainCt();
            String color;

            if (date.isBefore(now)) {
                color = "red";
            } else if (date.isBefore(now.plusMonths(1))) {
                color = "orange";
            } else {
                color = "green";
            }

            Map<String, Object> alerte = new HashMap<>();
            alerte.put("title", "🔧 CT - " + v.getMatriculeFourni());
            alerte.put("date", date.toString());
            alerte.put("color", color);
            alerte.put("vehicle", v.getMatriculeFourni());
            alerte.put("vehiculeId", v.getId());
            alertes.add(alerte);
        }

        // 3. Maintenance (basée sur kilométrage)
        int km = v.getKilometrage();
        String maintenanceMsg = null;

        if (km >= 80000) {
            maintenanceMsg = "⚠️ Pneus à changer (" + km + " km)";
        } else if (km >= 60000) {
            maintenanceMsg = "⚠️ Révision majeure (" + km + " km)";
        } else if (km >= 40000) {
            maintenanceMsg = "⚠️ Vidange (" + km + " km)";
        }

        if (maintenanceMsg != null) {
            Map<String, Object> alerte = new HashMap<>();
            alerte.put("title", maintenanceMsg + " - " + v.getMatriculeFourni());
            alerte.put("date", now.plusDays(15).toString());
            alerte.put("color", "orange");
            alerte.put("vehicle", v.getMatriculeFourni());
            alerte.put("vehiculeId", v.getId());
            alertes.add(alerte);
        }

        // 4. Âge du véhicule
        if (v.getDatePremiereMiseCirculation() != null) {
            int age = Period.between(
                    v.getDatePremiereMiseCirculation(),
                    now
            ).getYears();

            if (age > 15) {
                Map<String, Object> alerte = new HashMap<>();
                alerte.put("title", "⚠️ Véhicule très âgé (" + age + " ans) - " + v.getMatriculeFourni());
                alerte.put("date", now.toString());
                alerte.put("color", "red");
                alerte.put("vehicle", v.getMatriculeFourni());
                alerte.put("vehiculeId", v.getId());
                alertes.add(alerte);
            } else if (age > 10) {
                Map<String, Object> alerte = new HashMap<>();
                alerte.put("title", "⚠️ Véhicule âgé (" + age + " ans) - " + v.getMatriculeFourni());
                alerte.put("date", now.toString());
                alerte.put("color", "orange");
                alerte.put("vehicle", v.getMatriculeFourni());
                alerte.put("vehiculeId", v.getId());
                alertes.add(alerte);
            }
        }
    }

    return alertes;
}
}
