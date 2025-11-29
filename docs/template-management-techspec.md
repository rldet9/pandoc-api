# Spécifications Techniques - Gestion des Templates Pandoc

## Vue d'ensemble

Ce document décrit l'implémentation technique pour ajouter la gestion des templates à l'API Pandoc. Les templates Pandoc permettent de personnaliser la sortie des documents convertis (en-têtes, pieds de page, mise en page, etc.).

### Objectifs

- Permettre aux utilisateurs de lister les templates disponibles
- Permettre l'ajout de nouveaux templates via upload de fichiers
- Permettre la suppression de templates existants
- Assurer la persistence des templates entre les redémarrages du serveur

## Architecture Technique

### 1. Structure de Stockage

#### 1.1 Dossier de Templates

- **Emplacement** : Créer un nouveau dossier dédié aux templates
  - Path : `${os.tmpdir()}/pandoc-api/templates`
  - Ce dossier sera persisté (contrairement au dossier tmp des conversions)
  
- **Organisation** : Les templates seront organisés par format de sortie
  - Structure : `templates/<output-format>/<template-name>.template`
  - Exemple : `templates/html/custom-report.template`, `templates/docx/corporate.template`

#### 1.2 Constante de Configuration

Ajouter dans `src/constants.ts` :
- Variable `templatesDir` : chemin vers le dossier des templates
- Fonction utilitaire pour vérifier/créer le dossier au démarrage

### 2. Nouveau Module Templates

#### 2.1 Créer `src/templates.ts`

Ce module contiendra la logique métier pour la gestion des templates.

**Responsabilités** :
- Lister les templates disponibles par format
- Valider les uploads de templates
- Sauvegarder les templates sur le système de fichiers
- Supprimer les templates
- Vérifier l'existence et la validité des templates

**Fonctions principales** :

1. `listTemplates(format?: string): Promise<TemplateInfo[]>`
   - Liste tous les templates ou filtre par format de sortie
   - Retourne un tableau d'objets contenant : nom, format, taille, date de création, chemin
   
2. `addTemplate(file: Express.Multer.File, format: string, name?: string): Promise<TemplateInfo>`
   - Valide le fichier uploadé
   - Vérifie que le format est supporté par Pandoc
   - Génère un nom si non fourni (basé sur le nom du fichier)
   - Sauvegarde le template dans `templates/<format>/`
   - Retourne les informations du template créé

3. `deleteTemplate(format: string, name: string): Promise<void>`
   - Vérifie l'existence du template
   - Supprime le fichier du système de fichiers
   - Lance une erreur 404 si le template n'existe pas

4. `getTemplatePath(format: string, name: string): string`
   - Retourne le chemin complet vers un template
   - Utilisé par le converter pour appliquer un template lors de la conversion

5. `validateFormat(format: string): boolean`
   - Vérifie que le format de sortie est supporté par Pandoc
   - Utilise les informations de `constants.ts`

**Types TypeScript** :

```typescript
interface TemplateInfo {
  name: string;
  format: string;
  size: number;
  createdAt: Date;
  path: string;
}
```

### 3. Nouveaux Endpoints API

#### 3.1 GET `/api/templates`

**Objectif** : Lister tous les templates disponibles

**Query Parameters** :
- `format` (optionnel) : Filtrer par format de sortie (html, docx, pdf, etc.)

**Réponse Succès (200)** :
```json
{
  "templates": [
    {
      "name": "custom-report",
      "format": "html",
      "size": 2048,
      "createdAt": "2025-11-28T10:30:00Z",
      "path": "/templates/html/custom-report.template"
    },
    {
      "name": "corporate",
      "format": "docx",
      "size": 4096,
      "createdAt": "2025-11-27T15:20:00Z",
      "path": "/templates/docx/corporate.template"
    }
  ]
}
```

**Implémentation** :
- Route : `app.get('/api/templates', wrap(async (req, res) => {...}))`
- Utiliser `listTemplates()` du module templates
- Gérer le paramètre de query `format`

#### 3.2 POST `/api/templates/:format`

**Objectif** : Ajouter un nouveau template

**Path Parameters** :
- `format` (requis) : Format de sortie du template (html, docx, pdf, etc.)

**Query Parameters** :
- `name` (optionnel) : Nom personnalisé pour le template

**Body** :
- Multipart form-data avec un champ `file` contenant le fichier template

**Réponse Succès (201)** :
```json
{
  "message": "Template added successfully",
  "template": {
    "name": "custom-report",
    "format": "html",
    "size": 2048,
    "createdAt": "2025-11-28T10:30:00Z",
    "path": "/templates/html/custom-report.template"
  }
}
```

**Erreurs possibles** :
- 400 : Fichier manquant ou format invalide
- 409 : Un template avec ce nom existe déjà pour ce format

**Implémentation** :
- Route : `app.post('/api/templates/:format', upload.single('file'), wrap(async (req, res) => {...}))`
- Valider que le fichier est présent
- Valider le format avec `validateFormat()`
- Utiliser `addTemplate()` du module templates
- Retourner status 201 avec les infos du template créé

#### 3.3 DELETE `/api/templates/:format/:name`

**Objectif** : Supprimer un template existant

**Path Parameters** :
- `format` (requis) : Format du template
- `name` (requis) : Nom du template

**Réponse Succès (200)** :
```json
{
  "message": "Template deleted successfully",
  "template": {
    "name": "custom-report",
    "format": "html"
  }
}
```

**Erreurs possibles** :
- 404 : Template non trouvé

**Implémentation** :
- Route : `app.delete('/api/templates/:format/:name', wrap(async (req, res) => {...}))`
- Utiliser `deleteTemplate()` du module templates
- Gérer l'erreur 404 si le template n'existe pas

### 4. Modifications du Module Existant

#### 4.1 Mise à jour de `src/constants.ts`

**Ajouts nécessaires** :
- Constante `templatesDir` : `${os.tmpdir()}/pandoc-api/templates`
- Liste des formats supportés pour les templates (si pas déjà présent)

#### 4.2 Mise à jour de `src/app.ts`

**Ajouts** :
- Import du module templates
- Déclaration des 3 nouvelles routes API
- Initialisation du dossier templates au démarrage

**Position des routes** :
- Ajouter les routes de gestion des templates après la route `/api/help`
- Avant la route de conversion `/api/convert/:command(*)`

**Structure** :
```typescript
// ... imports existants
import * as templates from './templates';

export function createApp() {
  // ... code existant ...
  
  // Templates management routes
  app.get('/api/templates', wrap(async (req, res) => {
    // implémentation
  }));
  
  app.post('/api/templates/:format', upload.single('file'), wrap(async (req, res) => {
    // implémentation
  }));
  
  app.delete('/api/templates/:format/:name', wrap(async (req, res) => {
    // implémentation
  }));
  
  // ... routes existantes de conversion ...
}
```

#### 4.3 Mise à jour de `src/converter.ts` (Optionnel - pour utilisation future)

**Modification future** : Préparer l'intégration des templates dans les conversions

Ajouter une méthode pour appliquer un template :
- `convertWithTemplate(inputFile: string, options: CommandOptions, templateName: string): Promise<string>`
- Cette méthode ajoutera l'option `--template=<path>` aux arguments Pandoc

**Note** : Cette modification n'est pas requise pour la phase initiale de gestion des templates, mais permet de préparer l'intégration future.

### 5. Gestion des Erreurs

#### 5.1 Nouvelles Erreurs Spécifiques

Utiliser la classe `ApiError` existante avec les codes suivants :

- **template_not_found** (404) : Template demandé introuvable
- **invalid_format** (400) : Format de sortie non supporté
- **invalid_file** (400) : Fichier template invalide ou manquant
- **template_already_exists** (409) : Un template avec ce nom existe déjà

#### 5.2 Validation des Formats

Valider que le format demandé est supporté par Pandoc en utilisant les extensions définies dans `constants.ts`.

### 6. Initialisation et Persistence

#### 6.1 Initialisation au Démarrage

Dans `src/app.ts` ou `src/templates.ts` :
- Vérifier l'existence du dossier `templatesDir`
- Créer le dossier s'il n'existe pas
- Créer les sous-dossiers pour les formats courants (html, docx, pdf, latex, etc.)

**Code d'initialisation** :
```typescript
function initTemplatesDirectory() {
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }
}
```

#### 6.2 Persistence

Les templates sont stockés dans le système de fichiers, ils persistent naturellement entre les redémarrages du serveur (contrairement aux fichiers temporaires de conversion qui sont dans `tmpDir`).

### 7. Tests et Validation

#### 7.1 Tests Manuels à Effectuer

Après implémentation, tester les scénarios suivants :

1. **Liste vide initiale**
   - GET `/api/templates` retourne un tableau vide

2. **Ajout de template**
   - POST `/api/templates/html` avec un fichier template
   - Vérifier la réponse 201 avec les bonnes informations
   - Vérifier que le fichier est bien créé sur le système de fichiers

3. **Liste avec templates**
   - GET `/api/templates` retourne les templates ajoutés
   - GET `/api/templates?format=html` filtre correctement

4. **Suppression de template**
   - DELETE `/api/templates/html/nom-du-template`
   - Vérifier la réponse 200
   - Vérifier que le fichier est supprimé du système de fichiers

5. **Gestion des erreurs**
   - POST sans fichier → 400
   - POST avec format invalide → 400
   - DELETE template inexistant → 404
   - POST avec nom déjà existant → 409

#### 7.2 Cas Limites

- Noms de fichiers avec caractères spéciaux : sanitizer les noms
- Templates de grande taille : considérer une limite de taille
- Formats de sortie exotiques : valider contre une liste connue

### 8. Documentation API

#### 8.1 Mise à jour du README

Ajouter une section "Template Management" dans le README.md :

```markdown
## Template Management

The API provides endpoints to manage Pandoc templates for customizing document output.

### List Templates

```http
GET /api/templates
GET /api/templates?format=html
```

### Add Template

```http
POST /api/templates/:format
Content-Type: multipart/form-data

file: <template-file>
```

### Delete Template

```http
DELETE /api/templates/:format/:name
```

### Using Templates in Conversion

Templates can be referenced in conversion by adding the template option:

```http
POST /api/convert/from/markdown/to/html/template/custom-report
```
```

#### 8.2 Exemples cURL

Fournir des exemples pratiques :

```bash
# List all templates
curl http://localhost:4000/api/templates

# Add a template
curl -F file=@my-template.html http://localhost:4000/api/templates/html?name=custom

# Delete a template
curl -X DELETE http://localhost:4000/api/templates/html/custom
```

## Ordre d'Implémentation

### Phase 1 : Fondations (Priorité Haute)

1. Créer la constante `templatesDir` dans `constants.ts`
2. Créer le module `templates.ts` avec les fonctions de base
3. Implémenter la fonction d'initialisation du dossier templates

### Phase 2 : Endpoints API (Priorité Haute)

4. Implémenter GET `/api/templates` (liste)
5. Implémenter POST `/api/templates/:format` (ajout)
6. Implémenter DELETE `/api/templates/:format/:name` (suppression)

### Phase 3 : Tests et Documentation (Priorité Moyenne)

7. Tester tous les endpoints manuellement
8. Tester les cas d'erreur
9. Mettre à jour le README avec la nouvelle fonctionnalité

### Phase 4 : Intégration (Priorité Basse - Optionnelle)

10. Modifier `converter.ts` pour supporter l'utilisation des templates lors des conversions
11. Ajouter des tests d'intégration

## Hypothèses et Décisions Techniques

### Hypothèses

1. **Formats Pandoc** : Les formats supportés sont ceux déjà définis dans `constants.ts`
2. **Persistence** : Les templates doivent persister entre les redémarrages (pas de nettoyage automatique)
3. **Validation** : Pas de validation approfondie du contenu des templates (Pandoc gérera les erreurs)
4. **Sécurité** : Pas d'authentification requise pour cette version (comme pour les autres endpoints)

### Décisions Techniques

1. **Stockage fichier vs Base de données** : Utilisation du système de fichiers pour la simplicité et la cohérence avec l'architecture existante
2. **Organisation des templates** : Par format de sortie pour faciliter la recherche et l'utilisation
3. **Nommage** : Permettre des noms personnalisés avec fallback sur le nom du fichier uploadé
4. **Validation** : Validation minimale côté API, délégation à Pandoc pour la validation sémantique

## Considérations de Sécurité

1. **Sanitization des noms** : S'assurer que les noms de templates ne contiennent pas de caractères dangereux (path traversal)
2. **Taille des fichiers** : Considérer une limite de taille pour les uploads (multer permet de configurer cela)
3. **Types de fichiers** : Accepter tous les types de fichiers (les templates peuvent être HTML, LaTeX, XML, etc.)

## Améliorations Futures (Hors Scope Initial)

- **Versioning des templates** : Garder l'historique des modifications
- **Prévisualisation** : Endpoint pour prévisualiser un template avec un document exemple
- **Templates par défaut** : Inclure des templates prédéfinis dans l'image Docker
- **Métadonnées** : Stocker des métadonnées supplémentaires (description, auteur, tags)
- **Export/Import** : Permettre l'export/import de collections de templates
- **Validation avancée** : Vérifier la syntaxe des templates avant de les sauvegarder

## Ressources Techniques

- **Documentation Pandoc Templates** : https://pandoc.org/MANUAL.html#templates
- **Multer (Upload)** : Déjà utilisé dans le projet pour les conversions
- **Express Routes** : Pattern déjà établi dans `app.ts`
- **Node.js fs** : Pour la gestion des fichiers (lecture, écriture, suppression)

## Estimation de Complexité

- **Module templates.ts** : ~200 lignes
- **Routes API dans app.ts** : ~60 lignes
- **Modifications constants.ts** : ~10 lignes
- **Tests manuels** : ~2 heures
- **Documentation** : ~1 heure

**Total estimé** : 4-6 heures de développement