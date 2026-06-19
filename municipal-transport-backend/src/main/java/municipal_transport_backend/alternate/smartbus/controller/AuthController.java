package municipal_transport_backend.alternate.smartbus.controller;

import jakarta.servlet.http.HttpServletRequest;
import municipal_transport_backend.alternate.smartbus.entity.AppUser;
import municipal_transport_backend.alternate.smartbus.repository.AppUserRepository;
import municipal_transport_backend.alternate.smartbus.service.JwtUtil;
import municipal_transport_backend.alternate.smartbus.service.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AppUserRepository userRepo;
    @Autowired private PasswordUtils     passwordUtils;
    @Autowired private JwtUtil           jwtUtil;

    /**
     * POST /api/auth/login
     * Body : { "email": "...", "password": "..." }
     * Réponse 200 : { token, email, role, nom, prenom }
     * Réponse 401 : { error: "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email et mot de passe requis"));
        }

        AppUser user = userRepo.findByEmail(email).orElse(null);
        if (user == null || !passwordUtils.matches(password, user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Email ou mot de passe incorrect"));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(Map.of(
                "token",  token,
                "email",  user.getEmail(),
                "role",   user.getRole(),
                "nom",    user.getNom()    != null ? user.getNom()    : "",
                "prenom", user.getPrenom() != null ? user.getPrenom() : ""
        ));
    }

    /**
     * GET /api/auth/me — renvoie les infos de l'utilisateur connecté (token requis).
     * Extrait le token directement depuis l'en-tête Authorization.
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }
        String token = header.substring(7);
        if (!jwtUtil.isValid(token)) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalide ou expiré"));
        }
        String email = jwtUtil.extractEmail(token);
        AppUser user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("error", "Utilisateur introuvable"));
        return ResponseEntity.ok(Map.of(
                "email",  user.getEmail(),
                "role",   user.getRole(),
                "nom",    user.getNom()    != null ? user.getNom()    : "",
                "prenom", user.getPrenom() != null ? user.getPrenom() : ""
        ));
    }
}
