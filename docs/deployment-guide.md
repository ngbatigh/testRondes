# Guide de Déploiement

## Prérequis

### Serveur

- **PHP 8.0+** avec extensions : `pdo_mysql`, `mbstring`, `json`
- **MySQL 5.7+ / MariaDB 10.3+**
- **Apache 2.4+** avec `mod_rewrite` activé (ou Nginx)
- Accès **SSH** ou **SFTP**
- **rsync** (optionnel, recommandé pour les scripts de déploiement)
- **HTTPS** (certificat SSL Let's Encrypt recommandé)

### Client

- Navigateur moderne (Chrome, Firefox, Edge, Safari)
- Connexion internet pour accéder à l'API

## Architecture de déploiement

```
Domaine : https://mondomaine.com
├── / (racine) → Frontend (index.html, scripts.js, styles.css, lib/)
├── /api/ → Backend PHP (API REST)
├── /backend/tools/ → Outils d'administration
└── Base MySQL : gestion_rondes
```

---

## 1. Installation rapide (via scripts)

### 1.1 Rendre les scripts exécutables

```bash
chmod +x deployment/*.sh
```

### 1.2 Déployer le frontend

```bash
./deployment/deploy-frontend.sh example.com root /var/www/html
```

### 1.3 Déployer le backend

```bash
./deployment/deploy-backend.sh example.com root /var/www/html localhost root motdepasse
```

---

## 2. Installation manuelle

### 2.1 Transférer les fichiers

```bash
# Frontend
scp index.html scripts.js styles.css qr-scanner.html user@serveur:/var/www/html/
scp -r lib/ user@serveur:/var/www/html/

# Backend
scp -r api/ user@serveur:/var/www/html/api/
scp database.sql user@serveur:/tmp/

# Administration
scp -r backend/ user@serveur:/var/www/html/backend/
```

### 2.2 Configurer la base de données

```bash
# Créer la base
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS gestion_rondes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importer les tables
mysql -u root -p gestion_rondes < database.sql
```

### 2.3 Configurer la connexion BDD

Éditer `api/config/db.php` avec les identifiants de production :

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'gestion_rondes');
define('DB_USER', 'mon_utilisateur');
define('DB_PASS', 'mon_mot_de_passe');
```

### 2.4 Sécuriser

**Protéger le dossier config :**

```apache
# backend/config/.htaccess
Deny from all
```

**Supprimer les fichiers de test en production :**

```bash
rm api/test_endpoints.php api/test_security.php
```

**Désactiver l'affichage des erreurs PHP :**

```ini
# php.ini
display_errors = Off
display_startup_errors = Off
```

**Configurer HTTPS :**

```bash
# Let's Encrypt
sudo certbot --apache -d mondomaine.com
```

---

## 3. Configuration CORS

Éditer `api/config/db.php` pour restreindre l'origine autorisée :

```php
// Remplacer * par le domaine du frontend
header("Access-Control-Allow-Origin: https://mondomaine.com");
// Ou pour plusieurs domaines : gérer dynamiquement
$allowedOrigins = ['https://mondomaine.com', 'https://app.mondomaine.com'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
```

---

## 4. Sauvegardes automatiques

Ajouter dans `crontab -e` :

```cron
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /var/www/html/deployment/backup.sh

# Sauvegarde hebdomadaire le dimanche à 3h
0 3 * * 0 /var/www/html/deployment/backup.sh
```

---

## 5. Vérification post-déploiement

### 5.1 Tester les endpoints

```bash
# Test de l'API
curl https://mondomaine.com/api/get_data.php
curl -X POST https://mondomaine.com/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"gbati@nadjombe","password":"admin"}'
```

### 5.2 Tester l'interface d'administration

Accéder à : `https://mondomaine.com/backend/tools/access.php`

### 5.3 Vérifier les logs

```bash
# Logs PHP
tail -f /var/log/apache2/error.log

# Logs MySQL
tail -f /var/log/mysql/error.log
```

---

## 6. Sécurité en production

| Mesure                       | Statut                         |
| ---------------------------- | ------------------------------ |
| HTTPS activé                 | ✅ Recommandé                  |
| Mots de passe hachés en BDD  | 🟡 À améliorer (password_hash) |
| Fichiers de test supprimés   | ✅ Recommandé                  |
| CORS restreint               | ✅ Recommandé                  |
| Erreurs PHP masquées         | ✅ Recommandé                  |
| Sauvegardes automatiques     | ✅ Configuré                   |
| Protection dossier config    | ✅ .htaccess                   |
| Limitation IP sur access.php | 🟡 Optionnel                   |

---

## 7. Hébergement gratuit

### Option GitHub Pages + Render + PlanetScale

**Frontend** (GitHub Pages) :

1. Créer un repo `testRondes-frontend`
2. Uploader `index.html`, `scripts.js`, `styles.css`, `lib/`
3. Activer GitHub Pages dans Settings

**Backend** (Render) :

1. Créer un compte Render.com
2. Connecter le repo backend
3. Runtime : PHP 8
4. Définir les variables d'environnement

**Base de données** (PlanetScale) :

1. Créer un compte PlanetScale
2. Créer une base `gestion_rondes`
3. Importer `database.sql`
4. Récupérer les identifiants de connexion

---

## 8. Hébergement professionnel (~5€/mois)

### Option OVH / o2switch / PlanetHoster

1. Commande d'un hébergement mutualisé PHP/MySQL
2. Accès SFTP + phpMyAdmin
3. Transférer les fichiers via FileZilla
4. Importer `database.sql` via phpMyAdmin
5. Configurer le domaine et le certificat SSL

---

## 9. Dépannage

### Erreur 500

```bash
# Voir les logs
tail -f /var/log/apache2/error.log
```

### Connexion BDD impossible

```bash
# Tester la connexion
mysql -h localhost -u root -p gestion_rondes -e "SELECT 1"
```

### API retourne vide

```bash
# Vérifier les permissions
chmod -R 755 /var/www/html/
chmod 644 /var/www/html/*.php
```

### Scanner QR ne fonctionne pas

- Vérifier que le site est en HTTPS (obligatoire pour la caméra)
- Vérifier le chemin du worker : `lib/qr-scanner-worker.min.js`

---

## 10. Rollback

En cas de problème, restaurer la version précédente :

```bash
# Restaurer la base
mysql -u root -p gestion_rondes < backup/gestion_rondes_2026-01-01.sql

# Restaurer les fichiers (via git)
git checkout v1.0.0

# Redéployer
./deployment/deploy-frontend.sh
./deployment/deploy-backend.sh
```
