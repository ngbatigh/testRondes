#!/bin/bash
# Script de déploiement du frontend
# Usage : ./deploy-frontend.sh [serveur] [utilisateur] [chemin_distant]

SERVEUR=${1:-"example.com"}
UTILISATEUR=${2:-"root"}
CHEMIN_DISTANT=${3:-"/var/www/html"}

echo "🚀 Déploiement du frontend vers $UTILISATEUR@$SERVEUR:$CHEMIN_DISTANT"

# Fichiers à déployer
FICHIERS="index.html scripts.js styles.css qr-scanner.html lib/"

# Vérification que rsync est disponible
if ! command -v rsync &> /dev/null; then
    echo "❌ rsync n'est pas installé. Installez-le d'abord."
    exit 1
fi

# Synchronisation
rsync -avz --progress \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='api' \
    --exclude='backend' \
    --exclude='deployment' \
    $FICHIERS "$UTILISATEUR@$SERVEUR:$CHEMIN_DISTANT/"

if [ $? -eq 0 ]; then
    echo "✅ Frontend déployé avec succès !"
    echo "📍 Accès : http://$SERVEUR"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi