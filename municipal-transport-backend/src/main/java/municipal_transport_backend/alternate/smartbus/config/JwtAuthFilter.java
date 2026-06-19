package municipal_transport_backend.alternate.smartbus.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import municipal_transport_backend.alternate.smartbus.service.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtre JWT sans Spring Security — bibliothèque Java standard uniquement.
 * Protège tous les endpoints /api/** sauf /api/auth/login et /ws/**.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path   = request.getRequestURI();
        String method = request.getMethod();

        // Laisser passer les preflight CORS
        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(request, response);
            return;
        }

        // Routes publiques
        if (path.startsWith("/api/auth/login") || path.startsWith("/ws/")) {
            chain.doFilter(request, response);
            return;
        }

        // Autoriser les POST non authentifiés depuis les caméras (webhooks hardware)
        // Permettre aux devices d'envoyer directement une alerte caméra sans token
        if ("POST".equalsIgnoreCase(method) && path.startsWith("/api/alertes/camera")) {
            chain.doFilter(request, response);
            return;
        }

        // Autoriser les GET publics sur les voyages pour affichage de liste et détail
        if ("GET".equalsIgnoreCase(method) && path.startsWith("/api/voyages")) {
            chain.doFilter(request, response);
            return;
        }

        // Protéger tous les autres endpoints /api/**
        if (path.startsWith("/api/")) {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                sendUnauthorized(response, "Token manquant");
                return;
            }
            String token = header.substring(7);
            if (!jwtUtil.isValid(token)) {
                sendUnauthorized(response, "Token invalide ou expiré");
                return;
            }
            // Stocker les infos utilisateur dans les attributs de la requête
            request.setAttribute("user_email", jwtUtil.extractEmail(token));
            request.setAttribute("user_role",  jwtUtil.extractRole(token));
        }

        chain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}
