#!/bin/bash
# Script de sauvegarde automatique de la base MySQL
# À placer dans crontab : 0 2 * * * /chemin/backup.sh

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/var/backups/gestion_rondes"
DB_NAME="gestion_rondes"
DB_USER="root"
DB_PASS=""
RETENTION_DAYS=30

echo "📦 Sauvegarde de la base $DB_NAME - $DATE"

mkdir -p "$BACKUP_DIR"

mysqldump -u "$DB_USER" -p"$DB_PASS" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    "$DB_NAME" > "$BACKUP_DIR/${DB_NAME}_$DATE.sql"

gzip "$BACKUP_DIR/${DB_NAME}_$DATE.sql"

echo "✅ Sauvegarde terminée : $BACKUP_DIR/${DB_NAME}_$DATE.sql.gz"

# Nettoyage des sauvegardes anciennes
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "🧹 Sauvegardes de plus de $RETENTION_DAYS jours supprimées"

# Vérification de l'espace disque
ESPACE=$(df -h "$BACKUP_DIR" | tail -1 | awk '{print $4}')
echo "💾 Espace disponible : $ESPACE"