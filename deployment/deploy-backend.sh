#!/bin/bash
# Script de déploiement du backend
# Usage : ./deploy-backend.sh [serveur] [utilisateur] [chemin_distant] [db_host] [db_user] [db_pass]

SERVEUR=${1:-"example.com"}
UTILISATEUR=${2:-"root"}
CHEMIN_DISTANT=${3:-"/var/www/html"}
DB_HOST=${4:-"localhost"}
DB_USER=${5:-"root"}
DB_PASS=${6:-""}

echo "🚀 Déploiement du backend vers $UTILISATEUR@$SERVEUR:$CHEMIN_DISTANT"

if ! command -v rsync &> /dev/null; then
    echo "❌ rsync n'est pas installé."
    exit 1
fi

echo "📁 Création du répertoire distant..."
ssh "$UTILISATEUR@$SERVEUR" "mkdir -p $CHEMIN_DISTANT/api/config $CHEMIN_DISTANT/backend/tools"

rsync -avz --progress --exclude='.git' --exclude='node_modules' --exclude='deployment' \
    api/ "$UTILISATEUR@$SERVEUR:$CHEMIN_DISTANT/api/"

rsync -avz --progress database.sql "$UTILISATEUR@$SERVEUR:$CHEMIN_DISTANT/"

if [ $? -eq 0 ]; then
    echo "✅ Backend déployé !"
    echo "📦 Import de la base..."
    ssh "$UTILISATEUR@$SERVEUR" "mysql -h $DB_HOST -u $DB_USER -p$DB_PASS gestion_rondes < $CHEMIN_DISTANT/database.sql"
    
    echo "⚙️  Mise à jour config..."
    ssh "$UTILISATEUR@$SERVEUR" "sed -i \"s/define('DB_HOST', 'localhost')/define('DB_HOST', '$DB_HOST')/\" $CHEMIN_DISTANT/api/config/db.php"
    ssh "$UTILISATEUR@$SERVEUR" "sed -i \"s/define('DB_USER', 'root')/define('DB_USER', '$DB_USER')/\" $CHEMIN_DISTANT/api/config/db.php"
    ssh "$UTILISATEUR@$SERVEUR" "sed -i \"s/define('DB_PASS', '')/define('DB_PASS', '$DB_PASS')/\" $CHEMIN_DISTANT/api/config/db.php"
    
    echo "📍 API : http://$SERVEUR/api/"
else
    echo "❌ Erreur"
    exit 1
fi