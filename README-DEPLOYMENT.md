# Déploiement rapide en production

## 📦 Image disponible

\\\
rderet/pandoc-api:2025-11-27
\\\

## 🚀 Mise à jour en 3 étapes

### 1. Sur votre serveur de production, modifier \docker-compose.yml\

\\\yaml
pandoc-api:
  image: rderet/pandoc-api:2025-11-27  # ← Changer cette ligne
  container_name: pandoc-api
  restart: unless-stopped
  networks:
    - net-m3-n8n-01-int
  environment:
    - HOSTNAME=0.0.0.0
    - PORT=4000
  volumes:
    - /data/swarm_volume_local/m3-n8n-01/pandoc:/tmp
    - /data/swarm_volume_local/m3-n8n-01/pandoc/templates:/templates:ro
\\\

### 2. Redémarrer le service

\\\ash
docker-compose pull pandoc-api
docker-compose stop pandoc-api
docker-compose rm -f pandoc-api
docker-compose up -d pandoc-api
\\\

### 3. Vérifier

\\\ash
docker logs pandoc-api -f
\\\

## 🧪 Test avec template

\\\ash
curl -F file=@test.md \\
  "http://localhost:4000/api/convert/from/markdown/to/docx/reference-doc/%2Ftemplates%2Fmixtrio.dotx" \\
  -o result.docx
\\\

## 📚 Documentation complète

Voir [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) pour tous les détails.

## 🆕 Nouveautés

✅ Support de \--reference-doc\ pour les templates Word/PowerPoint/ODT
✅ Support de 58+ options pandoc supplémentaires
✅ Corrections pour environnements avec proxy d'entreprise
