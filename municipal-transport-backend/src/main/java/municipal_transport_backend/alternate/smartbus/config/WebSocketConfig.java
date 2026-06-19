package municipal_transport_backend.alternate.smartbus.config;

import municipal_transport_backend.alternate.smartbus.websocket.PositionWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * Configuration WebSocket natif (sans STOMP).
 * Endpoint : ws://localhost:8081/ws/positions
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Autowired
    private PositionWebSocketHandler positionWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(positionWebSocketHandler, "/ws/positions")
                .setAllowedOriginPatterns("*");
    }
}
