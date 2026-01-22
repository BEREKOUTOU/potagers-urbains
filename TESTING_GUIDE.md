# Guide Complet des Tests - Green City Grow Hub

## 📋 Vue d'ensemble

Ce guide décrit la stratégie de tests complète pour l'application Green City Grow Hub, couvrant le backend, le frontend et les tests d'intégration.

## 🏗️ Structure des Tests

### Backend Tests
```
BackEnd/src/tests/
├── auth.test.ts              # Tests du middleware d'authentification
├── users.test.ts             # Tests des routes utilisateurs
├── gardens.test.ts           # Tests des routes jardins
├── events.test.ts            # Tests des routes événements
├── discussions.test.ts       # Tests des routes discussions
├── middleware.test.ts        # Tests du middleware auth & roles
└── setup.ts                  # Configuration des tests
```

### Frontend Tests
```
src/
├── __tests__/
│   └── integration.test.ts   # Tests d'intégration frontend-backend
├── components/__tests__/
│   ├── Header.test.tsx       # Tests du Header
│   ├── GardensGrid.test.tsx  # Tests de la grille de jardins
│   ├── ErrorBoundary.test.tsx # Tests de la gestion d'erreurs
│   └── ProtectedRoute.test.tsx # Tests des routes protégées
├── hooks/__tests__/
│   └── useFavorites.test.ts  # Tests du hook favoris
└── setupTests.ts             # Configuration Jest frontend
```

## 🚀 Commandes de Test

### Backend

```bash
# Exécuter tous les tests backend
cd BackEnd
npm run test

# Tests en mode watch
npm run test:watch

# Rapport de couverture
npm run test:coverage
```

### Frontend

```bash
# Exécuter tous les tests frontend
npm test -- --config=jest.config.frontend.cjs

# Tests en mode watch
npm test -- --watch --config=jest.config.frontend.cjs

# Rapport de couverture
npm test -- --coverage --config=jest.config.frontend.cjs
```

### Tous les tests (root)

```bash
# Exécuter backend + frontend
npm run test

# Avec couverture
npm run test:coverage
```

## 📊 Couverture des Tests Actuels

### Backend Coverage
- **Routes Utilisateurs** (users.test.ts)
  - ✅ GET /users (admin only)
  - ✅ GET /users/:id (self or admin)
  - ✅ PUT /users/:id (update profile)
  - ✅ DELETE /users/:id (admin only)

- **Routes Jardins** (gardens.test.ts)
  - ✅ GET /gardens (avec filtres: region, search, pagination)
  - ✅ GET /gardens/:id
  - ✅ POST /gardens (create)
  - ✅ PUT /gardens/:id (update)
  - ✅ DELETE /gardens/:id
  - ✅ POST /gardens/:id/join (join garden)

- **Routes Événements** (events.test.ts)
  - ✅ GET /events (avec filtres)
  - ✅ GET /events/:id
  - ✅ POST /events (create)
  - ✅ PUT /events/:id (update)
  - ✅ DELETE /events/:id
  - ✅ POST /events/:id/attend (RSVP)

- **Routes Discussions** (discussions.test.ts)
  - ✅ GET /discussions
  - ✅ GET /discussions/:id (with replies)
  - ✅ POST /discussions (create)
  - ✅ PUT /discussions/:id (update)
  - ✅ DELETE /discussions/:id
  - ✅ POST /discussions/:id/reply (add reply)

- **Middleware** (middleware.test.ts)
  - ✅ authenticateToken (validation JWT)
  - ✅ requireRole (authorization)

### Frontend Coverage
- **Components**
  - ✅ Header (navigation, logo)
  - ✅ GardensGrid (display gardens, pagination)
  - ✅ ErrorBoundary (error handling)
  - ✅ ProtectedRoute (authentication check)

- **Hooks**
  - ✅ useFavorites (add, remove, toggle, clear)

### Integration Tests
- ✅ Garden Discovery Flow (fetch & filter)
- ✅ User Authentication Flow (login, token validation)
- ✅ Garden Creation Flow (validation, submission)
- ✅ Event Management Flow (fetch, RSVP)
- ✅ Discussion Thread Flow (create, reply)
- ✅ User Profile Flow (fetch, update)
- ✅ Error Handling (network, 401, malformed JSON)

## 🔄 Flux de Test

### 1. Tests Unitaires (Unit Tests)
Testent des fonctions/composants individuels isolés

```typescript
// Example: Test une seule fonction
it('should return user when found', () => {
  (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
  const res = await request(app).get('/api/users/1');
  expect(res.body.user.username).toBe('testuser');
});
```

### 2. Tests d'Intégration (Integration Tests)
Testent l'interaction entre plusieurs composants/services

```typescript
// Example: Test le flux utilisateur complet
it('should complete garden discovery and join flow', async () => {
  // 1. Fetch gardens from API
  // 2. Filter by region
  // 3. Join a garden
  // 4. Verify membership
});
```

## ✅ Bonnes Pratiques

### Pour les Tests Backend

```typescript
// ✅ BON: Test spécifique avec assertions claires
describe('Users Routes', () => {
  it('should return 404 when user not found', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
    const res = await request(app).get('/api/users/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});

// ❌ MAUVAIS: Test vague et générique
describe('API Tests', () => {
  it('should work correctly', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res).toBeDefined();
  });
});
```

### Pour les Tests Frontend

```typescript
// ✅ BON: Utiliser les queries de testing-library
const { getByRole, getByText } = render(<Header />);
expect(getByRole('navigation')).toBeInTheDocument();

// ❌ MAUVAIS: Requêtes trop spécifiques
const element = document.querySelector('.header-class');
expect(element?.innerHTML).toContain('text');
```

## 📈 Métriques de Couverture Cibles

Les seuils de couverture sont définis à 70% minimum:

```json
{
  "branches": 70,
  "functions": 70,
  "lines": 70,
  "statements": 70
}
```

## 🐛 Debugging des Tests

### Backend

```bash
# Exécuter un test spécifique
npm test -- --testNamePattern="should return 404"

# Avec logging
DEBUG=* npm test

# Mode interactif
npm test -- --watch --detectOpenHandles
```

### Frontend

```bash
# Test spécifique
npm test -- --testNamePattern="Header" --config=jest.config.frontend.cjs

# Avec couverture détaillée
npm test -- --coverage --verbose --config=jest.config.frontend.cjs

# Voir le HTML de couverture
open coverage/index.html
```

## 🔐 Mocking Stratégies

### Pour la Base de Données
```typescript
jest.mock('../config/database');
(pool.query as jest.Mock).mockResolvedValue({ rows: [...] });
```

### Pour JWT
```typescript
jest.mock('jsonwebtoken');
(jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
  cb(null, { id: 1, username: 'user' });
});
```

### Pour les API Fetch
```typescript
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: [...] }),
});
```

## 📝 Checklist Pre-Commit

Avant de commiter du code:

- [ ] Tous les tests passent: `npm test`
- [ ] Couverture >= 70%: `npm run test:coverage`
- [ ] Pas de console errors
- [ ] Tests couvrent les cas happy path ET error cases
- [ ] Code est linté: `npm run lint`

## 🚧 Zones à Améliorer

Potential areas for enhanced testing:

### Backend
- [ ] Tests de performance (load testing)
- [ ] Tests de sécurité (injection SQL, XSS)
- [ ] Tests de concurrence (race conditions)
- [ ] Tests de validation d'entrée (edge cases)

### Frontend
- [ ] Tests de snapshot pour les composants
- [ ] Tests d'accessibilité (a11y)
- [ ] Tests de performance (rendering)
- [ ] Tests E2E (Cypress/Playwright)

### Intégration
- [ ] Tests avec vraie base de données
- [ ] Tests de migration de données
- [ ] Tests de déploiement

## 📚 Ressources

- Jest: https://jestjs.io/
- React Testing Library: https://testing-library.com/react
- Supertest: https://github.com/visionmedia/supertest
- TypeScript + Jest: https://kulshekhar.github.io/ts-jest/

## 🤝 Support

Pour des questions sur les tests, consultez:
1. Les fichiers de test existants comme exemples
2. La documentation Jest et Testing Library
3. Les logs de CI/CD dans `.github/workflows`
