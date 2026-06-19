#!/bin/bash

BASE_URL="http://localhost:8081/api"

echo "=========================================="
echo "🧪 TEST CRUD COMPLET - MUNICIPAL TRANSPORT"
echo "=========================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local expected=$4
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data")
    fi
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✅ $method $url → $response${NC}"
    else
        echo -e "${RED}❌ $method $url → $response (attendu $expected)${NC}"
    fi
}

echo ""
echo "📌 1. TEST STATION"
echo "------------------"
test_endpoint "GET" "$BASE_URL/stations" "" 200
test_endpoint "GET" "$BASE_URL/stations/1" "" 200
test_endpoint "POST" "$BASE_URL/stations" '{"nom":"Test Station","adresse":"123 Rue","ville":"Tunis"}' 200
test_endpoint "PUT" "$BASE_URL/stations/1" '{"nom":"Station Modifiée","adresse":"456 Avenue","ville":"Sousse"}' 200
test_endpoint "DELETE" "$BASE_URL/stations/2" "" 200

echo ""
echo "📌 2. TEST LIGNE"
echo "----------------"
test_endpoint "GET" "$BASE_URL/lignes" "" 200
test_endpoint "GET" "$BASE_URL/lignes/1" "" 200
test_endpoint "POST" "$BASE_URL/lignes" '{"numero":"L99","destination":"Test Destination"}' 200
test_endpoint "PUT" "$BASE_URL/lignes/1" '{"numero":"L01","destination":"Tunis - Sousse Modifié"}' 200
test_endpoint "DELETE" "$BASE_URL/lignes/11" "" 200

echo ""
echo "📌 3. TEST HORAIRE"
echo "-----------------"
test_endpoint "GET" "$BASE_URL/horaires" "" 200
test_endpoint "GET" "$BASE_URL/horaires/1" "" 200
test_endpoint "POST" "$BASE_URL/horaires" '{"date_voyage":"2026-07-01","horaire_depart":"08:00:00","horaire_arrive":"12:00:00","retard_estime":0}' 200
test_endpoint "PUT" "$BASE_URL/horaires/1" '{"date_voyage":"2026-07-01","horaire_depart":"09:00:00","horaire_arrive":"13:00:00","retard_estime":5}' 200
test_endpoint "DELETE" "$BASE_URL/horaires/23" "" 200

echo ""
echo "📌 4. TEST VEHICULE"
echo "------------------"
test_endpoint "GET" "$BASE_URL/vehicules" "" 200
test_endpoint "GET" "$BASE_URL/vehicules/all" "" 200
test_endpoint "GET" "$BASE_URL/vehicules/1" "" 200
test_endpoint "POST" "$BASE_URL/vehicules" '{"marque":"Test","modele":"Test","typeVehicule":"Bus","etat":"neuf","vehiculeDispo":true,"matriculeFourni":"TN-999-TEST2","localisation":"Tunis","kilometrage":0,"carburant":"Diesel"}' 200
test_endpoint "PUT" "$BASE_URL/vehicules/13" '{"marque":"Test Modifié","modele":"Test Modifié","typeVehicule":"Bus","etat":"bon état","vehiculeDispo":true,"matriculeFourni":"TN-999-TEST2","localisation":"Sousse","kilometrage":100,"carburant":"Diesel"}' 200
test_endpoint "DELETE" "$BASE_URL/vehicules/13" "" 200

echo ""
echo "📌 5. TEST CHAUFFEUR"
echo "-------------------"
test_endpoint "GET" "$BASE_URL/chauffeurs" "" 200
test_endpoint "GET" "$BASE_URL/chauffeurs/all" "" 200
test_endpoint "GET" "$BASE_URL/chauffeurs/1" "" 200
test_endpoint "POST" "$BASE_URL/chauffeurs" '{"cin":"99999999","nom":"Test","prenom":"Testeur","permis":"D","telephone":"22 999 999","email":"test@email.com"}' 200
test_endpoint "PUT" "$BASE_URL/chauffeurs/13" '{"cin":"99999999","nom":"Test Modifié","prenom":"Testeur","permis":"D","telephone":"22 999 999","email":"test@email.com","matricule":"BUS-99"}' 200
test_endpoint "DELETE" "$BASE_URL/chauffeurs/13" "" 200

echo ""
echo "📌 6. TEST VOYAGE"
echo "----------------"
test_endpoint "GET" "$BASE_URL/voyages" "" 200
test_endpoint "GET" "$BASE_URL/voyages/1" "" 200
test_endpoint "POST" "$BASE_URL/voyages" '{"dateVoyage":"2026-07-01","nombrePlacesDisponible":50,"prix":45.0,"ligne":{"id":1},"horaire":{"id":1},"vehicule":{"id":1},"chauffeur":{"matricule":"BUS-01"}}' 200
test_endpoint "PUT" "$BASE_URL/voyages/16" '{"dateVoyage":"2026-07-15","nombrePlacesDisponible":40,"prix":50.0,"ligne":{"id":1},"horaire":{"id":1},"vehicule":{"id":1},"chauffeur":{"matricule":"BUS-01"}}' 200
test_endpoint "DELETE" "$BASE_URL/voyages/16" "" 200

echo ""
echo "📌 7. TEST TICKET"
echo "----------------"
test_endpoint "GET" "$BASE_URL/tickets" "" 200
test_endpoint "GET" "$BASE_URL/tickets/1" "" 200
test_endpoint "POST" "$BASE_URL/tickets" '{"voyageId":1,"nombreBillets":2,"montantTotal":30.0,"methodePaiement":"CB","passagerNom":"Test Passager","passagerEmail":"test@email.com","statut":"PAYE"}' 200
test_endpoint "PUT" "$BASE_URL/tickets/21" '{"voyageId":1,"nombreBillets":3,"montantTotal":45.0,"methodePaiement":"CB","passagerNom":"Test Modifié","passagerEmail":"test@email.com","statut":"PAYE"}' 200
test_endpoint "DELETE" "$BASE_URL/tickets/21" "" 200

echo ""
echo "📌 8. TEST PAYMENT"
echo "-----------------"
test_endpoint "POST" "$BASE_URL/payments/process" '{"voyageId":1,"nbBillets":2,"methode":"CB","passagerNom":"Jean Test","passagerEmail":"jean@test.com"}' 200

echo ""
echo "=========================================="
echo "✅ TEST TERMINÉ"
echo "=========================================="
