#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>

// ─── Configuration WiFi / API ────────────────────────────────────────────────
const char* WIFI_SSID     = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";

// host.wokwi.internal → localhost depuis Wokwi Desktop
// Remplace par ton URL ngrok si tu utilises Wokwi Cloud
const char* API_URL = "http://host.wokwi.internal:8081/api/telemetrie";

const int VEHICULE_ID   = 3;    // ID véhicule dans la base
const int SEND_INTERVAL = 5000; // ms entre deux mesures

// ─── Broches ────────────────────────────────────────────────────────────────
#define DHT_PIN    4     // DHT22 data
#define DHT_TYPE   DHT22
#define MQ2_PIN    34    // MQ-2 sortie analogique (ADC1)
#define LED_GREEN  5     // Tout va bien
#define LED_RED    2     // Alerte
#define BUZZER_PIN 18    // Buzzer actif

// ─── Seuils (doivent correspondre au backend TelemetrieService.java) ─────────
const float TEMP_MAX    = 35.0;
const float TEMP_MIN    = 5.0;
const int   GAZ_SEUIL   = 1500;
const float HUM_MAX     = 85.0;

// ─── Objets ──────────────────────────────────────────────────────────────────
DHT            dht(DHT_PIN, DHT_TYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);  // adresse I2C 0x27, 16 colonnes, 2 lignes

// ─── Setup ───────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);

  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED,   OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // LCD init
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0); lcd.print("  Bus Monitor   ");
  lcd.setCursor(0, 1); lcd.print(" Connexion...   ");

  dht.begin();

  // WiFi
  Serial.println("\n[CabinMonitor] Connexion WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 20) {
    delay(500); Serial.print("."); tries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\n[OK] WiFi - IP: %s\n", WiFi.localIP().toString().c_str());
    lcd.setCursor(0, 1); lcd.print("WiFi OK         ");
    digitalWrite(LED_GREEN, HIGH);
    delay(800);
  } else {
    Serial.println("\n[WARN] WiFi non disponible - mode hors-ligne");
    lcd.setCursor(0, 1); lcd.print("WiFi ECHEC      ");
  }
}

// ─── Affichage LCD ────────────────────────────────────────────────────────────
void afficherLcd(float temp, float hum, int gaz, bool alerte) {
  lcd.clear();
  // Ligne 1 : T: 27.3C  H: 54%
  char ligne1[17];
  snprintf(ligne1, sizeof(ligne1), "T:%.1fC  H:%.0f%%", temp, hum);
  lcd.setCursor(0, 0);
  lcd.print(ligne1);

  // Ligne 2 : Gaz:320  OK / Gaz:1800 !!!
  char ligne2[17];
  if (alerte) {
    snprintf(ligne2, sizeof(ligne2), "Gaz:%-4d ALERTE!", gaz);
  } else {
    snprintf(ligne2, sizeof(ligne2), "Gaz:%-4d  OK    ", gaz);
  }
  lcd.setCursor(0, 1);
  lcd.print(ligne2);
}

// ─── Envoi API ────────────────────────────────────────────────────────────────
bool envoyerMesure(float temp, float hum, int gaz) {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  http.begin(API_URL);
  http.addHeader("Content-Type", "application/json");

  JsonDocument doc;
  doc["vehiculeId"] = VEHICULE_ID;
  doc["temperature"] = round(temp * 10) / 10.0;
  doc["humidite"]    = round(hum  * 10) / 10.0;
  doc["niveauGaz"]   = gaz;

  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  bool alerteBackend = false;

  if (code == 200) {
    String resp = http.getString();
    JsonDocument rdoc;
    deserializeJson(rdoc, resp);
    alerteBackend = rdoc["alerte"].as<bool>();
    Serial.printf("[API] 200 - alerte=%s type=%s\n",
                  alerteBackend ? "OUI" : "non",
                  rdoc["typeAlerte"].as<const char*>());
  } else {
    Serial.printf("[API] Erreur HTTP %d\n", code);
  }
  http.end();
  return alerteBackend;
}

// ─── Loop ────────────────────────────────────────────────────────────────────
void loop() {
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();
  int   gaz  = analogRead(MQ2_PIN);   // 0–4095 sur ESP32

  // Lecture invalide du DHT22 ?
  if (isnan(temp) || isnan(hum)) {
    Serial.println("[WARN] Lecture DHT22 invalide");
    temp = 0; hum = 0;
  }

  // Détection locale (sans attendre la réponse API)
  bool alerteLocale = (temp > TEMP_MAX) || (temp < TEMP_MIN && temp > 0)
                   || (gaz  >= GAZ_SEUIL)
                   || (hum  > HUM_MAX);

  Serial.printf("[Mesure] T=%.1f°C  H=%.1f%%  Gaz=%d  Alerte=%s\n",
                temp, hum, gaz, alerteLocale ? "OUI" : "non");

  // Affichage LCD
  afficherLcd(temp, hum, gaz, alerteLocale);

  // LEDs
  digitalWrite(LED_GREEN, alerteLocale ? LOW  : HIGH);
  digitalWrite(LED_RED,   alerteLocale ? HIGH : LOW);

  // Buzzer (3 bips si alerte)
  if (alerteLocale) {
    for (int i = 0; i < 3; i++) {
      digitalWrite(BUZZER_PIN, HIGH); delay(200);
      digitalWrite(BUZZER_PIN, LOW);  delay(200);
    }
  } else {
    digitalWrite(BUZZER_PIN, LOW);
  }

  // Envoi API
  envoyerMesure(temp, hum, gaz);

  delay(SEND_INTERVAL);
}
