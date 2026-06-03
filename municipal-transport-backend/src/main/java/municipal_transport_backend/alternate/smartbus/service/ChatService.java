package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqApiUrl;

    @Value("${groq.model:llama-3.1-8b-instant}")
    private String groqModel;

    @Autowired private ChauffeurRepository chauffeurRepo;
    @Autowired private VehiculeRepository  vehiculeRepo;
    @Autowired private LigneRepository     ligneRepo;
    @Autowired private StationRepository   stationRepo;
    @Autowired private HoraireRepository   horaireRepo;
    @Autowired private VoyageRepository    voyageRepo;
    @Autowired private TicketRepository    ticketRepo;
    @Autowired private AffectationRepository affectationRepo;

    // RestTemplate avec timeout obligatoire (sinon le thread peut bloquer indéfiniment)
    private final RestTemplate restTemplate = new RestTemplateBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .readTimeout(Duration.ofSeconds(20))
            .build();

    @PostConstruct
    public void init() {
        if (groqApiKey == null || groqApiKey.isBlank()) {
            log.warn("⚠️ GROQ_API_KEY n'est pas définie — le chatbot répondra avec un message d'erreur.");
        } else {
            log.info("✅ Chatbot Groq configuré (modèle: {}, clé: {}...)",
                    groqModel,
                    groqApiKey.substring(0, Math.min(8, groqApiKey.length())));
        }
    }

    /**
     * Construit le contexte RAG : un résumé des données en base injecté
     * dans le prompt système pour que le LLM réponde sur de vraies données.
     */
    private String buildContext() {
        long chauffeurs = chauffeurRepo.count();
        long vehicules = vehiculeRepo.count();
        long lignes = ligneRepo.count();
        long stations = stationRepo.count();
        long horaires = horaireRepo.count();
        long voyages = voyageRepo.count();
        long tickets = ticketRepo.count();
        long affectations = affectationRepo.count();

        long vehiculesDispos = vehiculeRepo.findAll().stream()
                .filter(v -> v.isVehiculeDispo()).count();

        double revenuTotal = ticketRepo.findAll().stream()
                .filter(t -> "PAYE".equalsIgnoreCase(t.getStatut()))
                .mapToDouble(t -> t.getMontantTotal() == null ? 0 : t.getMontantTotal())
                .sum();

        long affectationsActives = affectationRepo.findAll().stream()
                .filter(a -> "EN_COURS".equalsIgnoreCase(a.getStatut())
                          || "PLANIFIEE".equalsIgnoreCase(a.getStatut()))
                .count();

        return String.format(
                "Données actuelles du système Municipal Transport (au %s) :\n" +
                "- Chauffeurs : %d\n" +
                "- Véhicules : %d (dont %d disponibles)\n" +
                "- Lignes : %d\n" +
                "- Stations : %d\n" +
                "- Horaires : %d\n" +
                "- Voyages : %d\n" +
                "- Tickets vendus : %d (revenu total tickets payés : %.2f DT)\n" +
                "- Affectations : %d (dont %d actives ou planifiées)",
                LocalDateTime.now().toLocalDate(),
                chauffeurs, vehicules, vehiculesDispos,
                lignes, stations, horaires, voyages,
                tickets, revenuTotal, affectations, affectationsActives
        );
    }

    public Map<String, Object> chat(String userMessage) {
        log.info("💬 Chat reçu: {}", userMessage);

        if (groqApiKey == null || groqApiKey.isBlank()) {
            log.warn("Chat appelé sans GROQ_API_KEY configurée");
            return Map.of(
                "reply", "⚠️ Le chatbot n'est pas configuré. Définissez la variable d'environnement GROQ_API_KEY puis relancez le backend."
            );
        }

        String systemPrompt =
                "Tu es l'assistant officiel du dashboard Municipal Transport. " +
                "Tu réponds en français de manière concise et professionnelle. " +
                "Tu te bases UNIQUEMENT sur les données fournies ci-dessous. " +
                "Si tu ne sais pas ou que la donnée n'est pas dans le contexte, dis-le clairement.\n\n" +
                buildContext();

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", groqModel);
        payload.put("temperature", 0.3);
        payload.put("max_tokens", 500);
        payload.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> req = new HttpEntity<>(payload, headers);

        try {
            log.info("→ Appel Groq API ({})...", groqModel);
            long t0 = System.currentTimeMillis();

            ResponseEntity<Map> resp = restTemplate.exchange(
                    groqApiUrl, HttpMethod.POST, req, Map.class);

            log.info("← Réponse Groq en {} ms (statut: {})",
                    System.currentTimeMillis() - t0, resp.getStatusCode());

            Map body = resp.getBody();
            if (body != null && body.get("choices") instanceof List<?> choices && !choices.isEmpty()) {
                Map<?, ?> first = (Map<?, ?>) choices.get(0);
                Map<?, ?> message = (Map<?, ?>) first.get("message");
                String reply = (String) message.get("content");
                return Map.of("reply", reply);
            }
            return Map.of("reply", "Pas de réponse du modèle.");
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Erreur HTTP Groq: {} — {}", e.getStatusCode(), e.getResponseBodyAsString());
            String hint = "";
            if (e.getStatusCode().value() == 401) hint = " (clé API invalide ?)";
            if (e.getStatusCode().value() == 404) hint = " (modèle inexistant : " + groqModel + ")";
            return Map.of("reply", "❌ Erreur Groq " + e.getStatusCode() + hint);
        } catch (org.springframework.web.client.ResourceAccessException e) {
            log.error("Erreur réseau Groq: {}", e.getMessage());
            return Map.of("reply", "❌ Impossible de joindre Groq (réseau / timeout). Vérifiez votre connexion internet depuis le conteneur Docker.");
        } catch (Exception e) {
            log.error("Erreur inattendue Groq:", e);
            return Map.of("reply", "❌ Erreur : " + e.getMessage());
        }
    }
}
