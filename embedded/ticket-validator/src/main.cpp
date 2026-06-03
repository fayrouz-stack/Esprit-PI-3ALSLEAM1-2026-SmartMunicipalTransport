#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>

// ─── Configuration ───────────────────────────────────────────────────────────
const char* WIFI_SSID  = "Wokwi-GUEST";
const char* WIFI_PASS  = "";

// Remplacer par ton URL ngrok : "https://xxxx.ngrok-free.app/api/tickets/validate"
const char* SERVER_URL = "http://host.wokwi.internal:8081/api/tickets/validate";

// Pins
const int PIN_LED_GREEN = 25;
const int PIN_LED_RED   = 26;
const int PIN_BTN_VALID = 32;   // simule un ticket valide (ID 1)
const int PIN_BTN_BAD   = 33;   // simule un ticket invalide (ID 9999)

// LCD 16x2 I2C
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ─── Setup ───────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_RED,   OUTPUT);
  pinMode(PIN_BTN_VALID, INPUT_PULLUP);
  pinMode(PIN_BTN_BAD,   INPUT_PULLUP);

  lcd.init();
  lcd.backlight();
  lcdShow("Transport", "Pret a scanner...");

  Serial.println("🎫 Validateur de tickets");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries++ < 20) {
    delay(500); Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi OK : " + WiFi.localIP().toString());
    lcdShow("WiFi connecte", WiFi.localIP().toString().c_str());
    delay(1500);
  } else {
    Serial.println("\n❌ WiFi echec");
    lcdShow("WiFi ERREUR", "Mode offline");
  }
  lcdShow("Scannez votre", "ticket...");
}

// ─── Loop ────────────────────────────────────────────────────────────────────
void loop() {
  // Bouton 1 → simule scan ticket ID 1 (valide)
  if (digitalRead(PIN_BTN_VALID) == LOW) {
    delay(50);
    if (digitalRead(PIN_BTN_VALID) == LOW) {
      Serial.println("\n📶 Scan simulé — Ticket ID: 1");
      validateTicket(1);
      while (digitalRead(PIN_BTN_VALID) == LOW) delay(10);
    }
  }

  // Bouton 2 → simule scan ticket ID inexistant
  if (digitalRead(PIN_BTN_BAD) == LOW) {
    delay(50);
    if (digitalRead(PIN_BTN_BAD) == LOW) {
      Serial.println("\n📶 Scan simulé — Ticket ID: 9999 (inexistant)");
      validateTicket(9999);
      while (digitalRead(PIN_BTN_BAD) == LOW) delay(10);
    }
  }
}

// ─── Validation HTTP ─────────────────────────────────────────────────────────
void validateTicket(int ticketId) {
  lcdShow("Validation...", "");

  if (WiFi.status() != WL_CONNECTED) {
    lcdShow("ERREUR", "Pas de WiFi");
    flashLed(PIN_LED_RED, 3);
    delay(2000);
    lcdShow("Scannez votre", "ticket...");
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<64> doc;
  doc["ticketId"] = ticketId;
  String body;
  serializeJson(doc, body);

  Serial.printf("POST %s → %s\n", SERVER_URL, body.c_str());
  int code = http.POST(body);

  if (code == 200) {
    String resp = http.getString();
    StaticJsonDocument<256> res;
    deserializeJson(res, resp);

    String passager = res["passagerNom"] | "Passager";
    String voyage   = res["voyageDest"] | "";

    Serial.printf("✅ VALIDE — %s\n", passager.c_str());
    lcdShow(("OK: " + passager).c_str(), voyage.c_str());
    flashLed(PIN_LED_GREEN, 2);

  } else if (code == 400 || code == 404) {
    String resp = http.getString();
    StaticJsonDocument<128> res;
    deserializeJson(res, resp);
    String errMsg = res["error"] | "Ticket refuse";
    Serial.printf("❌ REFUSE — %s\n", errMsg.c_str());
    lcdShow("REFUSE", errMsg.c_str());
    flashLed(PIN_LED_RED, 3);

  } else {
    Serial.printf("⚠️ HTTP %d\n", code);
    lcdShow("ERREUR SERVEUR", String(code).c_str());
    flashLed(PIN_LED_RED, 1);
  }

  http.end();
  delay(3000);
  lcdShow("Scannez votre", "ticket...");
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
void lcdShow(const char* line1, const char* line2) {
  lcd.clear();
  lcd.setCursor(0, 0); lcd.print(line1);
  lcd.setCursor(0, 1); lcd.print(line2);
}

void flashLed(int pin, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH); delay(300);
    digitalWrite(pin, LOW);  delay(200);
  }
}
