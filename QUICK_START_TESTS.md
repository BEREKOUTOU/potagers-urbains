# 🚀 Guide de Démarrage Rapide des Tests

## Installation des Dépendances

### 1. Installer les dépendances de test (Backend)
```bash
cd BackEnd
npm install supertest @types/supertest --save-dev
npm install
cd ..
```

### 2. Installer les dépendances de test (Frontend)
```bash
npm install @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom ts-jest identity-obj-proxy --save-dev
npm install
```

## Premier Lancement des Tests

### Option 1: Exécuter tous les tests
```bash
# Tous les tests (backend + frontend)
npm run test:all
```

### Option 2: Exécuter séparément

```bash
# Tests backend uniquement
cd BackEnd
npm test
cd ..

# Tests frontend uniquement
npm test -- --config=jest.config.frontend.cjs
```

### Option 3: Tests avec script bash

```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

## Vérifier la Couverture

### Backend Coverage
```bash
cd BackEnd
npm run test:coverage
# Voir: BackEnd/coverage/lcov-report/index.html
```

### Frontend Coverage
```bash
npm test -- --coverage --config=jest.config.frontend.cjs
# Voir: coverage/lcov-report/index.html
```

## Mode Watch (Développement)

### Backend
```bash
cd BackEnd
npm run test:watch
```

### Frontend
```bash
npm test -- --watch --config=jest.config.frontend.cjs
```

## Tests Spécifiques

### Exécuter un seul fichier de test
```bash
# Backend
cd BackEnd
npm test -- users.test.ts

# Frontend
npm test -- Header.test.tsx --config=jest.config.frontend.cjs
```

### Exécuter un test spécifique par nom
```bash
# Backend
cd BackEnd
npm test -- --testNamePattern="should return 404 when user not found"

# Frontend  
npm test -- --testNamePattern="should render header" --config=jest.config.frontend.cjs
```

## Déboguer les Tests

### Avec logging
```bash
# Backend
cd BackEnd
DEBUG=* npm test

# Frontend
DEBUG=* npm test -- --config=jest.config.frontend.cjs
```

### Mode interactif
```bash
# Backend avec options interactives
cd BackEnd
npm test -- --watch

# Frontend
npm test -- --watch --config=jest.config.frontend.cjs
```

## Rapport HTML de Couverture

Après avoir lancé les tests avec `--coverage`:

```bash
# Ouvrir le rapport (macOS)
open BackEnd/coverage/lcov-report/index.html
open coverage/lcov-report/index.html

# Ouvrir le rapport (Linux)
xdg-open BackEnd/coverage/lcov-report/index.html
xdg-open coverage/lcov-report/index.html

# Ouvrir le rapport (Windows)
start BackEnd\coverage\lcov-report\index.html
start coverage\lcov-report\index.html
```

## Vérifier les Métriques de Couverture

### Afficher le résumé de couverture
```bash
# Backend
cd BackEnd && npm run test:coverage 2>&1 | tail -20

# Frontend
npm test -- --coverage --config=jest.config.frontend.cjs 2>&1 | tail -20
```

Vérifiez que les métriques affichent **> 70%** pour:
- Statements
- Branches
- Functions
- Lines

## Commandes Utiles dans package.json

```bash
# Backend (dans BackEnd/)
npm test              # Exécuter les tests
npm run test:watch   # Mode watch
npm run test:coverage # Avec rapport de couverture

# Frontend & Root (dans le répertoire racine)
npm test                          # Tests frontend
npm run test:backend              # Tests backend
npm run test:frontend             # Tests frontend
npm run test:coverage             # Coverage frontend
npm run test:all                  # Backend + Frontend
```

## Résolution de Problèmes

### Les tests échouent avec "Module not found"

```bash
# Réinstaller les dépendances
rm -rf node_modules BackEnd/node_modules
npm install
cd BackEnd && npm install && cd ..
```

### Jest ne trouve pas les fichiers

```bash
# Vérifier les chemins dans jest.config
# S'assurer que rootDir et testMatch sont corrects
```

### Tests lents

```bash
# Ajouter --runInBand pour exécuter séquentiellement
npm test -- --runInBand

# Ou augmenter le timeout
npm test -- --testTimeout=20000
```

### Erreurs TypeScript

```bash
# Vérifier la configuration tsconfig
# S'assurer que ts-jest est installé
npm install ts-jest --save-dev
```

## CI/CD Pipeline

Pour l'intégration continue, ajoutez à `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Run all tests
        run: npm run test:all
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Prochaines Étapes

1. ✅ Installer les dépendances
2. ✅ Lancer les tests
3. ✅ Vérifier la couverture
4. ✅ Consulter [TESTING_GUIDE.md](TESTING_GUIDE.md) pour plus de détails
5. ✅ Consulter [TESTS_SUMMARY.md](TESTS_SUMMARY.md) pour le résumé complet

## Support

Pour des questions:
1. Consultez [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Regardez les fichiers de test existants comme exemples
3. Consultez la documentation Jest: https://jestjs.io/
4. Consultez la documentation React Testing Library: https://testing-library.com/react
