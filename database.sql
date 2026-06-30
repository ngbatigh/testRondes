-- ============================================================
-- BASE DE DONNÉES : gestion_rondes
-- STRUCTURE POUR BACKEND PHP/MYSQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS gestion_rondes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_rondes;

-- 1. Table des sections
CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. Table des familles de compteurs
CREATE TABLE IF NOT EXISTS familles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 3. Table des types de rondes
CREATE TABLE IF NOT EXISTS type_ronde (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ronde VARCHAR(100) NOT NULL,
    delai_minutes INT NOT NULL,
    description_ronde TEXT
) ENGINE=InnoDB;

-- 4. Table des opérateurs
CREATE TABLE IF NOT EXISTS operateurs (
    id_operateur VARCHAR(20) PRIMARY KEY,
    nom_operateur VARCHAR(100) NOT NULL,
    prenom_operateur VARCHAR(100) NOT NULL,
    fonction_operateur VARCHAR(100),
    nomuser_operateur VARCHAR(50) NOT NULL UNIQUE,
    motdepasse_operateur VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operateur', 'superviseur') DEFAULT 'operateur'
) ENGINE=InnoDB;

-- 5. Table des compteurs
CREATE TABLE IF NOT EXISTS compteurs (
    id_compteur VARCHAR(50) PRIMARY KEY,
    nom_compteur VARCHAR(255) NOT NULL,
    unite_compteur VARCHAR(20),
    debut_compteur DECIMAL(15,3) DEFAULT 0,
    range_compteur DECIMAL(15,3) DEFAULT 0,
    section_id INT,
    famille_id INT,
    enservice_compteur DATETIME,
    visible_compteur TINYINT(1) DEFAULT 1,
    actif_compteur TINYINT(1) DEFAULT 1,
    description_compteur TEXT,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
    FOREIGN KEY (famille_id) REFERENCES familles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. Table des relevés
CREATE TABLE IF NOT EXISTS releves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ronde INT,
    id_operateur VARCHAR(20),
    id_compteur VARCHAR(50),
    valeur DECIMAL(15,3) NOT NULL,
    date_releve DATE NOT NULL,
    heure_releve TIME NOT NULL,
    commentaire TEXT,
    date_saisie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_ronde) REFERENCES type_ronde(id) ON DELETE CASCADE,
    FOREIGN KEY (id_operateur) REFERENCES operateurs(id_operateur) ON DELETE CASCADE,
    FOREIGN KEY (id_compteur) REFERENCES compteurs(id_compteur) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- INSERTION DES DONNÉES PAR DÉFAUT
-- ============================================================

-- Sections
INSERT IGNORE INTO sections (nom) VALUES 
('Salle Des Machines'), ('Embouteillage'), ('Cave-Filtration-Siroperie'), 
('Brassage'), ('Administration'), ('Bloc Social'), 
('Traitement Eau Process'), ('Traitement Eau Usees'), ('Centre Logistique');

-- Familles
INSERT IGNORE INTO familles (nom) VALUES 
('Eau'), ('Energie'), ('DDO'), ('Vapeur'), ('Pression'), ('Temperature'), ('Debit');

-- Types de rondes
INSERT IGNORE INTO type_ronde (id, ronde, delai_minutes, description_ronde) VALUES 
(0, 'Relevé journalier', 1440, 'relevé de tous les compteurs chaque matin aux alentours de 06:00'),
(1, 'Relevé de quart', 480, 'relevé de tous les compteurs chaque quart de 8 heures');

-- Opérateurs (mots de passe en clair pour l'instant, à hacher en PHP)
INSERT IGNORE INTO operateurs (id_operateur, nom_operateur, prenom_operateur, fonction_operateur, nomuser_operateur, motdepasse_operateur, role) VALUES 
('966', 'NADJOMBE', 'Gbati', 'admin', 'gbati@nadjombe', 'admin', 'admin'),
('877', 'KPAKPA', 'Tam', 'operateur', 'tam@kpakpa', '123456', 'operateur'),
('935', 'TSOGBE', 'Alain', 'operateur', 'alain@tsogbe', '123456', 'operateur');

-- Compteurs (Exemple initial)
INSERT IGNORE INTO compteurs (id_compteur, nom_compteur, unite_compteur, debut_compteur, range_compteur, section_id, famille_id, enservice_compteur, visible_compteur, actif_compteur, description_compteur) VALUES 
('A-0000-0000-0000-0001', 'eau mitige laveuse', 'm3', 7.0, 1000000.0, 2, 1, '2026-06-01 00:00:00', 1, 1, 'compteur eau');
