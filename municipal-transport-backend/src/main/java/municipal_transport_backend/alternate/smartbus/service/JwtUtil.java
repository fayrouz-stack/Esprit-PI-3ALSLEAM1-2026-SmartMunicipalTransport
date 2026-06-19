package municipal_transport_backend.alternate.smartbus.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

/**
 * Gestion JWT avec HMAC-SHA256 — bibliothèque Java standard uniquement.
 * Pas de dépendance jjwt.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration; // ms

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateToken(String email, String role) {
        try {
            String header  = b64url("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
            long   now     = System.currentTimeMillis() / 1000;
            String payloadJson = objectMapper.writeValueAsString(Map.of(
                    "sub",  email,
                    "role", role,
                    "iat",  now,
                    "exp",  now + expiration / 1000
            ));
            String payload = b64url(payloadJson);
            String sig     = hmac256(header + "." + payload);
            return header + "." + payload + "." + sig;
        } catch (Exception e) {
            throw new RuntimeException("Génération JWT échouée", e);
        }
    }

    public boolean isValid(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;
            // Vérifier la signature
            if (!hmac256(parts[0] + "." + parts[1]).equals(parts[2])) return false;
            // Vérifier l'expiration
            Map<?, ?> claims = parseClaims(token);
            long exp = ((Number) claims.get("exp")).longValue();
            return exp > System.currentTimeMillis() / 1000;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return (String) parseClaims(token).get("sub");
    }

    public String extractRole(String token) {
        return (String) parseClaims(token).get("role");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseClaims(String token) {
        try {
            String[] parts   = token.split("\\.");
            byte[]   decoded = Base64.getUrlDecoder().decode(parts[1]);
            return objectMapper.readValue(decoded, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Parsing JWT échoué", e);
        }
    }

    private String b64url(String s) {
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }

    private String hmac256(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("HMAC-SHA256 échoué", e);
        }
    }
}

