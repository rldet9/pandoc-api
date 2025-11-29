# Checklist d'Implémentation - Gestion des Templates

## Phase 1 : Fondations

- [ ] **Étape 1.1** : Ajouter la constante `templatesDir` dans `src/constants.ts`
  - Valeur : `${os.tmpdir()}/pandoc-api/templates`
  
- [ ] **Étape 1.2** : Créer le fichier `src/templates.ts`
  - Définir l'interface `TemplateInfo` (name, format, size, createdAt, path)
  - Implémenter la fonction d'initialisation `initTemplatesDirectory()`
  
- [ ] **Étape 1.3** : Implémenter `listTemplates(format?: string): Promise<TemplateInfo[]>`
  - Lire le contenu du dossier templates
  - Filtrer par format si spécifié
  - Retourner les informations de chaque template (incluant le path)
  
- [ ] **Étape 1.4** : Implémenter `validateFormat(format: string): boolean`
  - Vérifier que le format existe dans les extensions supportées
  
- [ ] **Étape 1.5** : Implémenter `addTemplate(file, format, name?): Promise<TemplateInfo>`
  - Valider le format
  - Générer un nom si non fourni
  - Créer le sous-dossier format si nécessaire
  - Sauvegarder le fichier
  - Retourner les informations du template
  
- [ ] **Étape 1.6** : Implémenter `deleteTemplate(format, name): Promise<void>`
  - Vérifier l'existence du template
  - Supprimer le fichier
  - Lancer ApiError 404 si non trouvé
  
- [ ] **Étape 1.7** : Implémenter `getTemplatePath(format, name): string`
  - Construire et retourner le chemin complet

## Phase 2 : Endpoints API

- [ ] **Étape 2.1** : Modifier `src/app.ts` - Import et initialisation
  - Importer le module `templates`
  - Appeler `initTemplatesDirectory()` au démarrage
  
- [ ] **Étape 2.2** : Implémenter GET `/api/templates`
  - Récupérer le paramètre de query `format` (optionnel)
  - Appeler `listTemplates(format)`
  - Retourner la liste en JSON avec status 200
  
- [ ] **Étape 2.3** : Implémenter POST `/api/templates/:format`
  - Valider la présence du fichier uploadé
  - Récupérer le paramètre de query `name` (optionnel)
  - Appeler `addTemplate(file, format, name)`
  - Retourner les infos du template avec status 201
  - Gérer les erreurs 400 (format invalide, fichier manquant)
  
- [ ] **Étape 2.4** : Implémenter DELETE `/api/templates/:format/:name`
  - Appeler `deleteTemplate(format, name)`
  - Retourner un message de succès avec status 200
  - Gérer l'erreur 404 (template non trouvé)

## Phase 3 : Tests Manuels

- [ ] **Test 3.1** : Lancer le serveur et vérifier l'initialisation
  - Le dossier templates doit être créé automatiquement
  
- [ ] **Test 3.2** : GET `/api/templates` - Liste vide
  - Doit retourner un tableau vide avec status 200
  
- [ ] **Test 3.3** : POST `/api/templates/html` - Ajout d'un template
  - Créer un fichier template HTML de test
  - Uploader via multipart/form-data
  - Vérifier status 201 et réponse JSON correcte
  - Vérifier que le fichier existe sur le disque
  
- [ ] **Test 3.4** : GET `/api/templates` - Liste avec templates
  - Doit retourner le template ajouté
  
- [ ] **Test 3.5** : GET `/api/templates?format=html` - Filtrage
  - Ajouter des templates pour différents formats
  - Vérifier que le filtrage fonctionne
  
- [ ] **Test 3.6** : DELETE `/api/templates/html/<name>` - Suppression
  - Supprimer un template existant
  - Vérifier status 200 et message de succès
  - Vérifier que le fichier est supprimé du disque
  
- [ ] **Test 3.7** : Gestion des erreurs
  - POST sans fichier → 400
  - POST avec format invalide → 400
  - DELETE template inexistant → 404
  - POST avec nom existant → 409

## Phase 4 : Documentation

- [ ] **Étape 4.1** : Mettre à jour `README.md`
  - Ajouter une section "Template Management"
  - Documenter les 3 nouveaux endpoints
  - Ajouter des exemples cURL
  
- [ ] **Étape 4.2** : Vérifier que `GET /api/help` est toujours fonctionnel
  - S'assurer que les nouvelles routes n'interfèrent pas

## Phase 5 : Validation Finale

- [ ] **Validation 5.1** : Tester le redémarrage du serveur
  - Les templates doivent persister après redémarrage
  
- [ ] **Validation 5.2** : Tester avec des noms de fichiers complexes
  - Caractères spéciaux, espaces, etc.
  - S'assurer de la sanitization
  
- [ ] **Validation 5.3** : Tester avec différents formats
  - HTML, DOCX, PDF, LaTeX, etc.
  
- [ ] **Validation 5.4** : Vérifier les logs et messages d'erreur
  - Les erreurs doivent être claires et informatives

## Phase 6 : Intégration (Optionnelle)

- [ ] **Étape 6.1** : Modifier `src/converter.ts`
  - Ajouter une méthode `convertWithTemplate()`
  - Permettre l'utilisation de templates dans les conversions
  
- [ ] **Étape 6.2** : Modifier la route de conversion
  - Ajouter le support de l'option `/template/<name>`
  - Intégrer avec `getTemplatePath()`
  
- [ ] **Test 6.3** : Test d'intégration conversion + template
  - Convertir un document avec un template personnalisé
  - Vérifier que le template est correctement appliqué

## Notes

- Chaque étape doit être testée individuellement avant de passer à la suivante
- En cas d'erreur, se référer aux spécifications techniques détaillées
- Les étapes de la Phase 6 peuvent être reportées à une version ultérieure