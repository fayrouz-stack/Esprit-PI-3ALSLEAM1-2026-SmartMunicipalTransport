package municipal_transport_backend.alternate.smartbus.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Handler WebSocket qui maintient la liste des sessions connectées
 * et diffuse les mises à jour de position à tous les clients.
 */
@Component
public class PositionWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions =
            Collections.newSetFromMap(new ConcurrentHashMap<>());

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // Ping/pong optionnel — on ignore les messages entrants
    }

    /**
     * Envoie un message JSON à tous les clients connectés.
     * Appelé depuis VehiculeController sur chaque PATCH /position.
     */
    public void broadcast(Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            TextMessage msg = new TextMessage(json);
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(msg);
                    } catch (IOException e) {
                        sessions.remove(session);
                    }
                }
            }
        } catch (Exception ignored) {}
    }

    public int getConnectedCount() {
        return (int) sessions.stream().filter(WebSocketSession::isOpen).count();
    }
}
