<<<<<<< HEAD
package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public Map<String, Object> processPayment(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("voyageId") || payload.get("voyageId") == null) {
            throw new IllegalArgumentException("voyageId est obligatoire");
        }
        if (!payload.containsKey("nbBillets") || payload.get("nbBillets") == null) {
            throw new IllegalArgumentException("nbBillets est obligatoire");
        }
        if (!payload.containsKey("passagerNom") || payload.get("passagerNom") == null
                || payload.get("passagerNom").toString().isBlank()) {
            throw new IllegalArgumentException("passagerNom est obligatoire");
        }
        Integer voyageId = ((Number) payload.get("voyageId")).intValue();
        Integer nbBillets = ((Number) payload.get("nbBillets")).intValue();
        String methode = (String) payload.get("methode");
        String passagerNom = (String) payload.get("passagerNom");
        String passagerEmail = (String) payload.get("passagerEmail");
        Double paymentAmount = payload.get("paymentAmount") != null
                ? ((Number) payload.get("paymentAmount")).doubleValue() : null;

        return paymentService.processPayment(voyageId, nbBillets, methode, passagerNom, passagerEmail, paymentAmount);
    }
=======
package municipal_transport_backend.alternate.smartbus.controller;

import municipal_transport_backend.alternate.smartbus.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public Map<String, Object> processPayment(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("voyageId") || payload.get("voyageId") == null) {
            throw new IllegalArgumentException("voyageId est obligatoire");
        }
        if (!payload.containsKey("nbBillets") || payload.get("nbBillets") == null) {
            throw new IllegalArgumentException("nbBillets est obligatoire");
        }
        if (!payload.containsKey("passagerNom") || payload.get("passagerNom") == null
                || payload.get("passagerNom").toString().isBlank()) {
            throw new IllegalArgumentException("passagerNom est obligatoire");
        }
        Integer voyageId = ((Number) payload.get("voyageId")).intValue();
        Integer nbBillets = ((Number) payload.get("nbBillets")).intValue();
        String methode = (String) payload.get("methode");
        String passagerNom = (String) payload.get("passagerNom");
        String passagerEmail = (String) payload.get("passagerEmail");
        Double paymentAmount = payload.get("paymentAmount") != null
                ? ((Number) payload.get("paymentAmount")).doubleValue() : null;

        return paymentService.processPayment(voyageId, nbBillets, methode, passagerNom, passagerEmail, paymentAmount);
    }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}