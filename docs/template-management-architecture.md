# Architecture - Gestion des Templates

## Vue d'Ensemble du Système

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client HTTP                              │
│                   (cURL, Postman, Browser)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      Express App (app.ts)                        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Existing Routes                             │   │
│  │  • GET  /api/help                                        │   │
│  │  • POST /api/convert/:command(*)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              New Template Routes                         │   │
│  │  • GET    /api/templates                                 │   │
│  │  • POST   /api/templates/:format                         │   │
│  │  • DELETE /api/templates/:format/:name                   │   │
│  └──────────────────────┬──────────────────────────────────┘   │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          │ Function Calls
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│                  Templates Module (templates.ts)                  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Public Functions                                         │   │
│  │  • initTemplatesDirectory()                               │   │
│  │  • listTemplates(format?: string): Promise<TemplateInfo[]>│   │
│  │  • addTemplate(file, format, name?): Promise<TemplateInfo>│   │
│  │  • deleteTemplate(format, name): Promise<void>            │   │
│  │  • getTemplatePath(format, name): string                  │   │
│  │  • validateFormat(format): boolean                        │   │
│  └──────────────────────┬───────────────────────────────────┘   │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          │ File System Operations
                          │
┌─────────────────────────▼────────────────────────────────────────┐
│                    File System Storage                            │
│                                                                    │
│  ${os.tmpdir()}/pandoc-api/templates/                            │
│  ├── html/                                                        │
│  │   ├── custom-report.template                                  │
│  │   └── newsletter.template                                     │
│  ├── docx/                                                        │
│  │   └── corporate.template                                      │
│  ├── pdf/                                                         │
│  │   └── invoice.template                                        │
│  └── latex/                                                       │
│      └── academic.template                                        │
└───────────────────────────────────────────────────────────────────┘
```

## Flux de Données

### 1. Liste des Templates (GET /api/templates)

```
Client → Express → Templates Module → File System → Templates Module → Express → Client
   │                    │                   │               │                │        │
   │ GET /api/templates │                   │               │                │        │
   └────────────────────► listTemplates()   │               │                │        │
                         └───────────────────► fs.readdir() │                │        │
                                             └───────────────► [files]       │        │
                                                             └────────────────► JSON   │
                                                                              └────────► 200
```

### 2. Ajout d'un Template (POST /api/templates/:format)

```
Client → Express → Multer → Templates Module → File System → Templates Module → Express → Client
   │                │          │                     │              │                │         │
   │ POST + file    │          │                     │              │                │         │
   └────────────────► upload   │                     │              │                │         │
                    └──────────► req.file            │              │                │         │
                               │                     │              │                │         │
                               └─────────────────────► addTemplate()│                │         │
                                                     └──────────────► fs.writeFile() │         │
                                                                    └────────────────► info    │
                                                                                     └─────────► 201
```

### 3. Suppression d'un Template (DELETE /api/templates/:format/:name)

```
Client → Express → Templates Module → File System → Templates Module → Express → Client
   │                    │                   │               │                │        │
   │ DELETE /api/...    │                   │               │                │        │
   └────────────────────► deleteTemplate()  │               │                │        │
                         └───────────────────► fs.unlink()  │                │        │
                                             └───────────────► (deleted)     │        │
                                                             └────────────────► success│
                                                                              └────────► 200
```

## Structure des Modules

### Module templates.ts

```typescript
┌────────────────────────────────────────────────────────┐
│                    templates.ts                        │
├────────────────────────────────────────────────────────┤
│ Interfaces                                             │
│  • TemplateInfo                                        │
│    - name: string                                      │
│    - format: string                                    │
│    - size: number                                      │
│    - createdAt: Date                                   │
│    - path: string (ex: /templates/docx/mixtrio.dotx)   │
├────────────────────────────────────────────────────────┤
│ Functions                                              │
│  • initTemplatesDirectory()                            │
│  • listTemplates(format?: string)                      │
│  • addTemplate(file, format, name?)                    │
│  • deleteTemplate(format, name)                        │
│  • getTemplatePath(format, name)                       │
│  • validateFormat(format)                              │
├────────────────────────────────────────────────────────┤
│ Internal Helpers (private)                             │
│  • sanitizeName(name: string): string                  │
│  • getTemplateInfo(filePath: string): TemplateInfo     │
│  • ensureFormatDirectory(format: string): void         │
└────────────────────────────────────────────────────────┘
```

### Modifications dans app.ts

```typescript
┌────────────────────────────────────────────────────────┐
│                       app.ts                           │
├────────────────────────────────────────────────────────┤
│ Imports Existants                                      │
│  • express, multer, uuid, etc.                         │
│  • Converter, storage, errors                          │
├────────────────────────────────────────────────────────┤
│ Nouveaux Imports                                       │
│  • import * as templates from './templates'            │
├────────────────────────────────────────────────────────┤
│ createApp() Function                                   │
│  ├─ Initialization                                     │
│  │   └─ templates.initTemplatesDirectory()            │
│  │                                                      │
│  ├─ Existing Routes                                    │
│  │   ├─ GET  /                                         │
│  │   ├─ GET  /api/help                                 │
│  │   └─ POST /api/convert/:command(*)                  │
│  │                                                      │
│  ├─ New Template Routes                                │
│  │   ├─ GET    /api/templates                          │
│  │   ├─ POST   /api/templates/:format                  │
│  │   └─ DELETE /api/templates/:format/:name            │
│  │                                                      │
│  └─ Error Handlers                                     │
│      ├─ 404 handler                                    │
│      └─ errorHandler                                   │
└────────────────────────────────────────────────────────┘
```

### Modifications dans constants.ts

```typescript
┌────────────────────────────────────────────────────────┐
│                    constants.ts                        │
├────────────────────────────────────────────────────────┤
│ Constantes Existantes                                  │
│  • tmpDir = `${os.tmpdir()}/pandoc-api`               │
│  • stringValueOptions = [...]                          │
│  • availableValues = {...}                             │
│  • extensions = {...}                                  │
├────────────────────────────────────────────────────────┤
│ Nouvelles Constantes                                   │
│  • templatesDir = `${os.tmpdir()}/pandoc-api/templates`│
│  • supportedTemplateFormats = ['html', 'docx', ...]    │
└────────────────────────────────────────────────────────┘
```

## Gestion des Erreurs

```
┌─────────────────────────────────────────────────────┐
│                  Error Handling                      │
├─────────────────────────────────────────────────────┤
│ Classe ApiError (errors.ts)                         │
│  • status: number                                    │
│  • code: string                                      │
│  • message: string                                   │
├─────────────────────────────────────────────────────┤
│ Nouveaux Codes d'Erreur                             │
│  • 400 - invalid_format                              │
│  •     "Format de sortie non supporté"              │
│  • 400 - invalid_file                                │
│  •     "Fichier template invalide ou manquant"      │
│  • 404 - template_not_found                          │
│  •     "Template introuvable"                        │
│  • 409 - template_already_exists                     │
│  •     "Un template avec ce nom existe déjà"        │
└─────────────────────────────────────────────────────┘
```

## Dépendances

```
┌─────────────────────────────────────────────────────┐
│               NPM Dependencies                       │
├─────────────────────────────────────────────────────┤
│ Existantes (déjà installées)                        │
│  • express - Framework web                          │
│  • multer - Gestion des uploads multipart           │
│  • mime-types - Détection des types MIME            │
│  • uuid - Génération d'identifiants uniques         │
│  • async-middleware - Wrapper pour async routes     │
├─────────────────────────────────────────────────────┤
│ Node.js Built-in                                     │
│  • fs - Opérations sur le système de fichiers       │
│  • path - Manipulation de chemins                   │
│  • os - Informations système (tmpdir)               │
├─────────────────────────────────────────────────────┤
│ Aucune nouvelle dépendance requise ✓                │
└─────────────────────────────────────────────────────┘
```

## Points d'Extension Futurs

```
┌─────────────────────────────────────────────────────┐
│            Future Enhancements                       │
├─────────────────────────────────────────────────────┤
│ 1. Intégration avec le Converter                    │
│    converter.ts → convertWithTemplate()              │
│                                                       │
│ 2. Utilisation dans les conversions                 │
│    POST /api/convert/.../template/<name>             │
│                                                       │
│ 3. Validation avancée des templates                 │
│    Vérification syntaxe avant sauvegarde             │
│                                                       │
│ 4. Métadonnées enrichies                            │
│    Description, tags, auteur, version                │
│                                                       │
│ 5. Templates par défaut                              │
│    Inclus dans l'image Docker                        │
└─────────────────────────────────────────────────────┘
```

## Sécurité

```
┌─────────────────────────────────────────────────────┐
│            Security Considerations                   │
├─────────────────────────────────────────────────────┤
│ 1. Sanitization des noms                            │
│    • Interdire ../, ..\, caractères spéciaux        │
│    • Normaliser les espaces et accents              │
│                                                       │
│ 2. Limitation de taille                             │
│    • Configurer multer avec limits                   │
│    • Exemple: { fileSize: 5 * 1024 * 1024 } // 5MB  │
│                                                       │
│ 3. Path Traversal Prevention                        │
│    • Vérifier que le chemin final est dans          │
│      templatesDir                                    │
│                                                       │
│ 4. Pas d'authentification (comme l'API existante)   │
│    • À implémenter dans une version future           │
└─────────────────────────────────────────────────────┘
```

## Performance

```
┌─────────────────────────────────────────────────────┐
│            Performance Notes                         │
├─────────────────────────────────────────────────────┤
│ • listTemplates() : O(n) où n = nombre de fichiers  │
│ • addTemplate() : O(1) - écriture simple            │
│ • deleteTemplate() : O(1) - suppression simple      │
│                                                       │
│ • Pas de cache nécessaire pour cette version        │
│ • Lecture directe du système de fichiers            │
│ • Acceptable pour un nombre modéré de templates     │
└─────────────────────────────────────────────────────┘
```