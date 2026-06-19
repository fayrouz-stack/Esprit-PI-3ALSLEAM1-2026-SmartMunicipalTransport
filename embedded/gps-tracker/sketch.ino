/**
 * Simulation GPS - Municipal Transport
 * Wokwi : https://wokwi.com
 *
 * Simule un ESP32 embarqué dans un bus qui envoie sa position GPS
 * toutes les 3 secondes vers l'API Spring Boot.
 *
 * Matériel simulé :
 *   - ESP32 DevKit V1
 *   - LED verte sur GPIO2 (clignote à chaque envoi)
 *
 * Pour tester avec l'API locale depuis Wokwi :
 *   Utiliser ngrok pour exposer localhost:8081 :
 *   ngrok http 8081
 *   Puis remplacer SERVER_URL par l'URL ngrok
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ─── Configuration ──────────────────────────────────────────────────────────
const char* WIFI_SSID     = "Wokwi-GUEST";  // WiFi Wokwi (gratuit, pas de MDP)
const char* WIFI_PASSWORD = "";

// ⚠️  Remplace par ton URL ngrok si tu utilises Wokwi cloud
// ex : "https://abc123.ngrok-free.app/api/vehicules/3/position"
// En local (PC même réseau) : "http://192.168.x.x:8081/api/vehicules/3/position"
const char* SERVER_URL    = "http://host.wokwi.internal:8081/api/vehicules/3/position";

const int VEHICULE_ID     = 3;       // ID du véhicule dans la base de données
const int LED_PIN         = 2;       // LED intégrée ESP32
const int SEND_INTERVAL   = 3000;    // Envoi toutes les 3 secondes

// ─── Simulation d'un trajet (Tunis → Carthage) ──────────────────────────────
// Tableau de coordonnées GPS simulant un bus en mouvement
struct GpsPoint {
  float lat;
  float lon;
  const char* lieu;
};

const GpsPoint ROUTE[] = {
  { 36.8188, 10.1658, "Tunis Centre - Bab Saadoun" },
  { 36.8270, 10.1680, "Ariana" },
  { 36.8350, 10.1720, "La Marsa Junction" },
  { 36.8440, 10.1800, "Gammarth" },
  { 36.8520, 10.1900, "La Marsa" },
  { 36.8580, 10.2100, "Sidi Bou Said" },
  { 36.8510, 10.2290, "Carthage Hannibal" },
  { 36.8440, 10.2380, "Carthage Dermech" },
  { 36.8320, 10.2200, "La Goulette" },
  { 36.8188, 10.1658, "Retour - Tunis Centre" }  // boucle
};

const int ROUTE_SIZE = sizeof(ROUTE) / sizeof(ROUTE[0]);
int routeIndex = 0;

// ─── Setup ──────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  Serial.println("\n🚌 Municipal Transport - GPS Tracker");
  Serial.printf("   Véhicule ID : %d\n", VEHICULE_ID);
  Serial.println("   Connexion WiFi...");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connecté !");
    Serial.printf("   IP : %s\n", WiFi.localIP().toString().c_str());
  } else {
    Serial.println("\n❌ WiFi non connecté — mode offline");
  }
}

// ─── Loop ───────────────────────────────────────────────────────────────────
void loop() {
  GpsPoint point = ROUTE[routeIndex];

  Serial.printf("\n📍 Position [%d/%d] : %s\n", routeIndex + 1, ROUTE_SIZE, point.lieu);
  Serial.printf("   Lat: %.6f  Lon: %.6f\n", point.lat, point.lon);

  if (WiFi.status() == WL_CONNECTED) {
    sendPosition(point.lat, point.lon);
  } else {
    Serial.println("   ⚠️ WiFi déconnecté, position non envoyée");
  }

  // Clignoter la LED
  digitalWrite(LED_PIN, HIGH);
  delay(200);
  digitalWrite(LED_PIN, LOW);

  // Avancer sur le trajet (boucle)
  routeIndex = (routeIndex + 1) % ROUTE_SIZE;

  delay(SEND_INTERVAL - 200);
}

// ─── Envoi HTTP vers Spring Boot ─────────────────────────────────────────────
void sendPosition(float lat, float lon) {
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  // Construire le JSON
  StaticJsonDocument<128> doc;
  doc["latitude"]  = lat;
  doc["longitude"] = lon;

  String body;
  serializeJson(doc, body);

  Serial.printf("   POST → %s\n", SERVER_URL);
  Serial.printf("   Body : %s\n", body.c_str());

  int code = http.PATCH(body);

  if (code == 200) {
    Serial.printf("   ✅ HTTP %d — Position mise à jour\n", code);
  } else if (code > 0) {
    Serial.printf("   ⚠️ HTTP %d — %s\n", code, http.getString().c_str());
  } else {
    Serial.printf("   ❌ Erreur connexion : %s\n", http.errorToString(code).c_str());
  }

  http.end();
}
