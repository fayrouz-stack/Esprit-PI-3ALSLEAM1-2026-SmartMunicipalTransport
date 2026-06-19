package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.entity.Horaire;
<<<<<<< HEAD
import municipal_transport_backend.alternate.smartbus.entity.Vehicule;
import municipal_transport_backend.alternate.smartbus.service.HoraireService;
import municipal_transport_backend.alternate.smartbus.service.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
=======
import municipal_transport_backend.alternate.smartbus.service.HoraireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced

@RestController
@RequestMapping("/api/horaires")
public class HoraireController {

    @Autowired
    private HoraireService horaireService;

<<<<<<< HEAD
    @Autowired
    private VehiculeService vehiculeService;

=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
    @GetMapping
    public List<Horaire> getAll() {
        return horaireService.findAll();
    }

    @GetMapping("/all")
    public List<Horaire> getAllUnpaged() {
        return horaireService.findAll();
    }

<<<<<<< HEAD
    @GetMapping("/by-ligne/{ligneId}")
    public List<Horaire> getByLigne(@PathVariable Integer ligneId) {
        return horaireService.findByLigneId(ligneId);
    }

=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
    @GetMapping("/{id}")
    public Horaire getById(@PathVariable Integer id) {
        return horaireService.findById(id);
    }

    @PostMapping
    public Horaire create(@RequestBody Horaire horaire) {
        return horaireService.save(horaire);
    }

    @PutMapping("/{id}")
    public Horaire update(@PathVariable Integer id, @RequestBody Horaire horaire) {
        return horaireService.update(id, horaire);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        horaireService.delete(id);
    }
<<<<<<< HEAD

    /**
     * Estime le retard d'un horaire en tenant compte :
     * - du trafic (heure de la journée / jour de la semaine)
     * - de la météo simulée (saison + aléatoire pondéré)
     * - de l'état du véhicule (si vehiculeId fourni)
     *
     * Met à jour retard_estime sur l'horaire et retourne le détail de l'estimation.
     */
    @PostMapping("/{id}/estimer-retard")
    public ResponseEntity<Map<String, Object>> estimerRetard(
            @PathVariable Integer id,
            @RequestBody(required = false) Map<String, Object> body) {

        Horaire horaire = horaireService.findById(id);

        // ── 1. Facteur trafic ────────────────────────────────────────────────
        LocalTime now = LocalTime.now();
        DayOfWeek day = LocalDate.now().getDayOfWeek();
        int hour = now.getHour();
        boolean isWeekend = (day == DayOfWeek.FRIDAY || day == DayOfWeek.SATURDAY);

        int trafficMinutes;
        String trafficLabel;
        String trafficColor;
        if (isWeekend || hour >= 22 || hour <= 5) {
            trafficMinutes = 0; trafficLabel = "Fluide"; trafficColor = "green";
        } else if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
            trafficMinutes = 12; trafficLabel = "Dense (heure de pointe)"; trafficColor = "red";
        } else if (hour >= 12 && hour <= 13) {
            trafficMinutes = 6; trafficLabel = "Modéré (pause déjeuner)"; trafficColor = "orange";
        } else {
            trafficMinutes = 3; trafficLabel = "Normal"; trafficColor = "orange";
        }

        // ── 2. Facteur météo simulé ───────────────────────────────────────────
        int month = LocalDate.now().getMonthValue();
        // été (juin-sept) → chaleur → surchauffe; hiver (déc-fév) → pluie/neige
        String[] weatherOptions;
        int[] weatherDelays;
        if (month >= 6 && month <= 9) {
            weatherOptions = new String[]{"☀️ Ensoleillé", "🌤️ Nuageux", "⛈️ Orage"};
            weatherDelays  = new int[]{0, 2, 8};
        } else if (month == 12 || month <= 2) {
            weatherOptions = new String[]{"🌧️ Pluie", "❄️ Gel/Neige", "🌫️ Brouillard", "☁️ Couvert"};
            weatherDelays  = new int[]{5, 15, 8, 2};
        } else {
            weatherOptions = new String[]{"☁️ Couvert", "🌦️ Averses", "🌤️ Nuageux", "☀️ Beau temps"};
            weatherDelays  = new int[]{2, 7, 1, 0};
        }
        // Choix pseudo-aléatoire déterministe selon minute+id
        int idx = (now.getMinute() + id) % weatherOptions.length;
        String weatherLabel = weatherOptions[idx];
        int weatherMinutes  = weatherDelays[idx];

        // ── 3. Facteur véhicule ──────────────────────────────────────────────
        int vehiculeMinutes = 0;
        String vehiculeLabel = "Non spécifié";
        String vehiculeInfo  = null;
        Long vehiculeId = null;

        if (body != null && body.containsKey("vehiculeId") && body.get("vehiculeId") != null) {
            try {
                vehiculeId = Long.valueOf(body.get("vehiculeId").toString());
                Vehicule v = vehiculeService.findById(vehiculeId);
                vehiculeInfo = v.getMatriculeFourni() + " (" + v.getMarque() + " " + v.getModele() + ")";
                String etat = v.getEtat() == null ? "" : v.getEtat().toLowerCase();
                if (etat.contains("panne")) {
                    vehiculeMinutes = 20; vehiculeLabel = "⚠️ En panne";
                } else if (etat.contains("réparation")) {
                    vehiculeMinutes = 10; vehiculeLabel = "🔧 En réparation";
                } else if (etat.contains("usé")) {
                    vehiculeMinutes = 5;  vehiculeLabel = "📉 Usé";
                } else if (etat.contains("neuf")) {
                    vehiculeMinutes = -2; vehiculeLabel = "✨ Neuf (bonus)";
                } else {
                    vehiculeMinutes = 0;  vehiculeLabel = "✅ Bon état";
                }
                // Kilométrage élevé → usure supplémentaire
                if (v.getKilometrage() != null && v.getKilometrage() > 200_000) {
                    vehiculeMinutes += 3;
                    vehiculeLabel += " + km élevé";
                }
            } catch (Exception ignored) {
                vehiculeLabel = "Véhicule introuvable";
            }
        }

        // ── 4. Total ─────────────────────────────────────────────────────────
        int total = Math.max(0, trafficMinutes + weatherMinutes + vehiculeMinutes);

        // Mise à jour de l'horaire
        horaire.setRetard_estime(total);
        horaireService.save(horaire);

        // ── Réponse ──────────────────────────────────────────────────────────
        Map<String, Object> result = new HashMap<>();
        result.put("horaireId", id);
        result.put("retard_total", total);

        Map<String, Object> traffic = new HashMap<>();
        traffic.put("label", trafficLabel);
        traffic.put("minutes", trafficMinutes);
        traffic.put("color", trafficColor);
        result.put("trafic", traffic);

        Map<String, Object> weather = new HashMap<>();
        weather.put("label", weatherLabel);
        weather.put("minutes", weatherMinutes);
        result.put("meteo", weather);

        Map<String, Object> vehicule = new HashMap<>();
        vehicule.put("label", vehiculeLabel);
        vehicule.put("minutes", vehiculeMinutes);
        if (vehiculeInfo != null) vehicule.put("info", vehiculeInfo);
        result.put("vehicule", vehicule);

        return ResponseEntity.ok(result);
    }
=======
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}