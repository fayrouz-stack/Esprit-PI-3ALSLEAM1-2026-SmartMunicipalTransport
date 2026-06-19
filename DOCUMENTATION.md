# 📚 Documentation Technique — Municipal Transport App

> **Stack** : Angular 21 (standalone: false, NgModule) · Spring Boot 3.4.5 / Java 17 · PostgreSQL 16  
> **UI** : CoreUI Angular 5.6  
> **Déploiement** : Docker Compose (pg:5433, backend:8081, frontend:4200)

---

## 🏗️ Architecture Générale

```
municipal-transport-angular-app-main/   ← Frontend Angular
municipal-transport-backend/            ← Backend Spring Boot
docker-compose.yml                      ← Orchestration Docker
```

### Environnement Angular
```ts
// src/app/environnement/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'
};
```

### Patterns transversaux appliqués à tous les modules

| Pattern | Description |
|---|---|
| `ChangeDetectionStrategy.OnPush` | Tous les composants de liste utilisent OnPush + `markForCheck()` |
| **In-memory cache** | `private cache: T[] \| null = null` — `of(cache)` si cache présent, `tap(d => cache=d)` sinon |
| **try/finally loading** | Spinner fiable : `try { this.data = res } finally { this.loading = false; this.cdr.markForCheck() }` |
| **`@for` / `@empty`** | Syntaxe Angular 17+ avec `track id` + bloc `@empty` pour état vide |
| **Gradient headers** | `linear-gradient(135deg, #321fdb, <couleur>)` — couleur secondaire variable par module |
| **KPI cards** | Cartes statistiques en haut de chaque liste (visible si `!loading && data.length > 0`) |
| **`forkJoin`** | Chargement parallèle de ressources multiples (affectation, véhicule détail, etc.) |

---

## 🗂️ Modules Angular

---

## 📅 Module Horaire

### Modèle (`horaire.model.ts`)
```ts
interface Horaire {
  id?: number;
  date_voyage: string;       // ISO date
  horaire_depart: string;    // "HH:mm:ss"
  horaire_arrive: string;    // "HH:mm:ss"
  retard_estime?: number;    // minutes
  ligne?: Ligne;
  stationDepart?: Station;
  stationArrivee?: Station;
}
```

### Service (`horaire.service.ts`)
- `getAll()` / `getById(id)` / `create()` / `update()` / `delete()` — CRUD standard avec cache
- `getByLigne(ligneId)` — filtre côté backend
- **`estimerRetard(id, vehiculeId?)`** → `POST /api/horaires/{id}/estimer-retard`  
  Retourne `EstimationRetard` : `{ horaireId, retard_total, trafic, meteo, vehicule }`

```ts
export interface EstimationRetard {
  horaireId: number;
  retard_total: number;
  trafic:   { label: string; minutes: number; color: string };
  meteo:    { label: string; minutes: number };
  vehicule: { label: string; minutes: number; info?: string };
}
```

### Liste (`list/`)
**TypeScript :**
- Injecte `HoraireService` + `LigneService`
- `horaires[]`, `filtered[]`, `lignes[]`
- `searchTerm`, `filterLigne`, `filterRetard` ('' | 'ponctuel' | 'retard')
- `applyFilters()` : filtre par ligne id + retard + recherche texte (ligne/stations/date)
- `duree(depart, arrive)` : calcule diff HH:MM, gère passage minuit (diff < 0 → +24×60)
- `formatTime(time)` : extrait "HH:mm" des 5 premiers caractères

**HTML :**
- Header gradient `#321fdb → #6f42c1` + badge compteur filtré
- Barre de filtres : input recherche + dropdown Ligne + dropdown Statut retard + bouton reset
- Tableau : Ligne/Trajet · Date · Départ · Arrivée · **Durée** · Retard (badge vert/orange) · Actions

### Détail (`detail/`)
**TypeScript :**
- Injecte `HoraireService` + `VehiculeService`
- `duree()` — même algorithme que la liste
- **`estimer()`** : appelle `service.estimerRetard(id, selectedVehiculeId)`, met à jour `horaire.retard_estime`
- États : `estimating`, `estimation`, `estimationError`

**HTML :**
- Carte Ligne (avec lien "Voir la ligne →" `routerLink`)
- Cartes Station départ / Station arrivée
- Ligne de métriques : Date · Départ · Arrivée · **Durée calculée**
- Badge retard coloré (vert = 0 min, orange = retard)
- **Section Estimation de retard** :
  - Dropdown sélecteur de véhicule
  - Bouton ⚡ Estimer (spinner pendant calcul)
  - 4 cartes résultat : Total coloré · Trafic · Météo · Véhicule

---

## 🚌 Module Véhicule

### Modèle (`vehicule.model.ts`)
```ts
class Vehicule {
  id?, marque, modele, typeVehicule, etat, vehiculeDispo (boolean),
  matriculeFourni, localisation, kilometrage (number),
  dateFinAssurance, dateProchainCt, datePremiereMiseCirculation,
  carburant, dateValiditeExploitation, latitude?, longitude?
}
```
Constantes exportées : `ETATS` (label + color + icon) · `CARBURANTS` · `MARQUES` · `TYPES_VEHICULE`

### Liste (`list/`)
**TypeScript :**
- Filtres : `searchTerm`, `etatFilter`, `typeFilter`, `carburantFilter`
- Getters :
  - `stats` → `{ total, disponibles, enPanne, enReparation, enService }`
  - `types` → valeurs uniques de `typeVehicule` extraites des données
  - `carburants` → valeurs uniques de `carburant` extraites des données
- `kmClass(km)` → `'text-success'` (<100k) | `'text-warning'` (100–200k) | `'text-danger'` (>200k)

**HTML :**
- Header gradient `#321fdb → #2eb85c`
- **4 KPI cards** : Total · 🟢 Disponibles · 🔴 En panne · 🔧 En réparation
- **4 filtres** : Recherche + État + Type + Carburant + Reset
- Tableau `table-dark` : Véhicule (marque/modèle/type) · Immatriculation · État badge · **Kilométrage coloré** · Carburant · Actions

### Détail (`detail/`)
**TypeScript :**
- Injecte `VehiculeService` + `AffectationService`
- `activeTab: 'info' | 'iot' | 'affectations'`
- `loadAffectations(vehiculeId)` : filtre `Number(a.vehiculeId) === vehiculeId`, tri desc, slice(10)
- **`healthScore`** (getter 0–100) : score de santé calculé sur 4 facteurs
  - État (en panne = -40, réparation = -20, usé = -10, disponible = +10)
  - Kilométrage (< 50k = +20, < 150k = +10, < 300k = 0, sinon -15)
  - Assurance (expirée = -20, < 30j = -10, sinon 0)
  - Contrôle technique (expiré = -20, < 30j = -10, sinon 0)
- `healthColor` → `'success'` / `'warning'` / `'danger'` selon score
- `healthLabel` → libellé textuel du score
- `statutColors` : map PLANIFIEE/EN_COURS/TERMINEE/ANNULEE → couleurs CoreUI

**HTML :**
- **Barre de santé** (`c-progress`) colorée dynamiquement
- **3 onglets** :
  - 📋 **Info** : cartes infos véhicule + carte Google Maps + calendrier échéances
  - 📡 **IoT** : cartes télémétrie (données temps réel simulées)
  - 📋 **Affectations** : tableau des 10 dernières affectations (statut badge · dates · ligne · lien)

---

## 🗺️ Module Voyage

### Modèle (`models/voyage.model.ts`)
```ts
interface Voyage {
  id?, dateVoyage, nombrePlacesDisponible, prix,
  ligne?: Ligne, chauffeur?: Chauffeur, vehicule?: Vehicule, horaire?: Horaire
}
```

### Liste (`list/`)
**TypeScript :**
- Filtres : `search`, `filterStatut` ('disponible' | 'complet'), `filterLigne`
- Getter `stats` :
  - `total`, `disponibles` (places > 0), `complets` (places = 0)
  - `aujourd_hui` (date == today)
  - `revenuTotal` → `sum(prix × places)`
- `lignes` getter → lignes uniques extraites des voyages (évite un appel API)
- `duree(depart, arrive)` → calcul HH:MM
- `revenu(v)` → `v.prix × v.nombrePlacesDisponible`

**HTML :**
- Header gradient `#321fdb → #2eb85c`
- **4 KPI cards** : Total · Disponibles · Complets · Aujourd'hui
- Filtres : Recherche + Statut (disponible/complet) + Ligne + Reset
- Tableau `table-dark` :
  - Ligne/Destination (numéro + destination)
  - Date
  - Horaire/Durée (départ → arrivée + durée + badge retard si > 0)
  - Chauffeur (nom)
  - Véhicule (marque/modèle)
  - Places (badge vert/orange/rouge)
  - **Revenu potentiel** (prix × places)
  - Actions

### Détail (`detail/`)
**TypeScript :**
- `duree(depart, arrive)` — même algorithme
- `revenuPotentiel` getter → `v.prix × v.nombrePlacesDisponible`
- `getPlacesColor(places)` → `'success'` (>10) | `'warning'` (>0) | `'danger'` (=0)

**HTML :**
- 4 info cards : Destination · Date · Places disponibles · Prix
- Carte verte **Revenu potentiel** (prix × places)
- Carte violette **Durée** calculée
- Section Horaire : départ/arrivée + badge retard (⚠️ si > 0, ✅ si ponctuel)
- Cartes Véhicule et Chauffeur avec liens vers leurs détails

---

## 👤 Module Chauffeur

### Modèle (`chauffeur.model.ts`)
```ts
interface Chauffeur {
  id?, cin, nom, prenom, permis, telephone, matricule, psw, email,
  holidayRemaining?, dateStart?, lastShiftStart?, lastShiftEnd?, countWorkDays?
}
```

### Liste (`list/`)
**TypeScript :**
- Filtres : `searchTerm`, `filterPermis`
- Getter `stats` :
  - `total`
  - `enService` → chauffeurs dont `lastShiftStart` est aujourd'hui
  - `sansConges` → chauffeurs dont `holidayRemaining === 0`
  - `totalConges` → somme de tous les `holidayRemaining`
- `permisTypes` getter → types de permis uniques extraits des données
- `congesColor(n)` → `'success'` (>10) | `'warning'` (>0) | `'danger'` (=0)
- Pagination : `currentPage`, `itemsPerPage`

**HTML :**
- Header gradient `#321fdb → #1b8eb7`
- **4 KPI cards** : Total · 🟢 En service aujourd'hui · 🚫 Sans congés · 🏖️ Total jours congés
- Filtres : Recherche + Type permis (dropdown dynamique) + Reset
- Tableau `table-dark` :
  - Chauffeur (avatar initiales circulaire + nom/prénom + matricule)
  - CIN
  - Permis (badge)
  - Contact (téléphone/email)
  - **Congés** (badge coloré)
  - Jours travaillés
  - Actions

### Détail (`detail/`)
**TypeScript :**
- Injecte `ChauffeurService` + `VoyageService` + `AffectationService`
- `activeTab: 'info' | 'voyages' | 'affectations'`
- `loadVoyages(matricule)` : filtre `v.chauffeur?.matricule === matricule`, tri desc, slice(10)
- `loadAffectations(chauffeurId)` : filtre `Number(a.chauffeurId) === chauffeurId`, tri desc, slice(10)
- `anciennete(dateStart)` → `"X ans Y mois"` calculé depuis `new Date(dateStart)` jusqu'à aujourd'hui
- `congesProgress` → `(holidayRemaining / 30) * 100` (max 30 jours)
- `duree(depart, arrive)` — même algorithme que les autres modules
- `statutColors` : map statuts → couleurs CoreUI

**HTML :**
- **Hero section** : avatar grand format (64px, initiales, gradient), nom/CIN/permis badge, ancienneté
- **Barre congés** : `c-progress` colorée (vert/orange/rouge) sur 30 jours max
- **3 onglets** :
  - 📋 **Informations** : Contact · Stats (entrée/jours trav.) · Dernier service (début/fin) · Identifiants
  - 🗺️ **Voyages** : tableau 10 derniers (date · destination · horaire départ→arrivée · durée · places · prix)
  - 📋 **Affectations** : tableau 10 dernières (statut badge · dates · ligneId · remarque)

---

## 📋 Module Affectation

### Modèle (`affectation.model.ts`)
```ts
interface Affectation {
  id?, chauffeurId, vehiculeId, ligneId,
  dateDebut (ISO datetime), dateFin (ISO datetime),
  statut? ('PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE'),
  remarque?, dateCreation?
}
```

### Service (`affectation.service.ts`)
- CRUD standard : `getAll()` / `getById()` / `create()` / `update()` / `delete()`
- `getPlanning(debut, fin)` → `GET /affectations/planning?debut=...&fin=...`
- Cache in-memory invalidé sur toute mutation

### Liste (`list/`)
**TypeScript :**
- `forkJoin` charge en parallèle : `affectations` + `chauffeurs` + `vehicules` + `lignes`
- Lookup helpers : `getChauffeur(id)`, `getVehicule(id)`, `getLigne(id)`
- Filtres : `searchTerm` (nom chauffeur / matricule véhicule / destination ligne), `filterStatut`, `filterLigne`
- `duree(debut, fin)` → gère jours entiers (ex: `"2j 4h30"`)
- Getter `stats` : `{ total, planifiees, enCours, terminees, annulees }`

**HTML :**
- Header gradient `#321fdb → #6f42c1` + boutons "Planning" et "+ Ajouter"
- **4 KPI cards** : Total · 🗓️ Planifiées · ⚡ En cours · ✅ Terminées
- **3 filtres** : Recherche enrichie + Statut + **Ligne** (dropdown dynamique) + Reset
- Tableau `table-dark` :
  - **Chauffeur** : avatar initiales + nom complet + matricule (au lieu de l'ID)
  - **Véhicule** : marque/modèle + immatriculation (au lieu de l'ID)
  - **Ligne** : numéro + destination (au lieu de l'ID)
  - Période (début / fin)
  - **Durée calculée**
  - Statut badge
  - Actions

### Détail (`detail/`)
**TypeScript :**
- `forkJoin` charge en parallèle chauffeur + véhicule + ligne après récupération de l'affectation
- `duree()` → gère jours entiers
- `statutLabel` getter → label emoji (`🗓️ Planifiée`, `⚡ En cours`, `✅ Terminée`, `❌ Annulée`)
- `statutColor(statut)` → couleur CoreUI badge

**HTML :**
- **Banner statut** : bandeau coloré avec statut label + durée calculée (côté droit)
- **3 cartes entités** :
  - 👤 **Chauffeur** : avatar + nom + matricule + permis badge + lien "Voir le chauffeur →"
  - 🚌 **Véhicule** : marque/modèle + immat + type + carburant + état badge + lien "Voir le véhicule →"
  - 🛤️ **Ligne** : numéro + destination + nb stations + lien "Voir la ligne →"
- Cartes Date début (jaune) / Date fin (rouge) avec heure séparée
- Remarque (affichée si présente)
- Date de création (si présente)

---

## 🛤️ Module Ligne

### Modèle
```ts
interface Ligne { id?, numero, destination, stations?: Station[] }
```
### Fonctionnalités existantes
- CRUD standard (liste + détail + ajout + édition)
- Gestion des stations associées (`addStation`)
- Service avec cache in-memory

---

## 📍 Module Station

### Modèle
```ts
interface Station { id?, nom, adresse, ville }
```
### Fonctionnalités existantes
- CRUD standard (liste + détail + ajout + édition)

---

## 🎫 Module Ticket

### Modèle
```ts
interface Ticket {
  id?, numero?, voyageId, nombreBillets, montantTotal,
  methodePaiement, passagerNom, passagerEmail?, dateCreation?, statut?
}
interface TicketStats { totalTickets, revenuTotal, ticketsAujourdhui }
```
### Fonctionnalités existantes
- CRUD standard (liste + détail + ajout + édition)
- `TicketStats` pour dashboard

---

## ⚙️ Backend Spring Boot

### Architecture
```
municipal_transport_backend/alternate/smartbus/
  controller/   → REST controllers (@RequestMapping("/api/..."))
  service/      → Logique métier (@Service)
  repository/   → JPA repositories
  config/       → CorsConfig (FilterRegistrationBean<CorsFilter>)
```

### Configuration
```properties
# application.properties
spring.jpa.hibernate.ddl-auto=update
server.port=8080   # exposé sur 8081 via Docker
```

### CORS
```java
// CorsConfig.java
FilterRegistrationBean<CorsFilter> — autorise toutes origines pour /api/**
```

### Endpoints principaux

| Module | Endpoints |
|---|---|
| **Horaire** | `GET/POST /api/horaires` · `GET/PUT/DELETE /api/horaires/{id}` · `GET /api/horaires/by-ligne/{ligneId}` · **`POST /api/horaires/{id}/estimer-retard`** |
| **Véhicule** | `GET/POST /api/vehicules` · `GET/PUT/DELETE /api/vehicules/{id}` |
| **Voyage** | `GET/POST /api/voyages` · `GET/PUT/DELETE /api/voyages/{id}` |
| **Chauffeur** | `GET/POST /api/chauffeurs` · `GET/PUT/DELETE /api/chauffeurs/{id}` |
| **Affectation** | `GET/POST /api/affectations` · `GET/PUT/DELETE /api/affectations/{id}` · `GET /api/affectations/planning?debut=&fin=` |
| **Ligne** | `GET/POST /api/lignes` · `POST /api/lignes/{id}/stations/{stationId}` |
| **Station** | `GET/POST /api/stations` · CRUD standard |
| **Ticket** | `GET/POST /api/tickets` · CRUD standard |

### 🧠 Endpoint d'estimation de retard (nouveau)
`POST /api/horaires/{id}/estimer-retard`  
Body optionnel : `{ "vehiculeId": 5 }`

**3 facteurs calculés :**

| Facteur | Logique |
|---|---|
| **Trafic** | Weekend/nuit = 0 min · Heure de pointe (7–9h, 17–19h) = +12 min · Déjeuner (12–14h) = +6 min · Normal = +3 min |
| **Météo** | Simulée selon la saison : été (soleil/orage) · hiver (pluie/neige/gel) · autres (averses) |
| **Véhicule** | En panne = +20 · Réparation = +10 · Usé = +5 · Neuf = −2 · Km > 200k = +3 bonus |

Met à jour `retard_estime` sur l'entité `Horaire` et persiste en base.

---

## 🐳 Docker Compose

```yaml
services:
  postgres:   image: postgres:16    ports: "5433:5432"
  backend:    build: ./municipal-transport-backend    ports: "8081:8080"
  frontend:   build: ./municipal-transport-angular-app-main    ports: "4200:4200"
```

**Commande de lancement :**
```bash
cd /path/to/workspace
docker compose up --build
```

---

## 🚀 Lancement en développement local

```bash
# Frontend
cd municipal-transport-angular-app-main
npm install
ng serve --port 4200

# Backend (nécessite PostgreSQL sur 5432 ou 5433)
cd municipal-transport-backend
./mvnw spring-boot:run
```

---

## 📐 Conventions de code

| Convention | Détail |
|---|---|
| **Composants** | `standalone: false` — tous dans un NgModule |
| **Services** | `inject()` préféré à constructeur pour les nouveaux composants |
| **Détection** | `ChangeDetectionStrategy.OnPush` + `cdr.markForCheck()` après chaque mutation async |
| **Routing** | Lazy-loading par module (`loadChildren`) |
| **Couleurs gradient** | Horaire `#321fdb→#6f42c1` · Véhicule `#321fdb→#2eb85c` · Voyage `#321fdb→#2eb85c` · Chauffeur `#321fdb→#1b8eb7` · Affectation `#321fdb→#6f42c1` |
| **Statuts affectation** | `PLANIFIEE`=info · `EN_COURS`=primary · `TERMINEE`=success · `ANNULEE`=danger |
| **Durée** | Algorithme commun : diff minutes, gère minuit, format `Xh MM` ou `N min` ou `Xj Yh MM` |
