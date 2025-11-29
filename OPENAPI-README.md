# Documentation OpenAPI Swagger

Ce projet inclut maintenant une spécification OpenAPI v3 complète et une interface Swagger UI intégrée.

## 📋 Fichiers ajoutés

- **`openapi.json`** : Spécification OpenAPI v3 complète au format JSON
- **Routes Swagger intégrées** : Documentation accessible via l'application

## 🚀 Accès à la documentation

Une fois le serveur démarré, la documentation Swagger est accessible à :

- **Interface Swagger UI** : http://localhost:4000/api-docs
- **Spécification JSON** : http://localhost:4000/openapi.json
- **Redirection racine** : http://localhost:4000/ → redirige vers `/api-docs`

## 📚 Contenu de la documentation

La spécification OpenAPI décrit tous les endpoints de l'API :

### 1. **Information**
- `GET /` : Redirection vers la documentation
- `GET /api/help` : Aide de Pandoc en texte brut

### 2. **Templates Management**
- `GET /api/templates` : Liste tous les templates (filtrable par format)
- `POST /api/templates/{format}` : Ajoute un nouveau template
- `DELETE /api/templates/{format}/{name}` : Supprime un template

### 3. **Document Conversion**
- `POST /api/convert/{command}` : Convertit un document selon les options Pandoc

## 🔧 Exemples d'utilisation

### Consulter la documentation Swagger

```bash
# Démarrer le serveur
npm start

# Ouvrir dans un navigateur
http://localhost:4000/api-docs
```

### Télécharger la spécification OpenAPI

```bash
# Via curl
curl http://localhost:4000/openapi.json > openapi.json

# Via navigateur
http://localhost:4000/openapi.json
```

### Importer dans d'autres outils

La spécification `openapi.json` peut être importée dans :

- **Postman** : Import → OpenAPI 3.0
- **Insomnia** : Import/Export → Import Data → OpenAPI
- **Swagger Editor** : https://editor.swagger.io/
- **Stoplight Studio** : Pour documentation avancée
- **API Gateway** : AWS, Azure, Google Cloud

## 📖 Structure de la spécification

```json
{
  "openapi": "3.0.3",
  "info": { ... },
  "servers": [ ... ],
  "tags": [ ... ],
  "paths": {
    "/": { ... },
    "/api/help": { ... },
    "/api/templates": { ... },
    "/api/templates/{format}": { ... },
    "/api/templates/{format}/{name}": { ... },
    "/api/convert/{command}": { ... }
  },
  "components": {
    "schemas": { ... },
    "responses": { ... }
  }
}
```

## 🎨 Personnalisation Swagger UI

La configuration actuelle cache la barre supérieure pour une interface épurée. Pour personnaliser :

```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pandoc API Documentation',
  // Ajoutez d'autres options ici
}));
```

## 📝 Schémas définis

### Template
```json
{
  "name": "string",
  "format": "string",
  "size": "number",
  "createdAt": "date-time",
  "path": "string"
}
```

### Error
```json
{
  "status": "integer",
  "code": "string",
  "message": "string"
}
```

## 🔍 Exemples de commandes de conversion

La documentation inclut des exemples pour l'endpoint `/api/convert/{command}` :

- `from/markdown/to/html` : Conversion Markdown → HTML
- `from/docx/to/pdf` : Conversion DOCX → PDF
- `from/markdown/to/html/template/custom` : Avec template personnalisé
- `from/markdown/to/pdf/output/report.pdf` : Avec nom de fichier de sortie
- `f/md/t/html` : Forme courte (f=from, t=to)

## 🛠️ Développement

### Modifier la spécification

1. Éditer `openapi.json`
2. Recompiler TypeScript : `npm run build`
3. Redémarrer le serveur : `npm start`

### Valider la spécification

Utilisez des outils en ligne pour valider :

- Swagger Editor : https://editor.swagger.io/
- Swagger Validator : https://validator.swagger.io/validator/debug

## 📦 Dépendances ajoutées

```json
{
  "dependencies": {
    "swagger-ui-express": "^5.x.x"
  },
  "devDependencies": {
    "@types/swagger-ui-express": "^4.x.x"
  }
}
```

## 🌐 Utilisation avec Docker

La documentation est également disponible dans le conteneur Docker :

```bash
docker run -d -p 4000:4000 alphakevin/pandoc-api
# Accéder à http://localhost:4000/api-docs
```

## 📄 Formats supportés

La documentation décrit les formats de contenu supportés :

- **Entrée** : `multipart/form-data`, `application/octet-stream`, DOCX, Markdown, HTML
- **Sortie** : HTML, PDF, DOCX, et tous les formats supportés par Pandoc

## 🔐 Sécurité

Comme indiqué dans la documentation principale :
> Ce serveur est conçu pour fonctionner comme micro-service interne. Il ne comprend pas de méthode d'autorisation. Déployez-le publiquement à vos propres risques.

## 📞 Support

Pour plus d'informations sur Pandoc et ses options :
- Documentation Pandoc : https://pandoc.org/MANUAL.html
- Repository GitHub : https://github.com/alphakevin/pandoc-api
