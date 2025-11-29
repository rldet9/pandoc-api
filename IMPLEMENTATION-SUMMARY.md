# Implémentation de la Documentation OpenAPI v3 avec Swagger UI

## ✅ Résumé de l'implémentation

L'API Pandoc dispose maintenant d'une spécification OpenAPI v3 complète et d'une interface Swagger UI intégrée pour consulter et tester l'API de manière interactive.

## 📦 Fichiers créés

### 1. **openapi.json**
Spécification OpenAPI v3 complète au format JSON incluant :

- **Informations générales** : Titre, description, version, licence MIT, contact
- **Serveur** : Configuration pour localhost:4000
- **Tags** : Conversion, Templates, Information
- **6 endpoints documentés** :
  - `GET /` : Redirection vers /api-docs
  - `GET /api/help` : Aide Pandoc
  - `GET /api/templates` : Liste des templates (avec filtrage optionnel)
  - `POST /api/templates/{format}` : Ajout d'un template
  - `DELETE /api/templates/{format}/{name}` : Suppression d'un template
  - `POST /api/convert/{command}` : Conversion de documents
- **Schémas** : Template et Error
- **Réponses réutilisables** : BadRequest (400), NotFound (404), Conflict (409)
- **Exemples détaillés** : Requêtes et réponses pour chaque endpoint

### 2. **OPENAPI-README.md**
Documentation complète expliquant :
- Comment accéder à la documentation Swagger UI
- Contenu de la spécification
- Exemples d'utilisation
- Import dans d'autres outils (Postman, Insomnia, etc.)
- Personnalisation de Swagger UI
- Formats supportés

### 3. **swagger-ui.html**
Page HTML standalone permettant de :
- Consulter la documentation sans démarrer le serveur
- Utiliser Swagger UI directement depuis un navigateur
- Tester la spécification en mode "Try it out"

Ouvrir simplement le fichier dans un navigateur pour visualiser l'API.

## 🔧 Modifications des fichiers existants

### **src/app.ts**
Ajouts :
```typescript
// Import de swagger-ui-express
import * as swaggerUi from 'swagger-ui-express';
const openapiDocument = require('../openapi.json');

// Routes Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pandoc API Documentation',
}));

// Endpoint pour la spécification JSON
app.get('/openapi.json', (req, res) => {
  res.json(openapiDocument);
});

// Redirections
app.get('/', (req, res) => { res.redirect('/api-docs'); });
app.get('/api', (req, res) => { res.redirect('/api-docs'); });
```

### **README.md**
Ajout d'une section en haut du fichier :
```markdown
## 📚 API Documentation

**Complete OpenAPI v3 specification and Swagger UI now available!**

- **Swagger UI Interface**: http://localhost:4000/api-docs
- **OpenAPI JSON Specification**: http://localhost:4000/openapi.json
- **Detailed Documentation**: See [OPENAPI-README.md](OPENAPI-README.md)
```

### **package.json**
Nouvelles dépendances installées :
```json
{
  "dependencies": {
    "swagger-ui-express": "^5.0.0"
  },
  "devDependencies": {
    "@types/swagger-ui-express": "^4.1.6"
  }
}
```

## 🚀 Comment utiliser

### Option 1 : Avec le serveur (recommandé)

```bash
# Compiler le TypeScript
npm run build

# Démarrer le serveur
npm start

# Accéder à la documentation
http://localhost:4000/api-docs
```

### Option 2 : Sans serveur (HTML standalone)

```bash
# Ouvrir directement dans un navigateur
# Double-cliquer sur swagger-ui.html
# OU
start swagger-ui.html  # Windows
open swagger-ui.html   # macOS
xdg-open swagger-ui.html  # Linux
```

### Option 3 : Import dans des outils tiers

```bash
# Télécharger la spécification
curl http://localhost:4000/openapi.json > openapi.json

# Ou utiliser directement le fichier openapi.json
# - Postman : Import → OpenAPI 3.0
# - Insomnia : Import Data → OpenAPI
# - Swagger Editor : https://editor.swagger.io/
```

## 📋 Endpoints documentés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Redirige vers `/api-docs` |
| GET | `/api` | Redirige vers `/api-docs` |
| GET | `/api-docs` | Interface Swagger UI |
| GET | `/openapi.json` | Spécification OpenAPI JSON |
| GET | `/api/help` | Aide Pandoc (texte brut) |
| GET | `/api/templates` | Liste tous les templates |
| POST | `/api/templates/{format}` | Ajoute un template |
| DELETE | `/api/templates/{format}/{name}` | Supprime un template |
| POST | `/api/convert/{command}` | Convertit un document |

## 🎯 Points clés de la spécification

### Exemples de commandes de conversion

La documentation inclut 5 exemples pour `/api/convert/{command}` :

1. **markdown-to-html** : `from/markdown/to/html`
2. **docx-to-pdf** : `from/docx/to/pdf`
3. **with-template** : `from/markdown/to/html/template/custom`
4. **with-output** : `from/markdown/to/pdf/output/report.pdf`
5. **short-form** : `f/md/t/html`

### Formats de contenu supportés

**Entrée** :
- `multipart/form-data` (upload de fichier)
- `application/octet-stream` (upload RAW)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)
- `text/markdown`
- `text/html`

**Sortie** :
- `application/octet-stream` (générique)
- `text/html`
- `application/pdf`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX)

### Gestion des erreurs

Trois types d'erreurs documentées :

1. **400 Bad Request** : Fichier manquant, format invalide, option invalide
2. **404 Not Found** : Template introuvable, route inexistante
3. **409 Conflict** : Template existe déjà

Chaque erreur retourne :
```json
{
  "status": 400,
  "code": "error_code",
  "message": "Description de l'erreur"
}
```

## 🎨 Personnalisation

### Swagger UI

Modifier dans `src/app.ts` :
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Pandoc API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
  }
}));
```

### Spécification OpenAPI

Éditer `openapi.json` directement, puis :
```bash
npm run build
npm start
```

## 📊 Statistiques

- **Endpoints documentés** : 6 principaux
- **Schémas définis** : 2 (Template, Error)
- **Réponses réutilisables** : 3 (BadRequest, NotFound, Conflict)
- **Exemples** : 15+ exemples de requêtes/réponses
- **Lignes de spécification** : ~550 lignes JSON formaté

## ✨ Fonctionnalités Swagger UI

- **Try it out** : Tester les endpoints directement depuis l'interface
- **Exemples interactifs** : Voir et modifier les requêtes
- **Schémas détaillés** : Documentation complète des modèles
- **Filtrage** : Recherche dans la documentation
- **Liens profonds** : URLs partageables pour chaque endpoint
- **Téléchargement** : Export de la spécification

## 🔍 Validation

La spécification OpenAPI peut être validée avec :

1. **Swagger Editor** : https://editor.swagger.io/
   - Copier/coller le contenu de `openapi.json`
   - Vérifier les erreurs en temps réel

2. **Swagger Validator** : https://validator.swagger.io/validator/debug
   - Valider la conformité OpenAPI 3.0.3

3. **Commande** :
   ```bash
   npx @apidevtools/swagger-cli validate openapi.json
   ```

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que Pandoc est installé
pandoc --version

# Si non installé
# Windows : choco install pandoc
# Linux : apt-get install pandoc
# macOS : brew install pandoc
```

### Swagger UI ne se charge pas
```bash
# Vérifier que les dépendances sont installées
npm install

# Recompiler TypeScript
npm run build

# Vérifier le port
netstat -an | findstr :4000
```

### La spécification n'apparaît pas
```bash
# Vérifier que openapi.json existe
dir openapi.json  # Windows
ls -la openapi.json  # Linux/macOS

# Vérifier les permissions
icacls openapi.json  # Windows
```

## 📚 Ressources

- **OpenAPI Specification** : https://swagger.io/specification/
- **Swagger UI** : https://swagger.io/tools/swagger-ui/
- **Pandoc Documentation** : https://pandoc.org/MANUAL.html
- **Repository GitHub** : https://github.com/alphakevin/pandoc-api

## 🎉 Résultat final

L'API Pandoc dispose maintenant de :

✅ Spécification OpenAPI v3 complète et conforme  
✅ Interface Swagger UI intégrée et personnalisée  
✅ Documentation accessible via HTTP  
✅ Fichier HTML standalone pour consultation hors ligne  
✅ Exemples détaillés pour tous les endpoints  
✅ Schémas de données bien définis  
✅ Gestion des erreurs documentée  
✅ Import facile dans Postman, Insomnia, etc.  
✅ README mis à jour avec les nouvelles informations  

L'implémentation est complète et prête à l'emploi ! 🚀
