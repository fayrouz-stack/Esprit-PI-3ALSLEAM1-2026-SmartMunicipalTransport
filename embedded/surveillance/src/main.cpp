#include <Arduino.h>

// ═══════════════════════════════════════════════════════════════════════════
//  Module : surveillance
//  Matériel prévu :
//    - ESP32 DevKit V1
//    - PIR HC-SR501      → détection mouvement (GPIO 13)
//    - LED rouge         → alarme intrusion  (GPIO 2)
//    - LED verte         → bus sécurisé      (GPIO 5)
//    - Buzzer            → alerte sonore     (GPIO 18)
//    - LCD 16x2 I2C      → affichage statut  (SDA 21 / SCL 22)
//
//  API backend :
//    POST /api/alertes   → { vehiculeId, type: "INTRUSION", message, latitude, longitude }
//    GET  /api/telemetrie/{id}/latest → optionnel, croisé avec cabin-monitor
//
//  À IMPLÉMENTER
// ═══════════════════════════════════════════════════════════════════════════

void setup() {
  // TODO
}

void loop() {
  // TODO
}
