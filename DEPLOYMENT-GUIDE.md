# Guide de mise à jour en production

## 📦 Image disponible

L'image avec le support de \--reference-doc\ est disponible sur Docker Hub :

\\\
rderet/pandoc-api:latest
rderet/pandoc-api:2025-11-27
\\\

## 🔄 Mise à jour sur le serveur de production

### 1. Se connecter au serveur

\\\ash
ssh user@serveur-production
\\\

### 2. Modifier le docker-compose.yml

Remplacer :
\\\yaml
pandoc-api:
  image: alphakevin/pandoc-api:latest
\\\

Par :
\\\yaml
pandoc-api:
  image: rderet/pandoc-api:latest  # ou rderet/pandoc-api:2025-11-27
\\\

Configuration complète recommandée :
\\\yaml
pandoc-api:
  image: rderet/pandoc-api:2025-11-27  # Version spécifique pour stabilité
  container_name: pandoc-api
  restart: unless-stopped
  networks:
    - net-m3-n8n-01-int
  environment:
    - HOSTNAME=0.0.0.0
    - PORT=4000
  volumes:
    # Répertoire temporaire pour les conversions
    - /data/swarm_volume_local/m3-n8n-01/pandoc:/tmp
    # Répertoire des templates (lecture seule)
    - /data/swarm_volume_local/m3-n8n-01/pandoc/templates:/templates:ro
\\\

### 3. Arrêter et supprimer l'ancien conteneur

\\\ash
docker-compose stop pandoc-api
docker-compose rm -f pandoc-api
\\\

### 4. Télécharger la nouvelle image

\\\ash
docker pull rderet/pandoc-api:2025-11-27
\\\

### 5. Redémarrer le service

\\\ash
docker-compose up -d pandoc-api
\\\

### 6. Vérifier le démarrage

\\\ash
# Vérifier que le conteneur tourne
docker ps | grep pandoc-api

# Consulter les logs
docker logs pandoc-api -f

# Attendre le message : "# pandoc-api started on http://0.0.0.0:4000"
\\\

## 🧪 Test de validation

### 1. Test de base (sans template)

\\\ash
curl -F file=@test.md \\
  http://localhost:4000/api/convert/from/markdown/to/docx \\
  -o test-basic.docx
\\\

### 2. Test avec reference-doc

\\\ash
# Encoder le chemin : /templates/mixtrio.dotx → %2Ftemplates%2Fmixtrio.dotx
curl -F file=@test.md \\
  "http://localhost:4000/api/convert/from/markdown/to/docx/reference-doc/%2Ftemplates%2Fmixtrio.dotx" \\
  -o test-with-template.docx
\\\

### 3. Vérifier les logs

\\\ash
docker logs pandoc-api --tail 20
\\\

Vous devriez voir :
\\\
pandoc --from=markdown --to=docx --reference-doc=/templates/mixtrio.dotx --output=...
\\\

## 📁 Organisation des templates

Placez vos templates dans :
\\\
/data/swarm_volume_local/m3-n8n-01/pandoc/templates/
├── mixtrio.dotx
├── autre-template.dotx
└── ...
\\\

## 🔗 Utilisation depuis n8n

Dans votre workflow n8n, utilisez l'URL :
\\\
http://pandoc-api:4000/api/convert/from/markdown/to/docx/reference-doc/%2Ftemplates%2Fmixtrio.dotx
\\\

Avec un nœud HTTP Request :
- **Method** : POST
- **URL** : L'URL ci-dessus
- **Body** : Form-Data
  - **file** : Votre fichier markdown

## 🔙 Rollback (si problème)

\\\ash
# Revenir à l'ancienne version
docker-compose stop pandoc-api
docker-compose rm -f pandoc-api

# Modifier docker-compose.yml pour revenir à alphakevin/pandoc-api:latest
# Puis :
docker-compose up -d pandoc-api
\\\

## 📊 Monitoring

\\\ash
# Surveiller les ressources
docker stats pandoc-api

# Surveiller les logs en continu
docker logs -f pandoc-api
\\\

## ⚠️ Notes importantes

1. **Version spécifique** : Utilisez \deret/pandoc-api:2025-11-27\ plutôt que \latest\ pour éviter les mises à jour automatiques non contrôlées

2. **Templates** : Assurez-vous que les templates sont bien présents dans \/templates/\ dans le conteneur

3. **Encodage URL** : N'oubliez pas d'encoder les \/\ en \%2F\ dans les chemins de templates

4. **Permissions** : Le répertoire templates doit être accessible en lecture par le conteneur

5. **Réseau** : Le conteneur doit être sur le même réseau que n8n pour la communication interne
