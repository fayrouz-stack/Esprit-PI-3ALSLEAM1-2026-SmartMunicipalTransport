# 🚌 Municipal Transport System

## Description
Smart Municipal Transport System est une application de gestion du transport urbain municipal. Elle permet de gérer les chauffeurs, véhicules, lignes, stations, horaires, voyages et tickets etc.

## Technologies utilisées
- **Frontend** : Angular 21
- **Backend** : Spring Boot 3.4.5
- **Base de données** : PostgreSQL 16
- **Orchestration** : Docker Compose

## Auteurs
- **Fayrouz Boughdiri/Houyem Msellmi/Mayssa Oueslati/Aymen Chmengui/Mohamed Slaimi/Khalil Hechmi** --- 3ALSLEAM1 --- 2025-2026 --- Tuteur : [Sana Ben Fadhel-Ichraf Ayari]
---

## Prérequis

| Outil | Version minimale |
|-------|-----------------|
| Docker | 20+ |
| Docker Compose | v2 (intégré à Docker Desktop) |

> Node.js et npm ne sont **pas** nécessaires en local — tout s'exécute dans Docker.

---

## 1. Lancement complet (recommandé)

Depuis la **racine** du projet (là où se trouve `docker-compose.yml`) :

```bash
docker compose up --build
```

Les 3 services démarrent automatiquement dans l'ordre correct :
1. **PostgreSQL** (healthcheck attendu)
2. **Backend Spring Boot** (attend que PostgreSQL soit prêt)
3. **Frontend Angular** (ng serve avec hot-reload)

### Accès

| Service | URL |
|---------|-----|
| Frontend Angular | http://localhost:4200 |
| Backend API | http://localhost:8081/api |
| PostgreSQL | localhost:**5433** |

### Arrêter les services
```bash
docker compose down
```

### Arrêter et supprimer les données persistées
```bash
docker compose down -v
```

---

## 2. Peupler la base de données (seed)

Après le premier démarrage, exécuter le script de données initiales :

```bash
docker exec -i municipal-postgres psql -U postgres -d municipal_transport < seed.sql
```

Ce script insère :
- 12 chauffeurs (matricules BUS-01 → BUS-12)
- 12 véhicules (bus, minibus, tramway)
- 10 lignes de transport
- 20 horaires
- 15 stations
- 15 voyages
- 20 tickets

> Le fichier `seed.sql` se trouve à la racine du projet.

---

## 3. Tables PostgreSQL

| Table | Description |
|-------|-------------|
| `chauffeur` | Chauffeurs (nom, prénom, matricule, permis, kilométrage...) |
| `vehicule` | Véhicules (marque, modèle, type, état, disponibilité...) |
| `ligne` | Lignes de transport (numéro, origine, destination) |
| `station` | Stations (nom, adresse, ville) |
| `horaire` | Horaires (date, heure départ/arrivée, retard estimé) |
| `voyage` | Voyages (date, places totales/disponibles, prix, FK vers ligne/horaire/véhicule/chauffeur) |
| `ticket` | Tickets (numéro, passager, montant, statut de paiement) |

> Les tables sont créées automatiquement au démarrage via Hibernate (`ddl-auto=update`).

---

## 4. Endpoints API

Base URL : `http://localhost:8081/api`

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET / POST | `/chauffeurs` | Liste tous les chauffeurs / Créer |
| GET / PUT / DELETE | `/chauffeurs/{id}` | Détail / Modifier / Supprimer |
| GET / POST | `/vehicules` | Liste tous les véhicules / Créer |
| GET / PUT / DELETE | `/vehicules/{id}` | Détail / Modifier / Supprimer |
| GET / POST | `/lignes` | Liste toutes les lignes / Créer |
| GET / PUT / DELETE | `/lignes/{id}` | Détail / Modifier / Supprimer |
| GET / POST | `/stations` | Liste toutes les stations / Créer |
| GET / PUT / DELETE | `/stations/{id}` | Détail / Modifier / Supprimer |
| GET / POST | `/horaires` | Liste tous les horaires / Créer |
| GET / PUT / DELETE | `/horaires/{id}` | Détail / Modifier / Supprimer |
| GET / POST | `/voyages` | Liste tous les voyages / Créer |
| GET / PUT / DELETE | `/voyages/{id}` | Détail / Modifier / Supprimer |
| POST | `/payments/process` | Traiter un paiement |

---

## 5. Modules Angular

| Route | Module |
|-------|--------|
| `/dashboard` | Tableau de bord dynamique (stats temps réel) |
| `/chauffeurs` | Gestion des chauffeurs |
| `/vehicules` | Gestion des véhicules |
| `/lignes` | Gestion des lignes |
| `/stations` | Gestion des stations |
| `/horaires` | Gestion des horaires |
| `/voyages` | Gestion des voyages |

---

## 6. Configuration Docker

| Conteneur | Image | Port externe → interne |
|-----------|-------|------------------------|
| `municipal-postgres` | postgres:16 | 5433 → 5432 |
| `municipal-backend` | Spring Boot (build local) | 8081 → 8080 |
| `municipal-frontend` | Node 20 Alpine (build local) | 4200 → 4200 |

Le frontend utilise un **volume monté** (`./municipal-transport-angular-app-main:/app`) pour le hot-reload lors du développement.  
Le cache Angular est configuré dans `/tmp` à l'intérieur du conteneur pour éviter les boucles de rebuild.

---

## 7. Connexion manuelle à PostgreSQL

```bash
docker exec -it municipal-postgres psql -U postgres -d municipal_transport
```

Commandes utiles dans psql :
```sql
\dt                  -- lister les tables
SELECT * FROM chauffeur LIMIT 5;
SELECT * FROM voyage LIMIT 5;
\q                   -- quitter
```
