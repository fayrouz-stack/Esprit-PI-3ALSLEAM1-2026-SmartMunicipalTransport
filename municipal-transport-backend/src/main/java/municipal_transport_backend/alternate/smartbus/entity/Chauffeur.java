package municipal_transport_backend.alternate.smartbus.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Base64;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Chauffeur {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String cin;

  private String nom;

  private String prenom;

  private String permis;

  private String telephone;
  @Column(unique = true)
  private String matricule;

  private String psw;

  private String email;

  private int holidayRemaining;

  private LocalDate dateStart;

  private LocalDateTime lastShiftStart;

  private LocalDateTime lastShiftEnd;

  private int countWorkDays;

  @PrePersist
  public void prePersist() {

    // password auto generated
    this.psw = generatePassword();

    // default values
    this.holidayRemaining = 0;

    this.countWorkDays = 0;

    // current date
    this.dateStart = LocalDate.now();

    // current datetime
    this.lastShiftStart = LocalDateTime.now();

    this.lastShiftEnd = LocalDateTime.now();
  }

  private String generatePassword() {
    SecureRandom random = new SecureRandom();
    byte[] bytes = new byte[16];
    random.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }
}