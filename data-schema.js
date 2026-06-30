/**
 * ============================================================
 * AppSchema — Objet unique de définition des données
 *
 * Ce fichier fusionne l'ensemble des structures de données
 * du projet testRondes :
 *   1. Schéma des tables MySQL
 *   2. Variables globales du frontend
 *   3. Valeurs par défaut pour l'initialisation
 *   4. Relations entre les tables
 *   5. États et variables de session
 *   6. Requêtes SQL prêtes à l'emploi
 * ============================================================
 */

const AppSchema = (() => {
  "use strict";

  // ============================================================
  // 1. VALEURS PAR DÉFAUT (seed data)
  // ============================================================

  const DEFAULTS = Object.freeze({
    sections: [
      "Salle Des Machines",
      "Embouteillage",
      "Cave-Filtration-Siroperie",
      "Brassage",
      "Administration",
      "Bloc Social",
      "Traitement Eau Process",
      "Traitement Eau Usees",
      "Centre Logistique",
    ],

    familles: [
      "Eau",
      "Energie",
      "DDO",
      "Vapeur",
      "Pression",
      "Temperature",
      "Debit",
    ],

    groupe1: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],

    groupe2: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],

    type_ronde: [
      {
        id_ronde: 0,
        ronde: "Relevé journalier",
        delai: 1440,
        description_ronde:
          "relevé de tous les compteurs chaque matin aux alentours de 06:00",
      },
      {
        id_ronde: 1,
        ronde: "Relevé de quart",
        delai: 480,
        description_ronde:
          "relevé de tous les compteurs chaque quart de 8 heures",
      },
    ],

    operateurs: [
      {
        id_operateur: "966",
        nom_operateur: "NADJOMBE",
        prenom_operateur: "Gbati",
        fonction_operateur: "admin",
        nomuser_operateur: "gbati@nadjombe",
        motdepasse_operateur: "admin",
        role: "admin",
      },
      {
        id_operateur: "877",
        nom_operateur: "KPAKPA",
        prenom_operateur: "Tam",
        fonction_operateur: "operateur",
        nomuser_operateur: "tam@kpakpa",
        motdepasse_operateur: "123456",
        role: "operateur",
      },
      {
        id_operateur: "935",
        nom_operateur: "TSOGBE",
        prenom_operateur: "Alain",
        fonction_operateur: "operateur",
        nomuser_operateur: "alain@tsogbe",
        motdepasse_operateur: "123456",
        role: "operateur",
      },
    ],

    compteurs: [
      // --- EAU ---
      {
        id_compteur: "A-0000-0000-0000-0001",
        nom_compteur: "eau mitige laveuse",
        unite_compteur: "m3",
        debut_compteur: 7.0,
        range_compteur: 1000000.0,
        section: "Embouteillage",
        famille: "Eau",
        groupe1: "A",
        groupe2: "1",
        enservice_compteur: "2026-06-01 00:00:00",
        visible_compteur: true,
        actif_compteur: true,
        description_compteur: "compteur eau",
      },
      {
        id_compteur: "B-0000-0000-0000-0001",
        nom_compteur: "eau mitige laveuse",
        unite_compteur: "m3",
        debut_compteur: 7.0,
        range_compteur: 1000000.0,
        section: "Embouteillage",
        famille: "Eau",
        groupe1: "A",
        groupe2: "1",
        enservice_compteur: "",
        visible_compteur: true,
        actif_compteur: false,
        description_compteur: "compteur eau",
      },
      {
        id_compteur: "C-0000-0000-0000-0001",
        nom_compteur: "eau mitige laveuse",
        unite_compteur: "m3",
        debut_compteur: 7.0,
        range_compteur: 1000000.0,
        section: "Embouteillage",
        famille: "Eau",
        groupe1: "A",
        groupe2: "1",
        enservice_compteur: "",
        visible_compteur: true,
        actif_compteur: false,
        description_compteur: "compteur eau",
      },
      // --- ÉLECTRICITÉ ---
      {
        id_compteur: "A-0000-0000-0000-0010",
        nom_compteur: "electricite Axima",
        unite_compteur: "kwh",
        debut_compteur: 12.0,
        range_compteur: 1000000.0,
        section: "Salle Des Machines",
        famille: "Energie",
        groupe1: "A",
        groupe2: "1",
        enservice_compteur: "2026-06-20 00:00:00",
        visible_compteur: true,
        actif_compteur: true,
        description_compteur: "compteur d'électricité",
      },
      {
        id_compteur: "B-0000-0000-0000-0010",
        nom_compteur: "electricite Axima",
        unite_compteur: "kwh",
        debut_compteur: 12.0,
        range_compteur: 1000000.0,
        section: "Salle Des Machines",
        famille: "Energie",
        groupe1: "A",
        groupe2: "1",
        enservice_compteur: "",
        visible_compteur: true,
        actif_compteur: false,
        description_compteur: "compteur d'électricité",
      },
      {
        id_compteur: "C-0000-0000-0000-0010",
        nom_compteur: "electricite Axima",
        unite_compteur: "kwh",
        debut_compteur: 12.0,
        range_compteur: 1000000.0,
        section: "Salle Des Machines",
        famille: "Energie",
        groupe1: "A",
        groupe2: "1",
        enservice_compteur: "",
        visible_compteur: true,
        actif_compteur: false,
        description_compteur: "compteur d'électricité",
      },
      // --- TEMPÉRATURE ---
      {
        id_compteur: "A-0000-0000-0000-0011",
        nom_compteur: "temperature glycole",
        unite_compteur: "°C",
        debut_compteur: -4.0,
        range_compteur: 1000000.0,
        section: "Salle Des Machines",
        famille: "Temperature",
        groupe1: "F",
        groupe2: "1",
        enservice_compteur: "2026-06-19 00:00:00",
        visible_compteur: true,
        actif_compteur: true,
        description_compteur: "Thermometre ligne glycole",
      },
      {
        id_compteur: "B-0000-0000-0000-0011",
        nom_compteur: "temperature glycole",
        unite_compteur: "°C",
        debut_compteur: -4.0,
        range_compteur: 1000000.0,
        section: "Salle Des Machines",
        famille: "Temperature",
        groupe1: "F",
        groupe2: "1",
        enservice_compteur: "",
        visible_compteur: true,
        actif_compteur: false,
        description_compteur: "Thermometre ligne glycole",
      },
      {
        id_compteur: "C-0000-0000-0000-0011",
        nom_compteur: "temperature glycole",
        unite_compteur: "°C",
        debut_compteur: -4.0,
        range_compteur: 1000000.0,
        section: "Salle Des Machines",
        famille: "Temperature",
        groupe1: "F",
        groupe2: "1",
        enservice_compteur: "",
        visible_compteur: true,
        actif_compteur: false,
        description_compteur: "Thermometre ligne glycole",
      },
    ],
  });

  // ============================================================
  // 2. SCHÉMA DES TABLES MySQL
  // ============================================================

  const TABLE_SCHEMA = Object.freeze({
    sections: {
      comment: "Sections / zones de l'usine",
      fields: {
        id: {
          type: "INT",
          extra: "AUTO_INCREMENT PRIMARY KEY",
          phpType: "int",
        },
        nom: {
          type: "VARCHAR(100)",
          extra: "NOT NULL UNIQUE",
          phpType: "string",
        },
      },
      insertSql: "INSERT IGNORE INTO sections (nom) VALUES (:nom)",
      selectAll: "SELECT id, nom FROM sections ORDER BY nom",
    },

    familles: {
      comment: "Familles de compteurs (types de mesures)",
      fields: {
        id: {
          type: "INT",
          extra: "AUTO_INCREMENT PRIMARY KEY",
          phpType: "int",
        },
        nom: {
          type: "VARCHAR(50)",
          extra: "NOT NULL UNIQUE",
          phpType: "string",
        },
      },
      insertSql: "INSERT IGNORE INTO familles (nom) VALUES (:nom)",
      selectAll: "SELECT id, nom FROM familles ORDER BY nom",
    },

    type_ronde: {
      comment: "Types de rondes",
      fields: {
        id: {
          type: "INT",
          extra: "AUTO_INCREMENT PRIMARY KEY",
          phpType: "int",
        },
        ronde: { type: "VARCHAR(100)", extra: "NOT NULL", phpType: "string" },
        delai_minutes: { type: "INT", extra: "NOT NULL", phpType: "int" },
        description_ronde: { type: "TEXT", extra: "", phpType: "string" },
      },
      insertSql:
        "INSERT IGNORE INTO type_ronde (id, ronde, delai_minutes, description_ronde) VALUES (:id_ronde, :ronde, :delai, :description_ronde)",
      selectAll:
        "SELECT id as id_ronde, ronde, delai_minutes as delai, description_ronde FROM type_ronde ORDER BY id",
    },

    operateurs: {
      comment: "Opérateurs / utilisateurs",
      fields: {
        id_operateur: {
          type: "VARCHAR(20)",
          extra: "PRIMARY KEY",
          phpType: "string",
        },
        nom_operateur: {
          type: "VARCHAR(100)",
          extra: "NOT NULL",
          phpType: "string",
        },
        prenom_operateur: {
          type: "VARCHAR(100)",
          extra: "NOT NULL",
          phpType: "string",
        },
        fonction_operateur: {
          type: "VARCHAR(100)",
          extra: "",
          phpType: "string",
        },
        nomuser_operateur: {
          type: "VARCHAR(50)",
          extra: "NOT NULL UNIQUE",
          phpType: "string",
        },
        motdepasse_operateur: {
          type: "VARCHAR(255)",
          extra: "NOT NULL",
          phpType: "string",
        },
        role: {
          type: "ENUM('admin','operateur','superviseur')",
          extra: "DEFAULT 'operateur'",
          phpType: "string",
        },
      },
      insertSql:
        "INSERT IGNORE INTO operateurs (id_operateur, nom_operateur, prenom_operateur, fonction_operateur, nomuser_operateur, motdepasse_operateur, role) VALUES (:id_operateur, :nom_operateur, :prenom_operateur, :fonction_operateur, :nomuser_operateur, :motdepasse_operateur, :role)",
      selectAll:
        "SELECT id_operateur, nom_operateur, prenom_operateur, fonction_operateur, nomuser_operateur, role FROM operateurs ORDER BY nom_operateur",
    },

    compteurs: {
      comment: "Compteurs de mesure",
      fields: {
        id_compteur: {
          type: "VARCHAR(50)",
          extra: "PRIMARY KEY",
          phpType: "string",
        },
        nom_compteur: {
          type: "VARCHAR(255)",
          extra: "NOT NULL",
          phpType: "string",
        },
        unite_compteur: { type: "VARCHAR(20)", extra: "", phpType: "string" },
        debut_compteur: {
          type: "DECIMAL(15,3)",
          extra: "DEFAULT 0",
          phpType: "float",
        },
        range_compteur: {
          type: "DECIMAL(15,3)",
          extra: "DEFAULT 0",
          phpType: "float",
        },
        section_id: {
          type: "INT",
          extra: "",
          phpType: "int",
          fk: { table: "sections", field: "id" },
        },
        famille_id: {
          type: "INT",
          extra: "",
          phpType: "int",
          fk: { table: "familles", field: "id" },
        },
        enservice_compteur: { type: "DATETIME", extra: "", phpType: "string" },
        visible_compteur: {
          type: "TINYINT(1)",
          extra: "DEFAULT 1",
          phpType: "bool",
        },
        actif_compteur: {
          type: "TINYINT(1)",
          extra: "DEFAULT 1",
          phpType: "bool",
        },
        description_compteur: { type: "TEXT", extra: "", phpType: "string" },
      },
      fk: [
        "FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL",
        "FOREIGN KEY (famille_id) REFERENCES familles(id) ON DELETE SET NULL",
      ],
      insertSql:
        "INSERT IGNORE INTO compteurs (id_compteur, nom_compteur, unite_compteur, debut_compteur, range_compteur, section_id, famille_id, enservice_compteur, visible_compteur, actif_compteur, description_compteur) VALUES (:id_compteur, :nom_compteur, :unite_compteur, :debut_compteur, :range_compteur, :section_id, :famille_id, :enservice_compteur, :visible_compteur, :actif_compteur, :description_compteur)",
      selectAll: `
        SELECT c.id_compteur, c.nom_compteur, c.unite_compteur, c.debut_compteur, c.range_compteur,
               s.nom AS section_compteur, f.nom AS famille_compteur,
               c.enservice_compteur, c.visible_compteur, c.actif_compteur, c.description_compteur
        FROM compteurs c
        LEFT JOIN sections s ON c.section_id = s.id
        LEFT JOIN familles f ON c.famille_id = f.id
        ORDER BY c.id_compteur
      `,
    },

    releves: {
      comment: "Relevés de mesures (historique)",
      fields: {
        id: {
          type: "INT",
          extra: "AUTO_INCREMENT PRIMARY KEY",
          phpType: "int",
        },
        id_ronde: {
          type: "INT",
          extra: "",
          phpType: "int",
          fk: { table: "type_ronde", field: "id" },
        },
        id_operateur: {
          type: "VARCHAR(20)",
          extra: "",
          phpType: "string",
          fk: { table: "operateurs", field: "id_operateur" },
        },
        id_compteur: {
          type: "VARCHAR(50)",
          extra: "",
          phpType: "string",
          fk: { table: "compteurs", field: "id_compteur" },
        },
        valeur: { type: "DECIMAL(15,3)", extra: "NOT NULL", phpType: "float" },
        date_releve: { type: "DATE", extra: "NOT NULL", phpType: "string" },
        heure_releve: { type: "TIME", extra: "NOT NULL", phpType: "string" },
        commentaire: { type: "TEXT", extra: "", phpType: "string" },
        date_saisie: {
          type: "TIMESTAMP",
          extra: "DEFAULT CURRENT_TIMESTAMP",
          phpType: "string",
        },
      },
      fk: [
        "FOREIGN KEY (id_ronde) REFERENCES type_ronde(id) ON DELETE CASCADE",
        "FOREIGN KEY (id_operateur) REFERENCES operateurs(id_operateur) ON DELETE CASCADE",
        "FOREIGN KEY (id_compteur) REFERENCES compteurs(id_compteur) ON DELETE CASCADE",
      ],
      insertSql:
        "INSERT INTO releves (id_ronde, id_operateur, id_compteur, valeur, date_releve, heure_releve, commentaire) VALUES (:id_ronde, :id_operateur, :id_compteur, :valeur, :date_releve, :heure_releve, :commentaire)",
      selectAll:
        "SELECT * FROM releves ORDER BY date_releve DESC, heure_releve DESC LIMIT 200",
    },
  });

  // ============================================================
  // 3. RELATIONS ENTRE LES TABLES
  // ============================================================

  const RELATIONS = Object.freeze({
    compteurs: {
      section_id: { table: "sections", field: "id", onDelete: "SET NULL" },
      famille_id: { table: "familles", field: "id", onDelete: "SET NULL" },
    },
    releves: {
      id_ronde: { table: "type_ronde", field: "id", onDelete: "CASCADE" },
      id_operateur: {
        table: "operateurs",
        field: "id_operateur",
        onDelete: "CASCADE",
      },
      id_compteur: {
        table: "compteurs",
        field: "id_compteur",
        onDelete: "CASCADE",
      },
    },
  });

  // ============================================================
  // 4. VARIABLES GLOBALES DE SESSION (frontend)
  // ============================================================

  const SESSION_VARS = Object.freeze({
    varSession: {
      session: null, // "ronde" ou "revue"
      "id-operateur": null,
      "id-type-ronde": null,
      "id-compteur": null,
      "date-releve": null,
      "heure-releve": null,
    },
    relevSession: [],
    recapData: null,
  });

  // ============================================================
  // 5. VARIABLES D'ÉTAT (scanner, etc.)
  // ============================================================

  const STATE_VARS = Object.freeze({
    qrScanner: null,
    currentScanResult: null,
    detectedId: null,
  });

  // ============================================================
  // 6. REQUÊTES SQL PRÉPARÉES (pour le backend)
  // ============================================================

  const SQL_QUERIES = Object.freeze({
    // Création de la base
    CREATE_DATABASE:
      "CREATE DATABASE IF NOT EXISTS gestion_rondes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci",
    USE_DATABASE: "USE gestion_rondes",

    // Création des tables (ordre respectant les dépendances FK)
    CREATE_TABLES: [
      "CREATE TABLE IF NOT EXISTS sections ( id INT AUTO_INCREMENT PRIMARY KEY, nom VARCHAR(100) NOT NULL UNIQUE ) ENGINE=InnoDB",
      "CREATE TABLE IF NOT EXISTS familles ( id INT AUTO_INCREMENT PRIMARY KEY, nom VARCHAR(50) NOT NULL UNIQUE ) ENGINE=InnoDB",
      "CREATE TABLE IF NOT EXISTS type_ronde ( id INT AUTO_INCREMENT PRIMARY KEY, ronde VARCHAR(100) NOT NULL, delai_minutes INT NOT NULL, description_ronde TEXT ) ENGINE=InnoDB",
      `CREATE TABLE IF NOT EXISTS operateurs (
        id_operateur VARCHAR(20) PRIMARY KEY,
        nom_operateur VARCHAR(100) NOT NULL,
        prenom_operateur VARCHAR(100) NOT NULL,
        fonction_operateur VARCHAR(100),
        nomuser_operateur VARCHAR(50) NOT NULL UNIQUE,
        motdepasse_operateur VARCHAR(255) NOT NULL,
        role ENUM('admin','operateur','superviseur') DEFAULT 'operateur'
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS compteurs (
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
      ) ENGINE=InnoDB`,
      `CREATE TABLE IF NOT EXISTS releves (
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
      ) ENGINE=InnoDB`,
    ],

    // Suppression des tables (ordre inverse des dépendances)
    DROP_TABLES: [
      "DROP TABLE IF EXISTS releves",
      "DROP TABLE IF EXISTS compteurs",
      "DROP TABLE IF EXISTS operateurs",
      "DROP TABLE IF EXISTS type_ronde",
      "DROP TABLE IF EXISTS familles",
      "DROP TABLE IF EXISTS sections",
    ],
  });

  // ============================================================
  // 7. CONFIGURATION BDD (backend)
  // ============================================================

  const DB_CONFIG = Object.freeze({
    host: "localhost",
    name: "gestion_rondes",
    user: "root",
    pass: "",
    charset: "utf8mb4",
  });

  // ============================================================
  // API PUBLIQUE DE L'OBJET
  // ============================================================

  return {
    // Constantes / valeurs par défaut
    DEFAULTS,

    // Schéma des tables
    TABLE_SCHEMA,

    // Relations
    RELATIONS,

    // Variables de session
    SESSION_VARS,

    // Variables d'état
    STATE_VARS,

    // Requêtes SQL
    SQL_QUERIES,

    // Config BDD
    DB_CONFIG,

    // ============================================================
    // MÉTHODES UTILITAIRES
    // ============================================================

    /**
     * Génère le script SQL complet (CREATE DATABASE + CREATE TABLES + INSERT)
     * @returns {string} Script SQL
     */
    generateFullSqlScript() {
      const lines = [
        "-- ============================================================",
        "-- Script généré par AppSchema",
        "-- ============================================================",
        "",
        this.SQL_QUERIES.CREATE_DATABASE + ";",
        this.SQL_QUERIES.USE_DATABASE + ";",
        "",
        ...this.SQL_QUERIES.CREATE_TABLES.map((q) => q + ";"),
        "",
        "-- Insertion des données par défaut",
        "",
      ];

      // Sections
      this.DEFAULTS.sections.forEach((s) => {
        lines.push(`INSERT IGNORE INTO sections (nom) VALUES ('${s}');`);
      });

      // Familles
      this.DEFAULTS.familles.forEach((f) => {
        lines.push(`INSERT IGNORE INTO familles (nom) VALUES ('${f}');`);
      });

      // Types de ronde
      this.DEFAULTS.type_ronde.forEach((r) => {
        lines.push(
          `INSERT IGNORE INTO type_ronde (id, ronde, delai_minutes, description_ronde) VALUES (${r.id_ronde}, '${r.ronde}', ${r.delai}, '${r.description_ronde}');`,
        );
      });

      // Opérateurs
      this.DEFAULTS.operateurs.forEach((o) => {
        lines.push(
          `INSERT IGNORE INTO operateurs (id_operateur, nom_operateur, prenom_operateur, fonction_operateur, nomuser_operateur, motdepasse_operateur, role) VALUES ('${o.id_operateur}', '${o.nom_operateur}', '${o.prenom_operateur}', '${o.fonction_operateur}', '${o.nomuser_operateur}', '${o.motdepasse_operateur}', '${o.role}');`,
        );
      });

      // Compteurs - résolution section_id et famille_id
      const sectionsMap = {};
      this.DEFAULTS.sections.forEach((s, i) => (sectionsMap[s] = i + 1));
      const famillesMap = {};
      this.DEFAULTS.familles.forEach((f, i) => (famillesMap[f] = i + 1));

      this.DEFAULTS.compteurs.forEach((c) => {
        lines.push(
          `INSERT IGNORE INTO compteurs (id_compteur, nom_compteur, unite_compteur, debut_compteur, range_compteur, section_id, famille_id, enservice_compteur, visible_compteur, actif_compteur, description_compteur) VALUES ('${c.id_compteur}', '${c.nom_compteur}', '${c.unite_compteur}', ${c.debut_compteur}, ${c.range_compteur}, ${sectionsMap[c.section] || 1}, ${famillesMap[c.famille] || 1}, ${c.enservice_compteur ? `'${c.enservice_compteur}'` : "NULL"}, ${c.visible_compteur ? 1 : 0}, ${c.actif_compteur ? 1 : 0}, '${c.description_compteur}');`,
        );
      });

      return lines.join("\n");
    },

    /**
     * Initialise les variables globales du frontend avec les valeurs par défaut
     */
    getDefaultState() {
      return {
        sections: [...this.DEFAULTS.sections],
        famille_list: [...this.DEFAULTS.familles],
        groupe1_list: [...this.DEFAULTS.groupe1],
        groupe2_list: [...this.DEFAULTS.groupe2],
        type_ronde: [...this.DEFAULTS.type_ronde],
        tabOperateurs: [...this.DEFAULTS.operateurs],
        tabCompteurs: [...this.DEFAULTS.compteurs],
        rondeDB: {},
        ...this.SESSION_VARS,
      };
    },

    /**
     * Retourne la liste des tables dans l'ordre de création
     * @returns {string[]}
     */
    getTableList() {
      return [
        "sections",
        "familles",
        "type_ronde",
        "operateurs",
        "compteurs",
        "releves",
      ];
    },

    /**
     * Vérifie si un champ est une clé étrangère
     * @param {string} table
     * @param {string} field
     * @returns {object|null}
     */
    getForeignKey(table, field) {
      const t = this.TABLE_SCHEMA[table];
      if (!t || !t.fields[field]) return null;
      return t.fields[field].fk || null;
    },

    /**
     * Retourne la configuration PDO pour le backend PHP
     * @returns {string}
     */
    getPdoDsn() {
      return `mysql:host=${this.DB_CONFIG.host};dbname=${this.DB_CONFIG.name};charset=${this.DB_CONFIG.charset}`;
    },

    /**
     * Structure typeScript pour documentation
     * @returns {string}
     */
    getTypesAsString() {
      return `
// Interfaces TypeScript générées depuis AppSchema

interface TypeRonde {
  id_ronde: number;
  ronde: string;
  delai: number; // en minutes
  description_ronde: string;
}

interface Operateur {
  id_operateur: string;
  nom_operateur: string;
  prenom_operateur: string;
  fonction_operateur: string;
  nomuser_operateur: string;
  motdepasse_operateur: string;
  role: "admin" | "operateur" | "superviseur";
}

interface Compteur {
  id_compteur: string;
  nom_compteur: string;
  unite_compteur: string;
  debut_compteur: number;
  range_compteur: number;
  section: string;
  famille: string;
  groupe1: string;
  groupe2: string;
  enservice_compteur: string;
  visible_compteur: boolean;
  actif_compteur: boolean;
  description_compteur: string;
}

interface Releve {
  id_ronde: number;
  id_operateur: string;
  id_compteur: string;
  valeur: number;
  date: string;
  heure: string;
  commentaire: string;
}

interface VarSession {
  session: "ronde" | "revue" | null;
  "id-operateur": string | null;
  "id-type-ronde": number | null;
  "id-compteur": string | null;
  "date-releve": string | null;
  "heure-releve": string | null;
}
`;
    },
  };
})();

// ============================================================
// EXPORT (fonctionne dans Node.js et navigateur)
// ============================================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = AppSchema;
} else if (typeof window !== "undefined") {
  window.AppSchema = AppSchema;
}
