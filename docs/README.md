# Documentation - Gestion des Templates Pandoc

Bienvenue dans la documentation du système de gestion des templates pour l'API Pandoc.

## 📚 Aperçu du Projet

Cette fonctionnalité permet de gérer des templates Pandoc personnalisés via une API RESTful. Les utilisateurs peuvent ajouter, lister et supprimer des templates pour personnaliser la sortie des conversions de documents.

## 🗂️ Structure de la Documentation

### Documents Principaux

1. **[📋 Résumé Exécutif](./template-management-summary.md)**
   - Vue d'ensemble rapide du projet
   - Objectifs et bénéfices
   - Prochaines étapes
   - **À lire en premier** pour comprendre le contexte

2. **[📐 Spécifications Techniques](./template-management-techspec.md)**
   - Architecture détaillée du système
   - Implémentation des modules
   - Endpoints API complets
   - Gestion des erreurs et sécurité
   - **Document de référence** pour l'implémentation

3. **[✅ Checklist d'Implémentation](./template-management-checklist.md)**
   - Plan étape par étape
   - Suivi de la progression
   - Tests à effectuer
   - **Guide pratique** pour le développement

4. **[🏗️ Architecture](./template-management-architecture.md)**
   - Diagrammes du système
   - Flux de données
   - Structure des modules
   - Dépendances
   - **Compréhension visuelle** du système

5. **[💡 Exemples d'Utilisation](./template-management-examples.md)**
   - Exemples cURL
   - Code JavaScript/Node.js
   - Code Python
   - Templates Pandoc exemples
   - Scénarios complets
   - **Guide pratique** pour les utilisateurs

## 🚀 Démarrage Rapide

### Pour les Développeurs

1. Lire le [Résumé Exécutif](./template-management-summary.md)
2. Consulter l'[Architecture](./template-management-architecture.md)
3. Suivre la [Checklist d'Implémentation](./template-management-checklist.md)
4. Se référer aux [Spécifications Techniques](./template-management-techspec.md) pour les détails

### Pour les Utilisateurs de l'API

1. Lire le [Résumé Exécutif](./template-management-summary.md)
2. Consulter les [Exemples d'Utilisation](./template-management-examples.md)
3. Référence API dans les [Spécifications Techniques](./template-management-techspec.md)

## 📋 Nouveaux Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/templates` | Liste tous les templates |
| GET | `/api/templates?format=html` | Liste les templates d'un format |
| POST | `/api/templates/:format` | Ajoute un nouveau template |
| DELETE | `/api/templates/:format/:name` | Supprime un template |

## 🎯 Objectifs de la Fonctionnalité

- ✅ Permettre la personnalisation des conversions via templates
- ✅ Fournir une API RESTful simple et cohérente
- ✅ Assurer la persistence des templates
- ✅ Supporter tous les formats Pandoc (HTML, DOCX, PDF, LaTeX, etc.)
- ✅ Maintenir la compatibilité avec l'API existante

## 📊 Estimation du Projet

| Phase | Durée Estimée | Priorité |
|-------|---------------|----------|
| Phase 1 : Fondations | 2-3h | Haute |
| Phase 2 : Endpoints API | 1-2h | Haute |
| Phase 3 : Tests & Documentation | 2h | Moyenne |
| Phase 4 : Intégration (optionnelle) | 1-2h | Basse |
| **Total** | **4-6h** | - |

## 🏗️ Architecture Simplifiée

```
Client HTTP
    ↓
Express App (app.ts)
    ↓
Templates Module (templates.ts)
    ↓
File System Storage
    └── templates/
        ├── html/
        ├── docx/
        ├── pdf/
        └── latex/
```

## 🔧 Technologies Utilisées

- **Express.js** - Framework web
- **Multer** - Gestion des uploads
- **Node.js fs** - Opérations fichiers
- **TypeScript** - Typage statique
- **Pandoc** - Moteur de conversion

## 📝 Conventions de Nommage

### Templates
- Format : `<descriptif>-<type>.template`
- Exemples : `custom-report.template`, `corporate-invoice.template`
- Éviter les caractères spéciaux

### Endpoints API
- Pattern RESTful standard
- Utilisation de paramètres de path et query
- Réponses JSON structurées

## ⚠️ Points d'Attention

### Sécurité
- Sanitization des noms de fichiers requise
- Limitation de taille d'upload recommandée
- Pas d'authentification dans cette version

### Performance
- Stockage sur système de fichiers
- Pas de cache nécessaire pour v1
- Scalable pour usage modéré

### Compatibilité
- Compatible avec l'API existante
- Pas de breaking changes
- Extension naturelle des fonctionnalités

## 🔮 Évolutions Futures (Hors Scope)

- Intégration directe avec les conversions
- Versioning des templates
- Prévisualisation des templates
- Templates par défaut inclus
- Métadonnées enrichies (tags, description)
- Export/Import de collections
- Validation avancée des templates

## 📞 Ressources Additionnelles

### Documentation Externe
- [Pandoc Manual - Templates](https://pandoc.org/MANUAL.html#templates)
- [Express.js Documentation](https://expressjs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)

### Fichiers du Projet
- Code source : `src/`
- Configuration : `package.json`, `tsconfig.json`
- README principal : `../README.md`

## 🤝 Contribution

Lors de l'implémentation, suivre :
1. Les [Instructions Génériques](../.github/instructions/generic.instructions.md)
2. La [Checklist d'Implémentation](./template-management-checklist.md)
3. Les [Spécifications Techniques](./template-management-techspec.md)

## 📄 Licence

Ce projet est sous licence MIT (voir LICENSE dans le répertoire parent).

---

**Dernière mise à jour** : 28 novembre 2025  
**Version** : 1.0.0  
**Statut** : Planification complète - Prêt pour implémentation