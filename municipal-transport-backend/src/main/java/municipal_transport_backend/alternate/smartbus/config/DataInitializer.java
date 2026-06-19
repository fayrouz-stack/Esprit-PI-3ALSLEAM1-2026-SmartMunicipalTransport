package municipal_transport_backend.alternate.smartbus.config;

import municipal_transport_backend.alternate.smartbus.entity.AppUser;
import municipal_transport_backend.alternate.smartbus.entity.Chauffeur;
import municipal_transport_backend.alternate.smartbus.repository.AppUserRepository;
import municipal_transport_backend.alternate.smartbus.repository.ChauffeurRepository;
import municipal_transport_backend.alternate.smartbus.service.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Au démarrage :
 *  1. Crée les comptes admin + gestionnaire s'ils n'existent pas.
 *  2. Pour chaque chauffeur qui a un email mais pas encore d'AppUser,
 *     crée un AppUser avec role=CHAUFFEUR et mot de passe = matricule.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private AppUserRepository   userRepo;
    @Autowired private ChauffeurRepository  chauffeurRepo;
    @Autowired private PasswordUtils        passwordUtils;

    @Override
    public void run(String... args) {

        // ── 1. Comptes admin / gestionnaire ───────────────────────────────
        if (userRepo.findByEmail("admin@transport.tn").isEmpty()) {
            userRepo.save(new AppUser(null,
                    "admin@transport.tn",
                    passwordUtils.encode("admin123"),
                    "ADMIN", "Administrateur", "Système"));
            System.out.println("✅ Compte admin créé : admin@transport.tn / admin123");
        }

        if (userRepo.findByEmail("gestionnaire@transport.tn").isEmpty()) {
            userRepo.save(new AppUser(null,
                    "gestionnaire@transport.tn",
                    passwordUtils.encode("gest123"),
                    "GESTIONNAIRE", "Gestionnaire", "Transport"));
            System.out.println("✅ Compte gestionnaire créé : gestionnaire@transport.tn / gest123");
        }

        // ── 2. Migration des chauffeurs existants ─────────────────────────
        List<Chauffeur> chauffeurs = chauffeurRepo.findAll();
        int migrated = 0;

        for (Chauffeur c : chauffeurs) {
            if (c.getEmail() == null || c.getEmail().isBlank()) continue;
            if (userRepo.findByEmail(c.getEmail()).isPresent()) continue;

            // Mot de passe = matricule (ex: "BUS-3")
            // Si matricule absent (données incohérentes), on saute
            if (c.getMatricule() == null || c.getMatricule().isBlank()) continue;

            AppUser user = new AppUser();
            user.setEmail(c.getEmail());
            user.setPassword(passwordUtils.encode(c.getMatricule()));
            user.setRole("CHAUFFEUR");
            user.setNom(c.getNom());
            user.setPrenom(c.getPrenom());
            userRepo.save(user);
            migrated++;
        }

        if (migrated > 0) {
            System.out.println("✅ Migration : " + migrated + " chauffeur(s) → AppUser créés");
            System.out.println("   Mot de passe initial de chaque chauffeur = son matricule (ex: BUS-3)");
        }
    }
}
