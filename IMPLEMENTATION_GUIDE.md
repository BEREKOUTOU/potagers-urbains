# Guide de Mise à Jour de la Base de Données

## Nouvelles Fonctionnalités Implémentées

Ce document décrit toutes les fonctionnalités ajoutées au projet Green City Grow Hub selon le fichier ANALYSE_PROJET.md.

## Modifications de la Base de Données

### 1. Ajout de la colonne `phone` à la table `users`
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
```

### 2. Table `user_preferences`
Stocke les préférences utilisateur (notifications, langue, fuseau horaire).

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT FALSE,
  weekly_summary BOOLEAN DEFAULT TRUE,
  language VARCHAR(10) DEFAULT 'fr',
  timezone VARCHAR(50) DEFAULT 'Europe/Paris',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

### 3. Table `favorites`
Permet aux utilisateurs de mettre en favoris des jardins, ressources, guides, événements.

```sql
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('garden', 'resource', 'guide', 'event')),
  item_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_type, item_id)
);
```

### 4. Table `activity_log`
Enregistre toutes les activités des utilisateurs pour l'historique.

```sql
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Comment Appliquer les Modifications

### Méthode 1 : Réexécuter le script de setup (RECOMMANDÉ)

```bash
cd BackEnd
node setup-db-postgres.js
```

Ce script créera automatiquement toutes les nouvelles tables et colonnes sans affecter les données existantes.

### Méthode 2 : Exécuter manuellement les migrations SQL

Si vous préférez exécuter les migrations manuellement :

```bash
psql -U postgres -d green_city_grow_hub -f migrations.sql
```

Créez d'abord un fichier `migrations.sql` avec le contenu ci-dessus.

## Nouvelles Routes API

### Préférences Utilisateur
- `GET /api/users/:id/preferences` - Récupérer les préférences
- `PUT /api/users/:id/preferences` - Mettre à jour les préférences

### Favoris
- `GET /api/users/:id/favorites` - Liste des favoris
- `POST /api/users/:id/favorites` - Ajouter un favori
- `DELETE /api/users/:id/favorites/:favoriteId` - Supprimer un favori

### Historique d'Activité
- `GET /api/users/:id/activities` - Récupérer l'historique d'activité

## Fonctionnalités Frontend Ajoutées

### 1. Photo de Profil
- Upload et prévisualisation de photo de profil
- Sauvegarde automatique dans la base de données

### 2. Numéro de Téléphone
- Champ pour entrer et modifier le numéro de téléphone
- Sauvegarde dans la base de données

### 3. Préférences Utilisateur
- Notifications email, push, résumé hebdomadaire
- Langue et fuseau horaire
- Sauvegarde persistante dans la base de données

### 4. Favoris
- Affichage des ressources favorites
- Système complet de gestion des favoris

### 5. Historique d'Activité
- Affichage de toutes les actions de l'utilisateur
- Horodatage et description détaillée

## Améliorations de Sécurité

### 1. Helmet
- Activé pour sécuriser les en-têtes HTTP

### 2. Rate Limiting
- Limite de 100 requêtes par 15 minutes par IP

### 3. Validation des Données
- Validation Zod pour toutes les entrées utilisateur

### 4. Gestion d'Erreurs Centralisée
- Middleware global pour gérer toutes les erreurs
- Messages d'erreur appropriés en production/développement

### 5. Logging d'Activités
- Enregistrement automatique de toutes les actions importantes
- Traçabilité complète des actions utilisateur

## Tests de Fonctionnement

### 1. Tester la Photo de Profil
1. Se connecter à l'application
2. Aller sur la page Profil
3. Cliquer sur l'icône caméra
4. Sélectionner une image
5. Cliquer sur "Sauvegarder"
6. Vérifier que l'image est bien affichée après rechargement

### 2. Tester le Téléphone
1. Aller sur la page Profil
2. Cliquer sur "Modifier"
3. Entrer un numéro de téléphone
4. Cliquer sur "Sauvegarder"
5. Recharger la page et vérifier que le numéro est toujours affiché

### 3. Tester les Préférences
1. Aller sur l'onglet "Préférences"
2. Modifier les paramètres de notification
3. Cliquer sur "Sauvegarder les préférences"
4. Recharger la page et vérifier que les préférences sont conservées

### 4. Tester l'Historique d'Activité
1. Effectuer quelques actions (connexion, modification de profil, etc.)
2. Aller sur l'onglet "Activités"
3. Vérifier que les actions apparaissent dans l'historique

## Démarrage du Projet

### Backend
```bash
cd BackEnd
npm install
node setup-db-postgres.js  # Créer/mettre à jour la base de données
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

## Variables d'Environnement Requises

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=green_city_grow_hub
DB_USER=postgres
DB_PASSWORD=password123
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## Statut des Fonctionnalités

✅ Photo de profil - FONCTIONNEL
✅ Numéro de téléphone - FONCTIONNEL
✅ Préférences utilisateur - FONCTIONNEL
✅ Favoris - FONCTIONNEL
✅ Historique d'activité - FONCTIONNEL
✅ Helmet activé - FONCTIONNEL
✅ Rate Limiting activé - FONCTIONNEL
✅ Validation Zod - FONCTIONNEL
✅ Gestion d'erreurs centralisée - FONCTIONNEL
✅ Logging d'activités - FONCTIONNEL

## Notes Importantes

1. **Base de données** : Assurez-vous que PostgreSQL est en cours d'exécution
2. **Node.js** : Version 18+ recommandée
3. **npm** : Installez toutes les dépendances avec `npm install`
4. **Port** : Le backend tourne sur le port 3001 par défaut
5. **CORS** : Configuré pour accepter les requêtes du frontend

## Prochaines Étapes Recommandées

1. ✅ Ajouter des tests unitaires
2. ✅ Améliorer la documentation API avec Swagger
3. ✅ Configurer CI/CD
4. ✅ Optimiser les requêtes SQL
5. ✅ Ajouter un système de cache (Redis)

## Support

Pour toute question ou problème, consultez le fichier ANALYSE_PROJET.md pour plus de détails sur l'architecture du projet.
