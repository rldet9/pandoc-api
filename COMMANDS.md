# 🎯 Commandes Utiles - Documentation OpenAPI

## ⚡ Démarrage rapide

### Consulter la documentation (sans serveur)
```bash
# Windows
start swagger-ui.html

# macOS
open swagger-ui.html

# Linux
xdg-open swagger-ui.html
```

### Démarrer l'API complète
```bash
# Installation des dépendances
npm install

# Compilation TypeScript
npm run build

# Démarrage du serveur
npm start

# Accéder à la documentation
# http://localhost:4000/api-docs
```

## 🧪 Validation et tests

### Valider la spécification OpenAPI
```bash
node validate-openapi.js
```

### Compiler TypeScript
```bash
npm run build
```

### Compiler en mode watch (développement)
```bash
npm run watch
```

## 📥 Import dans des outils

### Postman
1. Ouvrir Postman
2. Import → Link or File
3. Sélectionner `openapi.json` ou utiliser `http://localhost:4000/openapi.json`

### Insomnia
1. Ouvrir Insomnia
2. Create → Import From → File or URL
3. Sélectionner `openapi.json`

### Swagger Editor (en ligne)
1. Aller sur https://editor.swagger.io/
2. File → Import file
3. Sélectionner `openapi.json`

## 🌐 URLs disponibles

| URL | Description |
|-----|-------------|
| http://localhost:4000/ | Redirige vers /api-docs |
| http://localhost:4000/api | Redirige vers /api-docs |
| http://localhost:4000/api-docs | Interface Swagger UI |
| http://localhost:4000/openapi.json | Spécification OpenAPI JSON |
| http://localhost:4000/api/help | Aide Pandoc (texte) |
| http://localhost:4000/api/templates | Liste des templates |

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| QUICKSTART.md | Guide de démarrage rapide (30s) |
| OPENAPI-README.md | Documentation complète OpenAPI |
| IMPLEMENTATION-SUMMARY.md | Résumé technique détaillé |
| CHANGELOG.md | Historique des modifications |
| SUCCESS.txt | Résumé visuel de l'implémentation |

## 🔧 Commandes de développement

### Modifier la spécification
```bash
# 1. Éditer openapi.json
code openapi.json

# 2. Valider les modifications
node validate-openapi.js

# 3. Recompiler si nécessaire
npm run build

# 4. Redémarrer le serveur
npm start
```

### Ajouter de nouveaux endpoints
```bash
# 1. Modifier src/app.ts pour ajouter la route
code src/app.ts

# 2. Documenter dans openapi.json
code openapi.json

# 3. Compiler et tester
npm run build
node validate-openapi.js
npm start
```

## 🐛 Dépannage

### Vérifier que Pandoc est installé
```bash
pandoc --version
```

### Vérifier le port 4000
```bash
# Windows
netstat -ano | findstr :4000

# Linux/macOS
lsof -i :4000
```

### Changer le port du serveur
```bash
# Windows
$env:PORT=5000; npm start

# Linux/macOS
PORT=5000 npm start
```

### Réinstaller les dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 Build Docker

### Construire l'image
```bash
docker build -t pandoc-api .
```

### Lancer le conteneur
```bash
docker run -d -p 4000:4000 --name=pandoc pandoc-api
```

### Accéder à la documentation dans Docker
```bash
# La documentation sera disponible à :
http://localhost:4000/api-docs
```

## 🔍 Validation avancée

### Valider avec swagger-cli
```bash
npm install -g @apidevtools/swagger-cli
swagger-cli validate openapi.json
```

### Générer un client à partir de la spécification
```bash
npm install -g @openapitools/openapi-generator-cli
openapi-generator-cli generate -i openapi.json -g javascript -o ./client
```

## 📤 Export et partage

### Télécharger la spécification
```bash
curl http://localhost:4000/openapi.json > openapi.json
```

### Partager via GitHub Pages
```bash
# Copier swagger-ui.html et openapi.json dans un repo
# Activer GitHub Pages sur la branche
# Accéder via https://username.github.io/repo/swagger-ui.html
```

## 🎨 Personnalisation

### Modifier le thème Swagger UI
Éditer `src/app.ts` :
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui { background: #f5f5f5 }
  `,
  customSiteTitle: 'Pandoc API Documentation',
  customfavIcon: '/favicon.ico',
}));
```

### Ajouter un logo personnalisé
```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customSiteTitle: 'Pandoc API',
  customCssUrl: '/custom.css',
  swaggerOptions: {
    url: '/openapi.json',
  }
}));
```

## 📊 Monitoring et logs

### Voir les logs du serveur
```bash
npm start
# Les logs s'affichent dans la console
```

### Logger les requêtes API
```bash
# Ajouter morgan pour plus de détails
npm install morgan @types/morgan
```

## 🚀 Déploiement

### Heroku
```bash
heroku create pandoc-api
git push heroku master
heroku open
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
# Déployer swagger-ui.html et openapi.json
netlify deploy --prod
```

## 💡 Astuces

### Tester rapidement un endpoint
```bash
# Liste des templates
curl http://localhost:4000/api/templates

# Convertir un document
curl -F file=@document.md http://localhost:4000/api/convert/from/markdown/to/html > output.html
```

### Générer des exemples de requêtes
Utiliser Swagger UI "Try it out" puis copier la commande curl générée

### Hot reload pendant le développement
```bash
# Terminal 1 : Watch TypeScript
npm run watch

# Terminal 2 : Nodemon
npm run nodemon
```

## 📞 Support

- **Documentation Pandoc** : https://pandoc.org/MANUAL.html
- **OpenAPI Specification** : https://swagger.io/specification/
- **Repository GitHub** : https://github.com/alphakevin/pandoc-api

## ✅ Checklist de vérification

- [ ] Pandoc installé (`pandoc --version`)
- [ ] Dépendances installées (`npm install`)
- [ ] Code compilé (`npm run build`)
- [ ] Validation réussie (`node validate-openapi.js`)
- [ ] Serveur démarré (`npm start`)
- [ ] Documentation accessible (http://localhost:4000/api-docs)
- [ ] Tests effectués dans Swagger UI

---

**Tout est prêt ! 🎉**
