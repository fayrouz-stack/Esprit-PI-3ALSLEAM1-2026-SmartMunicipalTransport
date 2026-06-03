-- ============================================================
--  Données initiales — Municipal Transport
--  Exécuté par Spring Boot APRÈS création du schéma Hibernate
--  (spring.jpa.defer-datasource-initialization=true)
--  INSERT ... ON CONFLICT DO NOTHING → safe sur restart
-- ============================================================

-- 1. LIGNES
INSERT INTO ligne (numero, destination) VALUES
  ('L01', 'Tunis — Sousse'),
  ('L02', 'Tunis — Sfax'),
  ('L03', 'Tunis — Bizerte'),
  ('L04', 'Tunis — Nabeul'),
  ('L05', 'Sousse — Monastir'),
  ('L06', 'Sfax — Gabès'),
  ('L07', 'Tunis — Kairouan'),
  ('L08', 'Tunis — Le Kef'),
  ('L09', 'Sousse — Hammamet'),
  ('L10', 'Gabès — Médenine')
ON CONFLICT DO NOTHING;

-- 2. STATIONS
INSERT INTO station (nom, adresse, ville) VALUES
  ('Gare Routière Sud',         'Avenue de la République',  'Tunis'),
  ('Gare Routière Nord',        'Rue de Marseille',         'Tunis'),
  ('Terminal Bab Saadoun',      'Place Bab Saadoun',        'Tunis'),
  ('Gare de Sousse',            'Avenue Habib Bourguiba',   'Sousse'),
  ('Terminal Sfax Centre',      'Avenue Ali Belhouane',     'Sfax'),
  ('Station Bizerte Port',      'Rue d''Espagne',           'Bizerte'),
  ('Gare Nabeul',               'Avenue Hédi Chaker',       'Nabeul'),
  ('Terminal Monastir',         'Route de la Corniche',     'Monastir'),
  ('Station Gabès Centre',      'Avenue Farhat Hached',     'Gabès'),
  ('Gare Kairouan',             'Avenue de la République',  'Kairouan'),
  ('Terminal Le Kef',           'Place de l''Indépendance', 'Le Kef'),
  ('Station Hammamet',          'Avenue des Nations Unies', 'Hammamet'),
  ('Gare Médenine',             'Rue 18 Janvier',           'Médenine'),
  ('Terminal La Marsa',         'Avenue Taieb Mehiri',      'La Marsa'),
  ('Station Ariana',            'Avenue de la Liberté',     'Ariana')
ON CONFLICT DO NOTHING;

-- 3. HORAIRES
INSERT INTO horaire (date_voyage, horaire_depart, horaire_arrive, retard_estime) VALUES
  ('2026-06-01', '06:00', '08:30',  0),
  ('2026-06-01', '08:00', '10:30',  0),
  ('2026-06-01', '10:00', '14:00',  5),
  ('2026-06-01', '14:00', '18:30',  0),
  ('2026-06-02', '07:00', '09:30',  0),
  ('2026-06-02', '09:00', '11:30', 10),
  ('2026-06-02', '13:00', '17:00',  0),
  ('2026-06-03', '06:30', '10:30',  0),
  ('2026-06-03', '11:00', '13:00',  0),
  ('2026-06-05', '08:00', '09:00',  0),
  ('2026-06-05', '15:00', '19:30', 20),
  ('2026-06-10', '07:30', '11:00',  0),
  ('2026-06-10', '14:30', '18:00',  0),
  ('2026-06-15', '06:00', '09:00',  0),
  ('2026-06-15', '12:00', '16:30',  5),
  ('2026-06-20', '08:00', '12:00',  0),
  ('2026-06-20', '16:00', '20:00', 15),
  ('2026-07-01', '07:00', '11:30',  0),
  ('2026-07-01', '13:00', '17:30',  0),
  ('2026-07-15', '09:00', '14:00',  0)
ON CONFLICT DO NOTHING;

-- 4. VÉHICULES  (ON CONFLICT sur matricule_fourni qui est UNIQUE)
INSERT INTO vehicule (
  marque, modele, type_vehicule, etat, vehicule_dispo,
  matricule_fourni, localisation, kilometrage, carburant,
  date_fin_assurance, date_prochain_ct,
  date_premiere_mise_circulation, date_validite_exploitation
) VALUES
  ('Mercedes', 'Sprinter 516',  'Minibus', 'bon état',      true,  'TN-101-AA', 'Tunis',    45000, 'Diesel',  '2027-06-01', '2026-11-01', '2020-03-15', '2027-06-01'),
  ('Volvo',    'B8R',           'Bus',     'neuf',          true,  'TN-202-BB', 'Sousse',   12000, 'Diesel',  '2028-01-01', '2027-06-01', '2024-01-10', '2029-01-01'),
  ('MAN',      'Lion Coach',    'Car',     'bon état',      true,  'TN-303-CC', 'Sfax',     78000, 'Diesel',  '2026-09-01', '2026-08-15', '2018-06-20', '2026-12-01'),
  ('Isuzu',    'NQR 75',        'Minibus', 'bon état',      true,  'TN-404-DD', 'Bizerte',  33000, 'Diesel',  '2027-03-01', '2026-10-01', '2021-09-05', '2027-03-01'),
  ('Renault',  'Master III',    'Minibus', 'en réparation', false, 'TN-505-EE', 'Tunis',    95000, 'Diesel',  '2026-04-01', '2026-03-01', '2016-11-12', '2026-06-01'),
  ('Volvo',    'B9TL',          'Bus',     'neuf',          true,  'TN-606-FF', 'Nabeul',    8000, 'Diesel',  '2028-12-01', '2028-06-01', '2025-02-01', '2030-01-01'),
  ('Mercedes', 'Tourismo 16',   'Car',     'bon état',      true,  'TN-707-GG', 'Sousse',   52000, 'Diesel',  '2026-12-01', '2026-09-01', '2019-05-22', '2027-01-01'),
  ('King Long','XMQ6127',       'Car',     'bon état',      true,  'TN-808-HH', 'Kairouan', 41000, 'Diesel',  '2027-08-01', '2027-02-01', '2022-07-18', '2028-01-01'),
  ('MAN',      'A21',           'Bus',     'hors service',  false, 'TN-909-II', 'Sfax',    140000, 'Diesel',  '2024-12-01', '2024-06-01', '2012-03-01', '2025-01-01'),
  ('Isuzu',    'Citibus',       'Bus',     'bon état',      true,  'TN-010-JJ', 'Monastir', 67000, 'GNC',     '2027-01-01', '2026-12-01', '2020-10-30', '2027-06-01'),
  ('Yutong',   'ZK6118H',       'Car',     'neuf',          true,  'TN-011-KK', 'Tunis',     5000, 'Diesel',  '2029-06-01', '2028-12-01', '2025-07-01', '2030-06-01'),
  ('Hyundai',  'Universe',      'Car',     'bon état',      true,  'TN-012-LL', 'Gabès',    29000, 'Diesel',  '2027-04-01', '2026-11-15', '2021-04-14', '2027-04-01')
ON CONFLICT (matricule_fourni) DO NOTHING;

-- 5. CHAUFFEURS  (ON CONFLICT sur matricule qui est UNIQUE)
INSERT INTO chauffeur (
  cin, nom, prenom, permis, telephone, matricule, psw, email,
  holiday_remaining, date_start, last_shift_start, last_shift_end, count_work_days
) VALUES
  ('12345678', 'Ben Ali',    'Mohamed', 'D', '22 123 456', 'BUS-01', 'Ch@uff3ur!01', 'med.benali@transport.tn',      15, '2020-01-15', '2026-05-21 08:00', '2026-05-21 16:00', 520),
  ('87654321', 'Trabelsi',   'Sami',    'D', '22 654 321', 'BUS-02', 'Ch@uff3ur!02', 'sami.trabelsi@transport.tn',   10, '2019-03-01', '2026-05-21 06:00', '2026-05-21 14:00', 680),
  ('11223344', 'Hammami',    'Khaled',  'D', '25 112 233', 'BUS-03', 'Ch@uff3ur!03', 'khaled.hammami@transport.tn',  20, '2021-06-15', '2026-05-20 08:00', '2026-05-20 16:00', 310),
  ('44332211', 'Gharbi',     'Hatem',   'D', '27 443 322', 'BUS-04', 'Ch@uff3ur!04', 'hatem.gharbi@transport.tn',     8, '2018-09-01', '2026-05-21 14:00', '2026-05-21 22:00', 780),
  ('55667788', 'Bouazizi',   'Riadh',   'D', '23 556 677', 'BUS-05', 'Ch@uff3ur!05', 'riadh.bouazizi@transport.tn',  25, '2022-02-01', '2026-05-19 08:00', '2026-05-19 16:00', 220),
  ('99887766', 'Meddeb',     'Tarek',   'D', '28 998 877', 'BUS-06', 'Ch@uff3ur!06', 'tarek.meddeb@transport.tn',    12, '2017-11-20', '2026-05-21 06:30', '2026-05-21 14:30', 920),
  ('33445566', 'Chahed',     'Amine',   'D', '24 334 455', 'BUS-07', 'Ch@uff3ur!07', 'amine.chahed@transport.tn',    18, '2023-04-10', '2026-05-20 14:00', '2026-05-20 22:00', 160),
  ('77665544', 'Jlassi',     'Slim',    'D', '29 776 655', 'BUS-08', 'Ch@uff3ur!08', 'slim.jlassi@transport.tn',      5, '2020-07-01', '2026-05-21 22:00', '2026-05-22 06:00', 480),
  ('22334455', 'Dridi',      'Nabil',   'D', '26 223 344', 'BUS-09', 'Ch@uff3ur!09', 'nabil.dridi@transport.tn',     30, '2016-05-01', '2026-05-18 08:00', '2026-05-18 16:00', 1050),
  ('66778899', 'Zouari',     'Fathi',   'D', '21 667 788', 'BUS-10', 'Ch@uff3ur!10', 'fathi.zouari@transport.tn',    15, '2021-01-10', '2026-05-21 08:00', '2026-05-21 16:00', 375),
  ('10293847', 'Mansouri',   'Bassem',  'D', '58 102 938', 'BUS-11', 'Ch@uff3ur!11', 'bassem.mansouri@transport.tn',  7, '2019-08-25', '2026-05-21 06:00', '2026-05-21 14:00', 610),
  ('38475610', 'Oueslati',   'Lotfi',   'D', '52 384 756', 'BUS-12', 'Ch@uff3ur!12', 'lotfi.oueslati@transport.tn',  22, '2022-11-01', '2026-05-20 22:00', '2026-05-21 06:00', 280)
ON CONFLICT (matricule) DO NOTHING;

-- 6. VOYAGES
INSERT INTO voyage (
  date_voyage, nombre_places_disponible, prix,
  ligne_id, horaire_id, vehicule_id, matricule_cond
) SELECT
  v.date_voyage, v.places, v.prix, v.lid, v.hid, v.vid, v.mat
FROM (VALUES
  ('2026-06-01'::date,  20, 15.0,  1,  2,  1, 'BUS-01'),
  ('2026-06-01'::date,  45, 35.0,  2,  4,  2, 'BUS-02'),
  ('2026-06-01'::date,  12, 10.0,  3,  1,  4, 'BUS-03'),
  ('2026-06-02'::date,  20, 15.0,  1,  5,  1, 'BUS-01'),
  ('2026-06-02'::date,  50, 40.0,  2,  7,  6, 'BUS-04'),
  ('2026-06-02'::date,  30, 20.0,  4,  6,  8, 'BUS-05'),
  ('2026-06-03'::date,  45, 35.0,  2,  8, 11, 'BUS-06'),
  ('2026-06-03'::date,  18, 12.0,  5,  9,  4, 'BUS-07'),
  ('2026-06-05'::date,  40, 30.0,  7, 12,  7, 'BUS-08'),
  ('2026-06-05'::date,  50, 45.0,  8, 11, 11, 'BUS-09'),
  ('2026-06-10'::date,  20, 15.0,  1, 12,  1, 'BUS-10'),
  ('2026-06-10'::date,  35, 25.0,  6, 13, 10, 'BUS-11'),
  ('2026-06-15'::date,  45, 35.0,  2, 14,  2, 'BUS-12'),
  ('2026-06-20'::date,  20, 18.0,  9, 16,  4, 'BUS-03'),
  ('2026-07-01'::date,  50, 50.0, 10, 18,  8, 'BUS-06')
) AS v(date_voyage, places, prix, lid, hid, vid, mat)
WHERE NOT EXISTS (SELECT 1 FROM voyage WHERE date_voyage = v.date_voyage AND ligne_id = v.lid AND horaire_id = v.hid);

-- 7. TICKETS  (ON CONFLICT sur numero)
INSERT INTO ticket (
  numero, voyage_id, nombre_billets, montant_total,
  methode_paiement, passager_nom, passager_email,
  date_creation, statut
) VALUES
  ('TKT-2026-001', 1, 2,  30.0, 'Espèces',  'Aymen Saidi',       'aymen.saidi@gmail.com',      '2026-05-15 10:00', 'PAYE'),
  ('TKT-2026-002', 1, 1,  15.0, 'CB',       'Ines Jebali',       'ines.jebali@outlook.com',    '2026-05-16 09:30', 'PAYE'),
  ('TKT-2026-003', 2, 3, 105.0, 'CB',       'Karim Rezgui',      'karim.rezgui@gmail.com',     '2026-05-17 14:00', 'PAYE'),
  ('TKT-2026-004', 2, 2,  70.0, 'Virement', 'Sonia Belhaj',      'sonia.belhaj@transport.tn',  '2026-05-18 11:15', 'PAYE'),
  ('TKT-2026-005', 3, 1,  10.0, 'Espèces',  'Omar Ferchichi',    null,                         '2026-05-19 08:45', 'PAYE'),
  ('TKT-2026-006', 4, 2,  30.0, 'CB',       'Mariem Tounsi',     'mariem.tounsi@gmail.com',    '2026-05-19 16:30', 'PAYE'),
  ('TKT-2026-007', 5, 4, 160.0, 'CB',       'Houssem Missaoui',  'h.missaoui@gmail.com',       '2026-05-20 09:00', 'PAYE'),
  ('TKT-2026-008', 5, 1,  40.0, 'Espèces',  'Wafa Khemiri',      null,                         '2026-05-20 10:30', 'PAYE'),
  ('TKT-2026-009', 6, 2,  40.0, 'Virement', 'Bilel Nasri',       'bilel.nasri@outlook.com',    '2026-05-20 14:00', 'PAYE'),
  ('TKT-2026-010', 7, 3, 105.0, 'CB',       'Hanen Chaari',      'hanen.chaari@gmail.com',     '2026-05-20 15:30', 'PAYE'),
  ('TKT-2026-011', 8, 1,  12.0, 'Espèces',  'Rafik Slama',       null,                         '2026-05-21 08:00', 'PAYE'),
  ('TKT-2026-012', 9, 2,  60.0, 'CB',       'Asma Khelifi',      'asma.khelifi@gmail.com',     '2026-05-21 09:15', 'PAYE'),
  ('TKT-2026-013',10, 1,  45.0, 'CB',       'Walid Larbi',       'walid.larbi@gmail.com',      '2026-05-21 10:00', 'PAYE'),
  ('TKT-2026-014',11, 2,  30.0, 'Espèces',  'Dorsaf Maatoug',    null,                         '2026-05-21 11:00', 'PAYE'),
  ('TKT-2026-015',12, 3,  75.0, 'CB',       'Adel Driss',        'adel.driss@gmail.com',       '2026-05-21 12:30', 'PAYE'),
  ('TKT-2026-016',13, 2,  70.0, 'Virement', 'Nadia Ben Youssef', 'nadia.by@outlook.com',       '2026-05-21 13:00', 'PAYE'),
  ('TKT-2026-017', 3, 2,  20.0, 'Espèces',  'Yosr Hamrouni',     null,                         '2026-05-21 14:00', 'ANNULE'),
  ('TKT-2026-018',14, 1,  18.0, 'CB',       'Chiheb Bougacha',   'chiheb.bougacha@gmail.com',  '2026-05-21 15:00', 'PAYE'),
  ('TKT-2026-019',15, 4, 200.0, 'CB',       'Syrine Mzabi',      'syrine.mzabi@gmail.com',     '2026-05-21 16:00', 'PAYE'),
  ('TKT-2026-020', 6, 1,  20.0, 'Espèces',  'Montassar Haj Ali', null,                         '2026-05-21 17:00', 'EN_ATTENTE')
ON CONFLICT (numero) DO NOTHING;
