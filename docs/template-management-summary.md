# Résumé Exécutif - Gestion des Templates Pandoc

## Objectif

Ajouter à l'API Pandoc la capacité de gérer des templates personnalisés pour les conversions de documents. Cette fonctionnalité permettra aux utilisateurs de :
- Lister les templates disponibles
- Ajouter de nouveaux templates via upload
- Supprimer des templates existants

## Nouveaux Endpoints API

### 1. GET `/api/templates`
Liste tous les templates disponibles, avec filtrage optionnel par format.

**Exemple** :
```bash
curl http://localhost:4000/api/templates?format=html
```

### 2. POST `/api/templates/:format`
Ajoute un nouveau template pour un format spécifique.

**Exemple** :
```bash
curl -F file=@my-template.html http://localhost:4000/api/templates/html?name=custom
```

### 3. DELETE `/api/templates/:format/:name`
Supprime un template existant.

**Exemple** :
```bash
curl -X DELETE http://localhost:4000/api/templates/html/custom
```

## Architecture Technique

### Nouveau Module : `src/templates.ts`

Module dédié contenant toute la logique métier pour :
- Gestion du stockage des templates sur le système de fichiers
- Validation des formats et fichiers
- CRUD des templates (Create, Read, Delete)

**Stockage** : `${os.tmpdir()}/pandoc-api/templates/<format>/<template-name>.template`

### Modifications des Modules Existants

1. **`src/constants.ts`** : Ajout de la constante `templatesDir`
2. **`src/app.ts`** : Ajout des 3 nouvelles routes API

## Plan d'Implémentation

### Phase 1 : Fondations (2-3h)
- Création du module `templates.ts` avec toutes les fonctions
- Mise à jour de `constants.ts`
- Initialisation du dossier templates

### Phase 2 : Endpoints API (1-2h)
- Implémentation des 3 routes dans `app.ts`
- Gestion des erreurs spécifiques

### Phase 3 : Tests et Documentation (2h)
- Tests manuels de tous les scénarios
- Mise à jour du README avec la documentation

### Phase 4 : Intégration (Optionnelle, 1-2h)
- Modification du converter pour utiliser les templates dans les conversions
- Tests d'intégration

**Durée totale estimée** : 4-6 heures (hors phase optionnelle)

## Bénéfices

- **Flexibilité** : Les utilisateurs peuvent personnaliser la sortie des conversions
- **Persistence** : Les templates sont sauvegardés et disponibles après redémarrage
- **Simplicité** : API RESTful cohérente avec l'existant
- **Scalabilité** : Structure extensible pour des fonctionnalités futures

## Prochaines Étapes

1. Consulter le document détaillé : `template-management-techspec.md`
2. Suivre la checklist d'implémentation : `template-management-checklist.md`
3. Commencer par la Phase 1 (Fondations)

## Ressources

- [Spécifications Techniques Complètes](./template-management-techspec.md)
- [Checklist d'Implémentation](./template-management-checklist.md)
- [Documentation Pandoc Templates](https://pandoc.org/MANUAL.html#templates)

## Remarques Importantes

- Les templates sont stockés dans le système de fichiers (pas de base de données)
- Pas de validation approfondie du contenu des templates (délégué à Pandoc)
- Pas d'authentification requise (cohérent avec l'API existante)
- Organisation par format de sortie pour faciliter la gestion