<<<<<<< HEAD
package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Ticket;
import municipal_transport_backend.alternate.smartbus.entity.Voyage;
import municipal_transport_backend.alternate.smartbus.repository.TicketRepository;
import municipal_transport_backend.alternate.smartbus.repository.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private VoyageRepository voyageRepository;

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * معالجة الدفع وإنشاء تذكرة
     * @param voyageId معرف الرحلة
     * @param nbBillets عدد التذاكر
     * @param methode طريقة الدفع (Stripe, PayPal, CB, Espèces)
     * @param passagerNom اسم المسافر
     * @param passagerEmail البريد الإلكتروني (اختياري)
     * @return خريطة تحتوي على نتيجة العملية ورقم التذكرة والمبلغ
     */
    @Transactional
    public Map<String, Object> processPayment(Integer voyageId, Integer nbBillets,
                                              String methode, String passagerNom, String passagerEmail,
                                              Double paymentAmount) {
        Map<String, Object> response = new HashMap<>();

        // 1. جلب الرحلة من قاعدة البيانات
        Voyage voyage = voyageRepository.findById(voyageId)
                .orElseThrow(() -> new RuntimeException("Voyage non trouvé"));

        // 2. التحقق من توفر المقاعد
        if (voyage.getNombrePlacesDisponible() < nbBillets) {
            throw new RuntimeException("Places insuffisantes. Restant: " + voyage.getNombrePlacesDisponible());
        }

        // 3. حساب المبلغ الإجمالي
        double total = voyage.getPrix() * nbBillets;

        // 4. (اختياري) استدعاء واجهة دفع حقيقية مثل Stripe
        //    هنا نضع محاكاة (نفترض أن الدفع نجح دائماً)
        boolean paiementReussi = true; // يمكن لاحقاً استبدالها بـ Stripe API

        if (!paiementReussi) {
            throw new RuntimeException("Le paiement a échoué");
        }

        // 5. إنشاء تذكرة جديدة
        Ticket ticket = new Ticket();
        ticket.setNumero(genererNumeroTicket());
        ticket.setVoyageId(voyageId);
        ticket.setNombreBillets(nbBillets);
        ticket.setMontantTotal(total);
        ticket.setMethodePaiement(methode);
        ticket.setPassagerNom(passagerNom);
        ticket.setPassagerEmail(passagerEmail != null ? passagerEmail : "");
        ticket.setDateCreation(LocalDateTime.now());
        ticket.setStatut("PAYE");

        ticketRepository.save(ticket);

        // 6. تحديث المقاعد المتاحة في الرحلة
        voyage.setNombrePlacesDisponible(voyage.getNombrePlacesDisponible() - nbBillets);
        voyageRepository.save(voyage);

        // 7. إعداد الرد
        response.put("success", true);
        response.put("ticketNumber", ticket.getNumero());
        response.put("total", total);
        response.put("passagerNom", passagerNom);
        response.put("methode", methode);
        response.put("message", "Paiement effectué avec succès");

        if ("Espèces".equals(methode) && paymentAmount != null) {
            response.put("paymentAmount", paymentAmount);
            response.put("change", Math.max(0, paymentAmount - total));
        }
        if ("PayPal".equals(methode)) {
            response.put("paypalContact", "paypal@transport.tn");
        }

        return response;
    }

    private String genererNumeroTicket() {
        return "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
=======
package municipal_transport_backend.alternate.smartbus.service;

import municipal_transport_backend.alternate.smartbus.entity.Ticket;
import municipal_transport_backend.alternate.smartbus.entity.Voyage;
import municipal_transport_backend.alternate.smartbus.repository.TicketRepository;
import municipal_transport_backend.alternate.smartbus.repository.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private VoyageRepository voyageRepository;

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * معالجة الدفع وإنشاء تذكرة
     * @param voyageId معرف الرحلة
     * @param nbBillets عدد التذاكر
     * @param methode طريقة الدفع (Stripe, PayPal, CB, Espèces)
     * @param passagerNom اسم المسافر
     * @param passagerEmail البريد الإلكتروني (اختياري)
     * @return خريطة تحتوي على نتيجة العملية ورقم التذكرة والمبلغ
     */
    @Transactional
    public Map<String, Object> processPayment(Integer voyageId, Integer nbBillets,
                                              String methode, String passagerNom, String passagerEmail,
                                              Double paymentAmount) {
        Map<String, Object> response = new HashMap<>();

        // 1. جلب الرحلة من قاعدة البيانات
        Voyage voyage = voyageRepository.findById(voyageId)
                .orElseThrow(() -> new RuntimeException("Voyage non trouvé"));

        // 2. التحقق من توفر المقاعد
        if (voyage.getNombrePlacesDisponible() < nbBillets) {
            throw new RuntimeException("Places insuffisantes. Restant: " + voyage.getNombrePlacesDisponible());
        }

        // 3. حساب المبلغ الإجمالي
        double total = voyage.getPrix() * nbBillets;

        // 4. (اختياري) استدعاء واجهة دفع حقيقية مثل Stripe
        //    هنا نضع محاكاة (نفترض أن الدفع نجح دائماً)
        boolean paiementReussi = true; // يمكن لاحقاً استبدالها بـ Stripe API

        if (!paiementReussi) {
            throw new RuntimeException("Le paiement a échoué");
        }

        // 5. إنشاء تذكرة جديدة
        Ticket ticket = new Ticket();
        ticket.setNumero(genererNumeroTicket());
        ticket.setVoyageId(voyageId);
        ticket.setNombreBillets(nbBillets);
        ticket.setMontantTotal(total);
        ticket.setMethodePaiement(methode);
        ticket.setPassagerNom(passagerNom);
        ticket.setPassagerEmail(passagerEmail != null ? passagerEmail : "");
        ticket.setDateCreation(LocalDateTime.now());
        ticket.setStatut("PAYE");

        ticketRepository.save(ticket);

        // 6. تحديث المقاعد المتاحة في الرحلة
        voyage.setNombrePlacesDisponible(voyage.getNombrePlacesDisponible() - nbBillets);
        voyageRepository.save(voyage);

        // 7. إعداد الرد
        response.put("success", true);
        response.put("ticketNumber", ticket.getNumero());
        response.put("total", total);
        response.put("passagerNom", passagerNom);
        response.put("methode", methode);
        response.put("message", "Paiement effectué avec succès");

        if ("Espèces".equals(methode) && paymentAmount != null) {
            response.put("paymentAmount", paymentAmount);
            response.put("change", Math.max(0, paymentAmount - total));
        }
        if ("PayPal".equals(methode)) {
            response.put("paypalContact", "paypal@transport.tn");
        }

        return response;
    }

    private String genererNumeroTicket() {
        return "TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
>>>>>>> f141314d577dc66fb48869aa744bb9618de13ced
}