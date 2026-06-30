# Plan de Migration vers une Architecture Client-Serveur

**Projet** : testRondes - Gestion des relevés de compteurs  
**Date** : 2026-06-29  
**Version** : 1.0

---

## Table des matières

1. [Contexte](#1-contexte)
2. [Architecture Cible](#2-architecture-cible)
3. [Structure du Projet](#3-structure-du-projet)
4. [Phases de Migration](#4-phases-de-migration)
5. [Points d'attention](#5-points-dattention)
6. [Planning Estimé](#6-planning-estimé)

---

## 1. Contexte

L'application actuelle stocke toutes ses données dans le `localStorage` du navigateur. Cette approche présente plusieurs limitations :

- Pas de partage des données entre utilisateurs
- Risque de perte de données (clear, changement de navigateur)
- Pas d'historique centralisé
- Pas de sauvegarde automatique

La migration vers une architecture client-serveur résout ces problèmes en centralisant les données dans une base MySQL et en exposant une API REST pour le frontend.

---

## 2. Architecture Cible

### 2.1 Schéma d'architecture

```
┌─────────────┐         HTTPS          ┌─────────────┐
│             │    ───────────────►     │             │
│   Frontend  │                         │  Backend    │
│  (HTML/JS)  │    ◄───────────────     │  (PHP API)  │
│             │         JSON            │             │
└─────────────┘                         └──────┬──────┘
                                               │
                                               │ PDO
                                               ▼
                                        ┌─────────────┐
                                        │   MySQL DB   │
                                        │              │
                                        └─────────────┘
```

### 2.2 Technologies

| Composant       | Technologie                         | Rôle                       |
| --------------- | ----------------------------------- | -------------------------- |
| Frontend        | JavaScript ES6+ (Vanilla modulaire) | Interface utilisateur SPAs |
| Backend         | PHP 8+, PDO                         | API REST                   |
| Base de données | MySQL 5.7+ / MariaDB 10.3+          | Stockage persistant        |
| Serveur web     | Apache / Nginx                      | Hébergement                |

### 2.3 Avantages

- **Partage** : Plusieurs opérateurs peuvent saisir des relevés simultanément
- **Centralisation** : Toutes les données au même endroit
- **Fiabilité** : Sauvegarde automatique, pas de perte de données
- **Évolutivité** : Possibilité d'ajouter des fonctionnalités (statistiques, export, etc.)
- **Sécurité** : Authentification sécurisée, droits d'accès par rôle

---

## 3. Structure du Projet

### 3.1 Organisation des dossiers

```
testRondes/
├── frontend/                          # Site statique (à héberger)
│   ├── index.html
│   ├── scripts.js                    # Version modifiée pour API
│   ├── styles.css
│   ├── qr-scanner.html
│   ├── lib/                          # Librairies JS
│   │   ├── qr-scanner.min.js
│   │   ├── qr-scanner-worker.min.js
│   │   └── qrcode-generator/
│   └── assets/                       # Images, icônes (optionnel)
│
├── backend/                           # API PHP (à héberger)
│   ├── config/
│   │   ├── db.php                    # Connexion BDD
│   │   └── .htaccess                 # Sécurité (bloquer l'accès direct)
│   │
│   ├── endpoints/
│   │   ├── get_data.php              # Récupération configurations
│   │   ├── save_releve.php           # Enregistrement relevés
│   │   ├── login.php                 # Authentification
│   │   ├── compteurs.php             # CRUD compteurs
│   │   ├── operateurs.php            # CRUD opérateurs
│   │   ├── rondes.php                # CRUD types de ronde
│   │   ├── history.php               # Historique des relevés
│   │   └── export.php                # Export CSV/Excel
│   │
│   ├── middleware/
│   │   ├── auth.php                  # Vérification token/session
│   │   └── cors.php                  # Gestion CORS
│   │
│   ├── tools/
│   │   ├── access.php                # Interface web admin BDD
│   │   └── connexion-odbc.reg        # Fichier de configuration ODBC pour Access
│   │
│   └── database.sql                  # Script de création BDD
│
├── data/
│   └── gestion-rondes.accdb          # Fichier Access lié à MySQL (maintenance graphique)
│
├── data-schema.js                    # Objet unique fusionnant schéma, données et initialisations
│
├── docs/
│   ├── plan-de-migration.md          # Ce document
│   ├── data-structure.md             # Documentation des données
│   └── api-documentation.md          # Documentation technique API
│
└── deployment/
    ├── deploy-frontend.sh            # Script de déploiement frontend
    ├── deploy-backend.sh             # Script de déploiement backend
    └── backup.sh                     # Script de sauvegarde BDD
```

### 3.2 Configuration requise

**Backend** :

- PHP 8.0+ (avec extensions : pdo_mysql, mbstring, json)
- MySQL 5.7+ / MariaDB 10.3+
- Apache avec mod_rewrite activé (ou Nginx)

**Frontend** :

- JavaScript ES6+ (avec modules)
- Processeur de tâches léger (optionnel : esbuild/rollup pour le bundling)
- Navigateur moderne (Chrome, Firefox, Edge, Safari)
- Connexion internet pour accéder aux API

---

## 4. Phases de Migration

### Phase 1 — Analyse et Documentation _(Terminée)_

**Objectif** : Comprendre l'existant et préparer la migration.

- [x] Analyser la structure des données localStorage
- [x] Documenter les variables globales et leurs relations
- [x] Concevoir le schéma MySQL normalisé
- [x] Créer `database.sql` avec les tables et données par défaut
- [x] Mettre en place l'environnement de développement backend
- [x] Rédiger la documentation technique
- [x] Créer `data-schema.js` — Objet unique fusionnant schéma, données initiales et configurations

**Livrables** :

- `data-structure.md` : Documentation des données
- `database.sql` : Script de création de la base
- `data-schema.js` : Objet unique avec schéma, valeurs par défaut, relations, méthodes utilitaires
- `api/config/db.php` : Configuration PDO
- `api/get_data.php` : Endpoint de récupération des configurations
- `api/save_releve.php` : Endpoint d'enregistrement des relevés
- `scripts.js` : Adaptation frontend avec API et mode dégradé
- `api/login.php` : Authentification
- `api/compteurs.php` : CRUD compteurs
- `api/operateurs.php` : CRUD opérateurs
- `api/rondes.php` : CRUD types de ronde
- `api/history.php` : Historique des relevés

---

### Phase 2 — Adaptation du Frontend _(À faire)_

**Objectif** : Remplacer les appels à `localStorage` par des appels à l'API.

**Tâches** :

1. **Modifier le chargement initial**
   - Remplacer `loadSavedData()` par un appel à `fetch('backend/endpoints/get_data.php')`
   - Charger les configurations uniquement depuis l'API
   - Supprimer la logique de vérification `localStorage`

2. **Modifier l'enregistrement des relevés**
   - Remplacer `saveReleve()` par un appel POST à `fetch('backend/endpoints/save_releve.php')`
   - Envoyer le tableau `relevSession` complet
   - Gérer la réponse et afficher un message de succès/erreur

3. **Ajouter la gestion du mode dégradé**
   - Détecter si l'API est accessible (timeout 3s)
   - Si indisponible, basculer automatiquement en mode localStorage
   - Afficher un indicateur "Mode hors-ligne" à l'utilisateur
   - Synchroniser les données lorsque la connexion est rétablie

4. **Améliorer l'expérience utilisateur**
   - Ajouter un loader pendant les appels API
   - Gérer les erreurs avec des messages clairs (Toast/Alert)
   - Ajouter un bouton "Synchroniser" pour forcer l'envoi

**Exemple de code pour `loadSavedData()` modifié** :

```javascript
async function loadSavedData() {
  try {
    const response = await fetch("backend/endpoints/get_data.php", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("API indisponible");

    const data = await response.json();

    // Mettre à jour les variables globales
    sections = data.sections;
    famille_list = data.familles;
    type_ronde = data.type_ronde;
    tabOperateurs = data.operateurs;
    tabCompteurs = data.compteurs;

    // Initialiser rondeDB vide
    rondeDB = {};
  } catch (error) {
    console.warn("Mode hors-ligne activé :", error.message);
    // Fallback vers localStorage
    loadLocalData();
    showMessage("⚠️ Mode hors-ligne - données non synchronisées", "warning");
  }

  fillRondeSelect();
  fillCompteurSelect();
  remplirOperateursSelect();
}
```

**Livrables** :

- `frontend/scripts.js` modifié
- Système de fallback localStorage ↔ API

---

### Phase 3 — Finalisation du Backend _(À faire)_

**Objectif** : Compléter les endpoints API nécessaires au fonctionnement complet.

**Tâches** :

1. **Authentification sécurisée**
   - Créer `backend/endpoints/login.php`
   - Implémenter le hachage des mots de passe avec `password_hash()`
   - Générer un token JWT ou utiliser des sessions PHP sécurisées
   - Retourner les informations de l'opérateur (sans le mot de passe)

2. **CRUD Compteurs**
   - `POST backend/endpoints/compteurs.php` — Créer un compteur
   - `PUT backend/endpoints/compteurs.php` — Modifier un compteur
   - `DELETE backend/endpoints/compteurs.php` — Supprimer un compteur
   - `GET backend/endpoints/compteurs.php` — Liste des compteurs

3. **CRUD Opérateurs**
   - Mêmes opérations (CRUD) pour les opérateurs
   - Attention : ne jamais renvoyer les mots de passe

4. **CRUD Types de Ronde**
   - Mêmes opérations pour les types de rondes

5. **Consultation de l'historique**
   - `GET backend/endpoints/history.php?compteur=XXX&date_debut=...`
   - Retourner les relevés avec pagination
   - Formater les dates en français

6. **Améliorations transverses**
   - Ajouter des logs dans un fichier `backend/logs/`
   - Implémenter une validation stricte des entrées
   - Ajouter des tests unitaires avec PHPUnit

**Livrables** :

- Tous les endpoints PHP fonctionnels
- Script de migration des anciennes données localStorage → MySQL
- Documentation API (Postman/OpenAPI)

---

### Phase 4 — Tests et Validation _(1 jour)_

**Objectif** : Garantir le bon fonctionnement avant déploiement.

**Tâches** :

1. **Tests Backend**
   - [ ] Tests unitaires de chaque endpoint
   - [ ] Tests d'injection SQL (vérifier que les requêtes préparées fonctionnent)
   - [ ] Tests XSS (vérifier l'échappement des sorties)
   - [ ] Tests de charge (100 relevés simultanés)

2. **Tests Frontend**
   - [ ] Test de connexion / authentification
   - [ ] Test de saisie d'un relevé complet
   - [ ] Test de modification d'un compteur
   - [ ] Test du mode dégradé (couper l'API, vérifier le fallback)

3. **Tests d'intégration**
   - [ ] Scénario complet : login → choix ronde → scan QR → saisie → confirmation → fin de ronde
   - [ ] Vérification de la cohérence des données entre frontend et BDD
   - [ ] Test multilingue (français uniquement, mais vérifier les accents)

4. **Tests de sécurité**
   - [ ] Vérifier que les mots de passe sont hachés en BDD
   - [ ] Tester les accès non autorisés (appeler un endpoint sans être connecté)
   - [ ] Vérifier CORS (seul le domaine autorisé peut appeler l'API)

**Livrables** :

- Rapport de tests
- Correctifs appliqués
- Validation par l'utilisateur

---

### Phase 5 — Déploiement en Production

**Objectif** : Mettre en ligne l'application sur un hébergement.

**Tâches** :

1. **Choix de l'hébergeur**
   - Option mutualisée : o2switch, OVH, PlanetHoster (~ 5€/mois)
   - Option VPS : OVH, DigitalOcean, Linode (~ 5€/mois)
   - Critères : PHP 8+, MySQL, accès SFTP/SSH, support HTTPS

2. **Configuration du serveur**
   - [ ] Installer PHP 8+ avec extensions PDO MySQL
   - [ ] Installer et configurer MySQL
   - [ ] Configurer Apache/Nginx (virtual host, rewrite rules)
   - [ ] Activer HTTPS avec Let's Encrypt (certificat gratuit)

3. **Déploiement du code**
   - [ ] Transférer le dossier `frontend/` dans `public_html/` ou `www/`
   - [ ] Transférer le dossier `backend/` dans un répertoire protégé (ex: `api/`)
   - [ ] Importer `database.sql` dans MySQL
   - [ ] Mettre à jour `api/config/db.php` avec les identifiants de production
   - [ ] Configurer les permissions des dossiers (logs, uploads)

4. **Sécurisation**
   - [ ] Désactiver l'affichage des erreurs PHP (`display_off`)
   - [ ] Protéger le dossier `backend/config/` avec `.htaccess`
   - [ ] Mettre en place des sauvegardes automatiques (cron MySQL dump)
   - [ ] Configurer un firewall (ex: Fail2Ban)

5. **Mise en service**
   - [ ] Tester tous les endpoints en production
   - [ ] Former les utilisateurs finaux
   - [ ] Mettre en place un support (email/téléphone)
   - [ ] Prévoir un rollback en cas de problème

**Livrables** :

- Application en ligne
- Documentation d'exploitation
- Procédure de sauvegarde/restauration

---

### 5.6 Fichier `access.php` — Interface web d'administration de la base

**Emplacement** : `backend/tools/access.php`  
**Accès** : `https://mondomaine.com/backend/tools/access.php`

Fonctionnalités :

- Consultation de toutes les tables (sections, familles, opérateurs, compteurs, relevés)
- Saisie et modification directe des données
- Exécution de requêtes SQL personnalisées
- Affichage du nombre d'enregistrements par table
- Réinitialisation de la base via `database.sql`

Sécurisation :

- Authentification par mot de passe administrateur
- Mode lecture seule par défaut
- Ne pas déployer en production sans protection (mot de passe fort + IP restreinte)

### 5.7 Fichier `.accdb` — Interface graphique Microsoft Access

**Emplacement** : `data/gestion-rondes.accdb`  
**Objectif** : Profiter de l'interface graphique d'Access pour la maintenance de la base MySQL.

Fonctionnement :

1. **Pilote ODBC MySQL** installé sur le poste de l'administrateur
2. Le fichier `.accdb` contient des **tables liées** (Linked Tables) pointant vers MySQL
3. Access sert d'interface graphique (formulaires, requêtes, rapports)

**Connexion ODBC (Open Database Connectivity)** :

1. **Installer le pilote MySQL ODBC** :
   - Télécharger : `mysql-connector-odbc-8.x.msi`
   - Installer avec les options par défaut

2. **Configurer une source de données ODBC** (fichier `.reg` fourni) :

   ```
   Windows Registry Editor Version 5.00

   [HKEY_LOCAL_MACHINE\SOFTWARE\ODBC\ODBC.INI\GestionRondes]
   "Driver"="MySQL ODBC 8.0 Unicode Driver"
   "Server"="127.0.0.1"
   "Database"="gestion_rondes"
   "Port"="3306"
   "User"="root"
   "Option"=dword:00000003
   ```

3. **Créer les tables liées dans Access** :
   - Ouvrir Access → Fichier → Nouveau → Base de données vierge
   - Données externes → Nouvelle source de données → ODBC
   - Sélectionner la source `GestionRondes`
   - Sélectionner toutes les tables : `sections`, `familles`, `type_ronde`, `operateurs`, `compteurs`, `releves`
   - Cocher "Enregistrer la connexion" et "Créer des tables liées"

**Avantages** :

- Interface graphique complète (saisie, édition, navigation)
- Création de formulaires personnalisés
- Génération de rapports et exports
- Requêtes visuelles (QBE)
- Pas besoin de compétences SQL avancées

**Fichier fourni** : `data/gestion-rondes.accdb` (base Access vierge avec les tables liées pré-configurées)

## 5. Points d'attention

### 5.1 Frontend JavaScript

- **Architecture modulaire** : Séparer le code en modules ES6 (`api.js`, `ui.js`, `scanner.js`, `app.js`)
- **Gestion d'état** : Utiliser des objets simples ou un state management léger (Store pattern)
- **Routing** : Système de navigation entre panels via hash ou History API
- **Build** : Optionnel mais recommandé pour la production (esbuild, rollup, ou webpack)

### 5.2 Sécurité

| Risque                 | Solution                                                         |
| ---------------------- | ---------------------------------------------------------------- |
| Mots de passe en clair | Hachage avec `password_hash()` en PHP                            |
| Injections SQL         | Utilisation systématique de PDO avec requêtes préparées          |
| XSS                    | Échappement des sorties avec `htmlspecialchars()`                |
| CORS                   | Configuration stricte : autoriser uniquement le domaine frontend |
| Accès non autorisés    | Authentification par token JWT ou session PHP                    |

### 5.2 Performance

- **Cache HTTP** : En-têtes `Cache-Control` pour les données statiques (sections, familles)
- **Pagination** : Pour l'historique des relevés (limiter à 50/appel)
- **Compression** : Activer Gzip/Brotli sur le serveur
- **CDN** : Pour les librairies JS statiques (qr-scanner)

### 5.3 Maintenance

- **Logs** : Enregistrer chaque action (connexion, modification, suppression)
- **Monitoring** : Vérifier l'espace disque BDD et les erreurs PHP
- **Sauvegardes** : Export automatique quotidien de la BDD
- **Mises à jour** : Veille sur les failles de sécurité PHP/MySQL

### 5.4 Évolutions futures possibles

- Export des données en PDF/Excel
- Graphiques d'évolution des consommations
- Notifications email en cas de dépassement de seuil
- Application mobile (React Native / Flutter) basée sur la même API
- Multi-sites (plusieurs usines dans la même BDD)

### 5.5 Hébergement gratuit

Pour un déploiement à coût zéro, il est possible d'utiliser :

| Service                        | Usage                                 | Limites                              |
| ------------------------------ | ------------------------------------- | ------------------------------------ |
| **GitHub Pages**               | Hébergement du frontend (HTML/JS/CSS) | 100 Go/mois, domaine `nom.gitHub.io` |
| **Vercel / Netlify**           | Frontend + Functions serverless       | 125k requêtes/mois (Vercel)          |
| **ClearDB MySQL**              | Base de données MySQL gratuite        | 5 Mo, 1 base par compte              |
| **PlanetScale**                | MySQL serverless gratuit              | 5 Go, 1 base                         |
| **Render / Fly.io**            | Backend PHP avec MySQL                | Free tier avec limitations           |
| **InfinityFree / ProFreeHost** | Hébergement PHP/MySQL mutualisé       | 1 Go espace, MySQL illimité          |

**Architecture hybride gratuite recommandée** :

```
Frontend  → GitHub Pages (gratuit)
Backend   → Render.com / Fly.io (free tier PHP)
Database  → PlanetScale / ClearDB (free tier MySQL)
```

**Étapes pour héberger sur GitHub** :

1. **Séparer le projet en 2 repositories** :
   - `testRondes-frontend` : contient `index.html`, `scripts.js`, `styles.css`, `lib/`
   - `testRondes-backend` : contient `api/`, `database.sql`, `docs/`

2. **Activer GitHub Pages** sur le repo frontend :
   - Settings → Pages → Source : `main` branch → `/root` ou `/docs`
   - URL : `https://nomutilisateur.github.io/testRondes-frontend`

3. **Déployer le backend** sur une plateforme gratuite :
   - **Option A (Render)** :
     - Créer un compte sur render.com
     - Nouveau Web Service → connecter le repo backend
     - Runtime : PHP 8, Build command : `composer install`
     - Ajouter la base MySQL PlanetScale en externe
   - **Option B (Fly.io)** :
     - Installer flyctl
     - `fly launch` dans le dossier backend
     - Déployer automatiquement depuis GitHub

4. **Configurer la base de données** :
   - Créer une instance PlanetScale
   - Importer `database.sql`
   - Mettre à jour les variables d'environnement (DB_HOST, DB_USER, DB_PASS)

5. **Configurer CORS** dans `api/config/db.php` :
   - Remplacer `*` par l'URL GitHub Pages
   - `header("Access-Control-Allow-Origin: https://nomutilisateur.github.io");`

6. **Automatiser les déploiements** avec GitHub Actions :
   - À chaque push sur `main`, déployer automatiquement
   - Fichier `.github/workflows/deploy.yml` à créer

**Exemple de workflow GitHub Actions** :

```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths:
      - "backend/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

**Inconvénients de l'hébergement gratuit** :

- ⚠️ Le backend peut se mettre en veille après quelques minutes d'inactivité (cold start ~30s)
- ⚠️ Limitations de requêtes par jour
- ⚠️ Pas de support technique prioritaire
- ⚠️ Public par défaut (attention aux données sensibles)

**Recommandation** : Commencer avec l'hébergement gratuit pour les tests, puis migrer vers un hébergement payant (~5€/mois) pour la production.

---

## 6. Planning Estimé

| Phase                                 | Durée estimée  | Ressources             |
| ------------------------------------- | -------------- | ---------------------- |
| **Phase 1** — Analyse & Documentation | 1 jour         | Développeur            |
| **Phase 2** — Adaptation Frontend     | 2-3 jours      | Développeur Frontend   |
| **Phase 3** — Finalisation Backend    | 2-3 jours      | Développeur Backend    |
| **Phase 4** — Tests & Validation      | 1 jour         | Développeur + Testeur  |
| **Phase 5** — Déploiement             | 1-2 jours      | Administrateur système |
| **TOTAL**                             | **7-10 jours** | —                      |

### Jalons clés

- **J+1** : Base de données créée, premiers endpoints fonctionnels
- **J+4** : Frontend capable de se connecter à l'API
- **J+7** : Tous les tests passent, application prête pour la recette
- **J+10** : Mise en production

---

## 7. Budget estimé

### 7.1 Hébergement gratuit (développement / tests)

| Poste                               | Coût                     |
| ----------------------------------- | ------------------------ |
| Hébergement frontend (GitHub Pages) | Gratuit                  |
| Hébergement backend (Render/Render) | Gratuit (free tier)      |
| Base de données (PlanetScale)       | Gratuit (5 Go)           |
| Nom de domaine                      | Gratuit (domaine fourni) |
| **TOTAL**                           | **0€**                   |

### 7.2 Hébergement professionnel (production)

| Poste                          | Coût       |
| ------------------------------ | ---------- |
| Hébergement mutualisé (1 an)   | ~ 60€      |
| Certificat SSL (Let's Encrypt) | Gratuit    |
| Nom de domaine (.com/.fr)      | ~ 10€/an   |
| Maintenance (si externalisée)  | ~ 200€/an  |
| **TOTAL première année**       | **~ 270€** |

---

## 8. Contacts et Responsabilités

| Rôle                              | Responsable |
| --------------------------------- | ----------- |
| Chef de projet                    | [À définir] |
| Développeur Backend               | [À définir] |
| Développeur Frontend              | [À définir] |
| Administrateur système / DevOps   | [À définir] |
| Utilisateur final / Product Owner | [À définir] |

---

## Annexe A : Fichiers à créer/modifier

### Nouveaux fichiers

| Fichier                       | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `backend/config/db.php`       | Configuration PDO                               |
| `backend/endpoints/*.php`     | Tous les endpoints API                          |
| `backend/middleware/auth.php` | Authentification                                |
| `docs/plan-de-migration.md`   | Ce document                                     |
| `docs/api-documentation.md`   | Documentation API                               |
| `backend/tools/access.php`    | Interface admin BDD web                         |
| `data/gestion-rondes.accdb`   | Fichier Access pour maintenance graphique MySQL |
| `deployment/*.sh`             | Scripts de déploiement                          |

### Fichiers à modifier

| Fichier      | Modifications                                  |
| ------------ | ---------------------------------------------- |
| `scripts.js` | Remplacer localStorage par appels API          |
| `index.html` | Ajouter indicateur de mode hors-ligne          |
| `styles.css` | Styles pour le loader et les messages d'erreur |

---

## Annexe B : Gestion des versions

- **Git** : Utiliser Git pour suivre les modifications
- **Branches** :
  - `main` : Production
  - `develop` : Développement
  - `feature/*` : Nouvelles fonctionnalités
- **Tags** : `v1.0.0`, `v1.1.0`, etc.

---

_Plan créé le 2026-06-29 — Dernière mise à jour : 2026-06-29_
