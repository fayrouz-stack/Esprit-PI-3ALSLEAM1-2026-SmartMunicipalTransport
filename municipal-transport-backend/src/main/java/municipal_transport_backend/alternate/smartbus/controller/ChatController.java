package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public Map<String, Object> chat(@RequestBody Map<String, String> payload) {
        String message = payload.getOrDefault("message", "").trim();
        if (message.isEmpty()) {
            return Map.of("reply", "Posez-moi une question sur le système Municipal Transport.");
        }
        return chatService.chat(message);
    }
}
