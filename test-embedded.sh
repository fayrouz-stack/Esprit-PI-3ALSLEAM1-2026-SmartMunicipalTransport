#!/bin/bash
# ============================================================
# 🔌 TEST MODULES EMBARQUÉS - SmartBus
# Simule les requêtes ESP32 sans matériel physique
#
# Usage:
#   chmod +x test-embedded.sh
#   ./test-embedded.sh              → teste tout (véhicule ID=1)
#   ./test-embedded.sh 3            → teste avec véhicule ID=3
#   ./test-embedded.sh 1 5          → véhicule 1, ticket ID=5
# ============================================================

BASE_URL="http://localhost:8081/api"
VEHICULE_ID="${1:-1}"
TICKET_ID="${2:-1}"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

pass() { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${CYAN}ℹ  $1${NC}"; }
section() { echo -e "\n${YELLOW}━━━ $1 ━━━${NC}"; }

# ─────────────────────────────────────────────────────────────
section "MODULE 1 : CABIN-MONITOR (ESP32 + DHT22 + MQ-2)"
info "Simule la carte cabin-monitor installée dans le bus $VEHICULE_ID"
# ─────────────────────────────────────────────────────────────

section "1a. Mesure NORMALE (température 26°C, gaz bas)"
RESP=$(curl -s -X POST "$BASE_URL/telemetrie" \
  -H "Content-Type: application/json" \
  -d "{\"vehiculeId\": $VEHICULE_ID, \"temperature\": 26.4, \"humidite\": 52.1, \"niveauGaz\": 150}")
echo "  Réponse: $RESP"
ALERTE=$(echo "$RESP" | grep -o '"alerte":true' | wc -l)
if [ "$ALERTE" -eq 0 ]; then
  pass "Mesure enregistrée, aucune alerte"
else
  fail "Alerte inattendue sur mesure normale"
fi

section "1b. Mesure CHALEUR EXCESSIVE (45°C → doit déclencher alerte)"
RESP=$(curl -s -X POST "$BASE_URL/telemetrie" \
  -H "Content-Type: application/json" \
  -d "{\"vehiculeId\": $VEHICULE_ID, \"temperature\": 45.0, \"humidite\": 30.0, \"niveauGaz\": 100}")
echo "  Réponse: $RESP"
ALERTE=$(echo "$RESP" | grep -o '"alerte":true' | wc -l)
if [ "$ALERTE" -gt 0 ]; then
  pass "Alerte CHALEUR déclenchée correctement"
  info "  → L'ESP32 allumerait le buzzer/LED rouge"
else
  fail "Alerte CHALEUR non déclenchée (vérifier seuil dans TelemetrieService)"
fi

section "1c. Mesure GAZ DANGEREUX (MQ-2 niveau élevé → alerte)"
RESP=$(curl -s -X POST "$BASE_URL/telemetrie" \
  -H "Content-Type: application/json" \
  -d "{\"vehiculeId\": $VEHICULE_ID, \"temperature\": 24.0, \"humidite\": 48.0, \"niveauGaz\": 750}")
echo "  Réponse: $RESP"
ALERTE=$(echo "$RESP" | grep -o '"alerte":true' | wc -l)
if [ "$ALERTE" -gt 0 ]; then
  pass "Alerte GAZ déclenchée correctement"
else
  fail "Alerte GAZ non déclenchée (vérifier seuil niveauGaz dans TelemetrieService)"
fi

section "1d. Lecture dernière mesure (polling Angular dashboard)"
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/telemetrie/$VEHICULE_ID/latest")
if [ "$HTTP" = "200" ]; then
  pass "GET /telemetrie/$VEHICULE_ID/latest → 200"
  curl -s "$BASE_URL/telemetrie/$VEHICULE_ID/latest" | python3 -m json.tool 2>/dev/null || \
  curl -s "$BASE_URL/telemetrie/$VEHICULE_ID/latest"
else
  fail "GET /telemetrie/$VEHICULE_ID/latest → $HTTP (véhicule $VEHICULE_ID existe ?)"
fi

section "1e. Historique 50 dernières mesures"
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/telemetrie/$VEHICULE_ID/history")
COUNT=$(curl -s "$BASE_URL/telemetrie/$VEHICULE_ID/history" | grep -o '"id"' | wc -l)
[ "$HTTP" = "200" ] && pass "GET history → $HTTP ($COUNT mesures)" || fail "GET history → $HTTP"

section "1f. Alertes actives (dashboard temps réel)"
HTTP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/telemetrie/alertes")
COUNT=$(curl -s "$BASE_URL/telemetrie/alertes" | grep -o '"id"' | wc -l)
[ "$HTTP" = "200" ] && pass "GET alertes → $HTTP ($COUNT alertes actives)" || fail "GET alertes → $HTTP"

# ─────────────────────────────────────────────────────────────
section "MODULE 2 : VALIDATEUR TICKET (ESP32 + Lecteur NFC/RFID)"
info "Simule le lecteur embarqué dans le bus, ticket ID=$TICKET_ID"
# ─────────────────────────────────────────────────────────────

section "2a. Validation ticket ID=$TICKET_ID (doit être PAYE)"
RESP=$(curl -s -X POST "$BASE_URL/tickets/validate" \
  -H "Content-Type: application/json" \
  -d "{\"ticketId\": $TICKET_ID}")
echo "  Réponse: $RESP"
OK=$(echo "$RESP" | grep -o '"message":"Ticket valide"' | wc -l)
if [ "$OK" -gt 0 ]; then
  PASSAGER=$(echo "$RESP" | grep -o '"passagerNom":"[^"]*"')
  DEST=$(echo "$RESP" | grep -o '"voyageDest":"[^"]*"')
  pass "Ticket $TICKET_ID VALIDÉ → $PASSAGER | $DEST"
  info "  → ESP32 afficherait sur LCD : BIENVENUE $PASSAGER"
else
  ERR=$(echo "$RESP" | grep -o '"error":"[^"]*"')
  fail "Ticket $TICKET_ID refusé : $ERR"
fi

section "2b. Re-validation du même ticket (doit être rejeté DEJA UTILISE)"
RESP=$(curl -s -X POST "$BASE_URL/tickets/validate" \
  -H "Content-Type: application/json" \
  -d "{\"ticketId\": $TICKET_ID}")
echo "  Réponse: $RESP"
DEJA=$(echo "$RESP" | grep -oi '"error":"Ticket deja utilise"' | wc -l)
HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/tickets/validate" \
  -H "Content-Type: application/json" -d "{\"ticketId\": $TICKET_ID}")
if [ "$DEJA" -gt 0 ] || [ "$HTTP" = "400" ]; then
  pass "Double passage refusé correctement (400 Bad Request)"
  info "  → ESP32 afficherait : TICKET DÉJÀ UTILISÉ"
else
  fail "Double passage non détecté (attendu 400)"
fi

section "2c. Ticket inexistant (ID 99999)"
HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/tickets/validate" \
  -H "Content-Type: application/json" \
  -d '{"ticketId": 99999}')
[ "$HTTP" = "404" ] && pass "Ticket inconnu → 404 (correct)" || fail "Ticket inconnu → $HTTP (attendu 404)"

section "2d. Body invalide (ticketId manquant)"
HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/tickets/validate" \
  -H "Content-Type: application/json" \
  -d '{}')
[ "$HTTP" = "400" ] && pass "Body invalide → 400 (correct)" || fail "Body invalide → $HTTP (attendu 400)"

# ─────────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}══════════════════════════════════════════${NC}"
echo -e "${YELLOW}  RÉCAPITULATIF TEST MODULES EMBARQUÉS${NC}"
echo -e "${YELLOW}══════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Pour simuler l'ESP32 en continu (polling toutes les 2s) :${NC}"
echo "  watch -n 2 'curl -s $BASE_URL/telemetrie/$VEHICULE_ID/latest'"
echo ""
echo -e "${CYAN}Pour simuler des données aléatoires en boucle :${NC}"
cat << 'LOOP'
  while true; do
    TEMP=$(awk 'BEGIN{printf "%.1f", 20+rand()*30}')
    GAZ=$((RANDOM % 800))
    curl -s -X POST http://localhost:8081/api/telemetrie \
      -H "Content-Type: application/json" \
      -d "{\"vehiculeId\":1,\"temperature\":$TEMP,\"humidite\":50,\"niveauGaz\":$GAZ}"
    sleep 3
  done
LOOP
echo ""
echo -e "${CYAN}Pour tester avec Wokwi (simulation ESP32 en ligne) :${NC}"
echo "  → https://wokwi.com  (créer projet ESP32 + DHT22 + MQ-2)"
echo "  → Dans le code Arduino, pointer sur http://HOST_IP:8081/api/telemetrie"
echo "  → Remplacer HOST_IP par l'IP de votre machine (pas localhost)"
echo ""
