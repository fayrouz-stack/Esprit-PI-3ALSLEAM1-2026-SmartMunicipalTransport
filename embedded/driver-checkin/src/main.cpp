#include <Arduino.h>

// ═══════════════════════════════════════════════════════════════════════════
//  Module : driver-checkin  (Pointage conducteurs)
//  Matériel prévu :
//    - ESP32 DevKit V1
//    - MFRC522 (RFID/NFC 13.56 MHz) → scan badge conducteur
//        SDA  → GPIO 5
//        SCK  → GPIO 18
//        MOSI → GPIO 23
//        MISO → GPIO 19
//        RST  → GPIO 27
//    - LCD 16x2 I2C  → "Bonjour Mohamed 08h32" / "Badge inconnu"  (SDA 21 / SCL 22)
//    - LED verte     → pointage accepté   (GPIO 2)
//    - LED rouge     → badge refusé       (GPIO 4)
//    - Buzzer        → bip confirmation   (GPIO 15)
//    - Bouton ARRIVEE  → GPIO 32  (simule scan badge entrée)
//    - Bouton DEPART   → GPIO 33  (simule scan badge sortie)
//
//  API backend :
//    GET  /api/chauffeurs/{id}           → vérifier si le chauffeur existe
//    POST /api/pointages                 → { chauffeurId, type: "ARRIVEE"/"DEPART" }
//    GET  /api/pointages/today           → liste du jour (dashboard)
//    GET  /api/pointages/chauffeur/{id}/today
//
//  NFC : Wokwi supporte MFRC522 — les UID de cartes sont configurables
//        dans diagram.json via l'attribut "cardUid" du composant wokwi-mfrc522
//
//  À IMPLÉMENTER
// ═══════════════════════════════════════════════════════════════════════════

void setup() {
  // TODO
}

void loop() {
  // TODO
}
