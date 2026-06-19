package municipal_transport_backend.alternate.smartbus.service;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Encodage de mots de passe par SHA-256 + sel aléatoire (16 bytes).
 * Format stocké : base64(salt) + ":" + hex(sha256(salt + password))
 * Aucune dépendance externe — bibliothèque Java standard uniquement.
 */
@Component
public class PasswordUtils {

    private static final SecureRandom RANDOM = new SecureRandom();

    /** Encode un mot de passe brut en "salt:hash". */
    public String encode(String rawPassword) {
        byte[] saltBytes = new byte[16];
        RANDOM.nextBytes(saltBytes);
        String salt = Base64.getEncoder().encodeToString(saltBytes);
        String hash = sha256(salt + rawPassword);
        return salt + ":" + hash;
    }

    /** Vérifie si rawPassword correspond au mot de passe encodé. */
    public boolean matches(String rawPassword, String encoded) {
        if (encoded == null || !encoded.contains(":")) return false;
        int idx    = encoded.indexOf(':');
        String salt = encoded.substring(0, idx);
        String hash = encoded.substring(idx + 1);
        return sha256(salt + rawPassword).equals(hash);
    }

    private String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(bytes.length * 2);
            for (byte b : bytes) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 non disponible", e);
        }
    }
}
