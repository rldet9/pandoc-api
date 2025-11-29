# Décisions Architecturales - Gestion des Templates

## Document de Décisions d'Architecture (ADR)

Ce document enregistre les décisions architecturales importantes prises lors de la conception de la fonctionnalité de gestion des templates.

---

## ADR-001 : Stockage sur Système de Fichiers

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Nous devons choisir une méthode de stockage pour les templates Pandoc. Les options considérées sont :
1. Système de fichiers
2. Base de données (SQL)
3. Base de données (NoSQL)
4. Service de stockage cloud (S3, etc.)

### Décision

Nous utiliserons le **système de fichiers local** pour stocker les templates.

### Justification

**Arguments pour le système de fichiers** :
- ✅ Cohérence avec l'architecture existante (tmpDir déjà utilisé)
- ✅ Simplicité d'implémentation et de maintenance
- ✅ Pas de dépendance externe supplémentaire
- ✅ Performance excellente pour lecture/écriture
- ✅ Pandoc travaille nativement avec des fichiers
- ✅ Facilité de backup et migration

**Arguments contre les alternatives** :
- ❌ Base de données : Complexité excessive pour du stockage binaire simple
- ❌ Cloud : Dépendance externe, latence, coûts
- ❌ Surcharge pour un nombre modéré de templates

### Conséquences

**Positives** :
- Implémentation rapide
- Aucune nouvelle dépendance
- Performance optimale
- Facilité de debug

**Négatives** :
- Scaling horizontal plus complexe (nécessiterait un volume partagé)
- Pas de transactions ACID natives
- Backup manuel nécessaire

**Mitigation** :
- Pour un scaling futur, utiliser un volume partagé (NFS, EFS)
- Documentation des procédures de backup

---

## ADR-002 : Organisation par Format de Sortie

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Nous devons organiser les templates dans le système de fichiers. Options :
1. Tous les templates dans un seul dossier
2. Organisation par format de sortie (html/, docx/, etc.)
3. Organisation par projet/utilisateur

### Décision

Organisation **par format de sortie** : `templates/<format>/<name>.template`

### Justification

**Arguments pour** :
- ✅ Facilite la découverte et le filtrage
- ✅ Cohérent avec l'utilisation de Pandoc (format de sortie détermine le template)
- ✅ Évite les conflits de noms entre formats différents
- ✅ Structure intuitive pour les utilisateurs

**Arguments contre les alternatives** :
- ❌ Dossier unique : Difficile à naviguer avec beaucoup de templates
- ❌ Par projet : Trop complexe pour la v1, peut être ajouté plus tard

### Conséquences

**Positives** :
- Recherche efficace par format
- Nommage simplifié
- Extensibilité future

**Négatives** :
- Nécessite validation du format à chaque opération

---

## ADR-003 : API RESTful Pure

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Nous devons concevoir l'interface API. Options :
1. API RESTful standard
2. GraphQL
3. RPC-style endpoints

### Décision

API **RESTful** avec les verbes HTTP standards (GET, POST, DELETE).

### Justification

**Arguments pour** :
- ✅ Cohérence avec l'API existante
- ✅ Simplicité et universalité
- ✅ Facile à documenter et à consommer
- ✅ Pas de dépendance supplémentaire
- ✅ Standard de l'industrie

**Arguments contre les alternatives** :
- ❌ GraphQL : Overkill pour des opérations CRUD simples
- ❌ RPC : Moins intuitif, non-standard

### Conséquences

**Positives** :
- Facilité d'intégration
- Documentation simple
- Large compatibilité

**Négatives** :
- Moins flexible que GraphQL pour requêtes complexes (non nécessaire ici)

---

## ADR-004 : Pas de Validation Approfondie des Templates

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Faut-il valider le contenu des templates avant de les sauvegarder ?

Options :
1. Pas de validation (délégation à Pandoc)
2. Validation syntaxique basique
3. Validation complète avec parsing

### Décision

**Pas de validation** côté API - délégation à Pandoc lors de l'utilisation.

### Justification

**Arguments pour** :
- ✅ Simplicité d'implémentation
- ✅ Pandoc est le meilleur validateur de ses propres templates
- ✅ Évite de dupliquer la logique de validation
- ✅ Flexibilité pour templates expérimentaux

**Arguments contre** :
- ❌ Erreurs détectées tard (à l'utilisation)
- ❌ Stockage possible de templates invalides

### Conséquences

**Positives** :
- Implémentation rapide
- Pas de maintenance de validateurs
- Support de toutes les fonctionnalités Pandoc

**Négatives** :
- Feedback d'erreur différé

**Mitigation** :
- Documentation claire sur les formats attendus
- Messages d'erreur explicites lors de l'utilisation
- Possibilité d'ajouter validation optionnelle en v2

---

## ADR-005 : Nommage Flexible des Templates

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Comment gérer le nommage des templates ?

Options :
1. Nom automatique (UUID)
2. Nom obligatoire fourni par l'utilisateur
3. Nom optionnel avec fallback sur nom de fichier

### Décision

**Nom optionnel** avec fallback sur le nom du fichier uploadé (sanitisé).

### Justification

**Arguments pour** :
- ✅ Flexibilité maximale pour l'utilisateur
- ✅ Noms significatifs plutôt que UUIDs
- ✅ Expérience utilisateur optimale
- ✅ Fallback raisonnable si non fourni

**Arguments contre les alternatives** :
- ❌ UUID : Difficile à mémoriser et référencer
- ❌ Nom obligatoire : Friction inutile

### Conséquences

**Positives** :
- Facilité d'utilisation
- Noms mémorables
- Flexibilité

**Négatives** :
- Nécessite sanitization robuste
- Risque de conflits de noms

**Mitigation** :
- Sanitization stricte des noms
- Erreur 409 si conflit
- Documentation des conventions de nommage

---

## ADR-006 : Pas d'Authentification en V1

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté avec réserves  
**Décideurs** : Architecte logiciel  

### Contexte

L'API devrait-elle inclure un mécanisme d'authentification ?

### Décision

**Pas d'authentification** dans la version initiale, cohérent avec l'API existante.

### Justification

**Arguments pour** :
- ✅ Cohérence avec l'API de conversion existante
- ✅ Simplicité d'implémentation
- ✅ Adapté pour usage en réseau privé/interne

**Arguments contre** :
- ❌ Risque de sécurité en production publique
- ❌ Pas de contrôle d'accès

### Conséquences

**Positives** :
- Implémentation rapide
- API simple à utiliser
- Cohérence du projet

**Négatives** :
- ⚠️ Non adapté pour exposition publique

**Mitigation** :
- ⚠️ Documentation explicite des risques
- ⚠️ Recommandation d'utiliser derrière un reverse proxy avec auth
- ⚠️ Planification d'authentification pour v2

---

## ADR-007 : Module Séparé pour la Logique Templates

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Où placer la logique de gestion des templates ?

Options :
1. Dans app.ts directement
2. Dans converter.ts
3. Nouveau module templates.ts

### Décision

Créer un **nouveau module dédié** `src/templates.ts`.

### Justification

**Arguments pour** :
- ✅ Séparation des responsabilités (SRP)
- ✅ Réutilisabilité du code
- ✅ Facilité de test
- ✅ Maintenabilité
- ✅ Extensibilité future

**Arguments contre les alternatives** :
- ❌ Dans app.ts : Trop de responsabilités, fichier trop gros
- ❌ Dans converter.ts : Mélange de responsabilités différentes

### Conséquences

**Positives** :
- Code organisé
- Tests unitaires facilités
- Évolution indépendante

**Négatives** :
- Un fichier supplémentaire

---

## ADR-008 : Multipart Form-Data pour Upload

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Quel mécanisme d'upload utiliser ?

Options :
1. Multipart form-data (Multer)
2. Base64 en JSON
3. Upload binaire brut

### Décision

**Multipart form-data** avec Multer (déjà utilisé dans le projet).

### Justification

**Arguments pour** :
- ✅ Déjà implémenté et utilisé
- ✅ Standard de l'industrie
- ✅ Support natif dans tous les clients HTTP
- ✅ Efficace pour fichiers binaires
- ✅ Facilité d'utilisation

**Arguments contre les alternatives** :
- ❌ Base64 : Overhead de ~33%, complexité
- ❌ Binaire brut : Moins flexible, support client limité

### Conséquences

**Positives** :
- Réutilisation du code existant
- Facilité d'utilisation
- Performance optimale

**Négatives** :
- Aucune

---

## ADR-009 : Intégration avec Converter en Phase Optionnelle

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Quand implémenter l'utilisation des templates dans les conversions ?

Options :
1. Dès la v1 (phase obligatoire)
2. Phase optionnelle / v2

### Décision

Implémenter la gestion CRUD en v1, **intégration avec conversions en phase optionnelle**.

### Justification

**Arguments pour** :
- ✅ Séparation des préoccupations
- ✅ Livraison incrémentale
- ✅ Réduction du risque
- ✅ Valeur utilisable même sans intégration immédiate

**Arguments contre** :
- ❌ Nécessite une seconde phase de développement

### Conséquences

**Positives** :
- Mise en production plus rapide
- Tests plus focalisés
- Réduction de la complexité initiale

**Négatives** :
- Fonctionnalité complète en deux temps

**Mitigation** :
- Documentation claire du roadmap
- Conception permettant l'intégration facile plus tard

---

## ADR-010 : TypeScript avec Interfaces Strictes

**Date** : 28 novembre 2025  
**Statut** : ✅ Accepté  
**Décideurs** : Architecte logiciel  

### Contexte

Niveau de typage à utiliser pour le nouveau module ?

### Décision

TypeScript avec **interfaces strictes** pour toutes les structures de données.

### Justification

**Arguments pour** :
- ✅ Cohérence avec le projet existant
- ✅ Détection d'erreurs à la compilation
- ✅ Auto-complétion et IntelliSense
- ✅ Documentation implicite du code

### Conséquences

**Positives** :
- Code robuste
- Maintenabilité
- Expérience développeur améliorée

**Négatives** :
- Légèrement plus verbeux

---

## Résumé des Décisions

| ADR | Décision | Impact | Priorité |
|-----|----------|--------|----------|
| 001 | Système de fichiers | Simplicité, performance | Haute |
| 002 | Organisation par format | Structure claire | Haute |
| 003 | API RESTful | Cohérence, simplicité | Haute |
| 004 | Pas de validation templates | Simplicité, flexibilité | Moyenne |
| 005 | Nommage flexible | UX optimale | Moyenne |
| 006 | Pas d'authentification v1 | Rapidité, cohérence | Haute ⚠️ |
| 007 | Module séparé | Maintenabilité | Haute |
| 008 | Multipart form-data | Réutilisation, standard | Haute |
| 009 | Intégration optionnelle | Livraison incrémentale | Haute |
| 010 | TypeScript strict | Robustesse | Haute |

## Révisions Futures

Ce document sera mis à jour si des décisions architecturales sont modifiées ou si de nouvelles décisions importantes sont prises lors de l'implémentation.

---

**Dernière révision** : 28 novembre 2025  
**Version** : 1.0.0  
**Prochain review** : Après implémentation Phase 1