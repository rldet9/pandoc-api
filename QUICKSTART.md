# 🚀 Guide de démarrage rapide - Documentation OpenAPI

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

1. **Node.js** installé (version 12+)
2. **Pandoc** installé pour la conversion de documents
   ```bash
   # Windows (avec Chocolatey)
   choco install pandoc
   
   # Linux (Debian/Ubuntu)
   apt-get install pandoc
   
   # macOS (avec Homebrew)
   brew install pandoc
   ```

## ⚡ Démarrage rapide (30 secondes)

### Option 1 : Consultation hors ligne (RECOMMANDÉ pour débuter)

**Sans démarrer le serveur, consultez la documentation immédiatement :**

```bash
# Windows
start swagger-ui.html

# macOS
open swagger-ui.html

# Linux
xdg-open swagger-ui.html
```

✅ **Avantages** : Pas besoin de Pandoc, consultation immédiate, aucune configuration

### Option 2 : Avec le serveur complet

**Pour utiliser l'API complète avec Swagger UI intégré :**

```bash
# 1. Installer les dépendances (si pas déjà fait)
npm install

# 2. Compiler TypeScript
npm run build

# 3. Démarrer le serveur
npm start

# 4. Ouvrir dans le navigateur
http://localhost:4000/api-docs
```

## 📚 Accès à la documentation

Une fois le serveur démarré, vous avez accès à :

| URL | Description |
|-----|-------------|
| http://localhost:4000/ | Redirige vers `/api-docs` |
| http://localhost:4000/api-docs | Interface Swagger UI interactive |
| http://localhost:4000/openapi.json | Spécification OpenAPI JSON |
| http://localhost:4000/api/help | Aide Pandoc en texte brut |

## 🧪 Tester l'API avec Swagger UI

### 1. Lister les templates

1. Dans Swagger UI, cliquez sur **GET /api/templates**
2. Cliquez sur **"Try it out"**
3. (Optionnel) Entrez un format : `html`, `docx`, `pdf`
4. Cliquez sur **"Execute"**
5. Consultez la réponse

### 2. Ajouter un template

1. Cliquez sur **POST /api/templates/{format}**
2. Cliquez sur **"Try it out"**
3. Entrez le format : `html`
4. (Optionnel) Entrez un nom : `custom`
5. Cliquez sur **"Choose File"** et sélectionnez votre template
6. Cliquez sur **"Execute"**

### 3. Convertir un document

1. Cliquez sur **POST /api/convert/{command}**
2. Cliquez sur **"Try it out"**
3. Entrez une commande, par exemple : `from/markdown/to/html`
4. Cliquez sur **"Choose File"** et sélectionnez votre document
5. Cliquez sur **"Execute"**
6. Le document converti sera téléchargé

## 📖 Exemples de commandes de conversion

```bash
# Markdown vers HTML
from/markdown/to/html

# DOCX vers PDF
from/docx/to/pdf

# Avec template personnalisé
from/markdown/to/html/template/custom

# Avec nom de fichier de sortie
from/markdown/to/pdf/output/report.pdf

# Forme courte (f=from, t=to)
f/md/t/html
```

## 🔧 Import dans d'autres outils

### Postman

1. Ouvrir Postman
2. Cliquer sur **Import**
3. Choisir **Link** ou **File**
4. URL : `http://localhost:4000/openapi.json`
   OU Fichier : `openapi.json`
5. Cliquer sur **Import**

### Insomnia

1. Ouvrir Insomnia
2. Cliquer sur **Create** → **Import From**
3. Choisir **File** ou **URL**
4. Sélectionner `openapi.json`
5. Cliquer sur **Scan**

### Swagger Editor (en ligne)

1. Aller sur https://editor.swagger.io/
2. Cliquer sur **File** → **Import file**
3. Sélectionner `openapi.json`
4. Éditer et valider en temps réel

## 🐛 Résolution de problèmes

### Erreur : "pandoc n'est pas reconnu"

**Problème** : Pandoc n'est pas installé ou pas dans le PATH

**Solution** :
```bash
# Vérifier l'installation
pandoc --version

# Si non installé, installez-le :
# Windows: choco install pandoc
# Linux: apt-get install pandoc
# macOS: brew install pandoc
```

### Erreur : "Cannot find module 'swagger-ui-express'"

**Problème** : Dépendances non installées

**Solution** :
```bash
npm install
```

### Le port 4000 est déjà utilisé

**Problème** : Un autre processus utilise le port

**Solution** :
```bash
# Trouver le processus
netstat -ano | findstr :4000  # Windows
lsof -i :4000  # Linux/macOS

# Tuer le processus ou changer le port
# Modifier la variable d'environnement :
set PORT=5000  # Windows
export PORT=5000  # Linux/macOS
```

### swagger-ui.html ne charge pas la spécification

**Problème** : Fichiers pas dans le même dossier

**Solution** :
Assurez-vous que `swagger-ui.html` et `openapi.json` sont dans le même répertoire

## 📦 Vérification de l'installation

Exécutez le script de validation :

```bash
node validate-openapi.js
```

Vous devriez voir :
```
✅ La spécification OpenAPI est valide et complète !
📊 Résultat: 17/17 vérifications réussies
```

## 🎯 Endpoints principaux

| Tag | Endpoint | Description |
|-----|----------|-------------|
| Information | `GET /api/help` | Aide Pandoc |
| Templates | `GET /api/templates` | Liste les templates |
| Templates | `POST /api/templates/{format}` | Ajoute un template |
| Templates | `DELETE /api/templates/{format}/{name}` | Supprime un template |
| Conversion | `POST /api/convert/{command}` | Convertit un document |

## 📚 Documentation complète

- **Guide détaillé** : [OPENAPI-README.md](OPENAPI-README.md)
- **Résumé d'implémentation** : [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)
- **README principal** : [README.md](README.md)

## 🎉 Prêt à démarrer !

Vous avez maintenant tout ce qu'il faut pour :

✅ Consulter la documentation complète de l'API  
✅ Tester les endpoints interactivement  
✅ Importer dans vos outils préférés  
✅ Comprendre tous les paramètres et réponses  
✅ Voir des exemples concrets  

**Bon développement ! 🚀**

---

## 💡 Conseil

Commencez par ouvrir `swagger-ui.html` dans votre navigateur pour une première découverte rapide de l'API, puis démarrez le serveur pour tester les conversions réelles.
