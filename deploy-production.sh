#!/bin/bash
# Script de déploiement de pandoc-api en production
# Usage: ./deploy-production.sh [version]
# Exemple: ./deploy-production.sh 2025-11-27

set -e

VERSION=${1:-latest}
IMAGE="rderet/pandoc-api:$VERSION"
CONTAINER_NAME="pandoc-api"

echo "🚀 Déploiement de pandoc-api version $VERSION"
echo "================================================"

# 1. Vérifier que nous sommes sur le bon serveur
if [ ! -f /data/swarm_volume_local/m3-n8n-01/pandoc/templates/mixtrio.dotx ]; then
    echo "⚠️  Attention: Le template mixtrio.dotx n'existe pas"
    read -p "Continuer quand même? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 2. Arrêter le conteneur actuel
echo "📦 Arrêt du conteneur actuel..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 3. Télécharger la nouvelle image
echo "⬇️  Téléchargement de l'image $IMAGE..."
docker pull $IMAGE

# 4. Démarrer le nouveau conteneur
echo "▶️  Démarrage du nouveau conteneur..."
docker-compose up -d pandoc-api

# 5. Attendre le démarrage
echo "⏳ Attente du démarrage..."
sleep 3

# 6. Vérifier le statut
echo ""
echo "✅ Statut du conteneur:"
docker ps | grep pandoc-api || echo "❌ Conteneur non trouvé!"

echo ""
echo "📋 Logs récents:"
docker logs $CONTAINER_NAME --tail 10

echo ""
echo "🧪 Pour tester:"
echo "  curl -F file=@test.md http://localhost:4000/api/convert/from/markdown/to/docx -o test.docx"
echo ""
echo "✅ Déploiement terminé!"
