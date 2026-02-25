# 🚀 Quick Start - Composants d'Authentification

## En 5 Minutes

### 1. Afficher la Page d'Authentification

Remplacez le contenu de `src/App.tsx` :

```tsx
import { AuthRouter } from './ui/pages'
import { UseCasesProvider } from './app/providers/UseCasesProvider'
import type { SessionToken } from './modules/authentication'

function App() {
  const handleAuthSuccess = (session: SessionToken) => {
    console.log('Utilisateur connecté:', session)
    // TODO: Rediriger vers dashboard
  }

  return (
    <UseCasesProvider>
      <AuthRouter onAuthenticationSuccess={handleAuthSuccess} />
    </UseCasesProvider>
  )
}

export default App
```

### 2. Lancer l'Application

```bash
cd kalculo-web
npm run dev
```

Allez sur `http://localhost:5173`

### 3. Tester

**Inscription:**
- Email: `parent@example.com`
- Password: `password123`
- Confirm: `password123`

**Connexion:**
- Email: `parent@example.com` (créé lors de l'inscription)
- Password: `password123`

---

## Composants Disponibles

### Design System

```tsx
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Alert,
} from './ui/design-system'

// Button
<Button variant="primary" size="md">Envoyer</Button>

// Input
<Input type="email" label="Email" error="Email invalide" />

// Card
<Card>
  <CardHeader><h2>Titre</h2></CardHeader>
  <CardBody>Contenu</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>

// Alert
<Alert type="success">Opération réussie !</Alert>
```

### Pages

```tsx
import { AuthRouter, LoginPage, RegisterPage } from './ui/pages'

// Full auth routing
<AuthRouter onAuthenticationSuccess={(session) => {}} />

// Individual pages
<LoginPage onLoginSuccess={(session) => {}} />
<RegisterPage onRegisterSuccess={(parent) => {}} />
```

### Formulaires

```tsx
import { LoginForm, RegisterForm } from './ui/pages'

<LoginForm onSuccess={(session) => {}} />
<RegisterForm onSuccess={(parent) => {}} />
```

### Hooks

```tsx
import { useMutation } from './ui/hooks'
import { useUseCases } from './app/providers/useUseCases'

const useCases = useUseCases()
const { mutate, isLoading, error, data } = useMutation(
  async (credentials) => {
    return await useCases.authentication.loginParentCommand(
      credentials.email,
      credentials.password,
    )
  },
  {
    onSuccess: (session) => console.log('Succès!'),
    onError: (error) => console.error('Erreur:', error),
  },
)
```

---

## Architecture

```
src/
├── ui/                          # Couche présentation
│   ├── design-system/           # Composants réutilisables
│   ├── pages/                   # Pages complets
│   ├── hooks/                   # Hooks personnalisés
│   └── index.ts                 # Exports
│
├── modules/                     # Couche métier
│   ├── authentication/          # Use cases + domaine
│   ├── terms/
│   └── nutrition/
│
└── app/                         # Infrastructure
    ├── di/                      # Injection dépendances
    └── providers/               # React context
```

**Flux de données:**
```
UI Components
    ↓ (useUseCases)
UseCasesContext
    ↓ (buildDiContainer)
Modules (Commands/Queries)
    ↓ (application logic)
Domain (Entities/Validations)
    ↓ (repositories)
Infrastructure (Adapters)
```

---

## Scénarios de Test

### Test 1: Inscription Réussie
```
1. Cliquer "Créer un compte"
2. Remplir: test@test.com / password123 / password123
3. Cliquer "Créer un compte"
✓ Alert "Inscription réussie"
✓ Redirection à login
```

### Test 2: Password Non Valide
```
1. Cliquer "Créer un compte"
2. Remplir: test@test.com / short / short
3. Cliquer "Créer un compte"
✓ Erreur: "Password must be at least 8 characters long"
```

### Test 3: Passwords Non Correspondants
```
1. Cliquer "Créer un compte"
2. Remplir: test@test.com / password123 / different456
3. Cliquer "Créer un compte"
✓ Erreur: "Passwords do not match"
```

### Test 4: Connexion Réussie
```
1. Remplir: test@test.com / password123
2. Cliquer "Se connecter"
✓ Alert "Connexion réussie"
✓ Callback onAuthenticationSuccess déclenché
```

### Test 5: Credentials Invalides
```
1. Remplir: invalid@test.com / wrongpassword
2. Cliquer "Se connecter"
✓ Erreur: "Email ou mot de passe invalide"
```

---

## Fichiers Importants

### Point d'Entrée
- `src/App.tsx` - Composant principal
- `src/main.tsx` - Bootstrap

### Couche Présentation
- `src/ui/design-system/` - Composants UI
- `src/ui/pages/auth/` - Pages d'authentification
- `src/ui/hooks/` - Hooks personnalisés

### Couche Métier
- `src/modules/authentication/` - Use cases
- `src/modules/authentication/domain/` - Entités
- `src/modules/authentication/application/` - Commands/Queries

### Configuration
- `src/app/di/buildDiContainer.ts` - DI composition
- `src/app/providers/UseCasesProvider.tsx` - Context provider
- `src/app/providers/useUseCases.ts` - Hook pour utiliser les use cases

---

## Documentation Complète

- **README.md** - Guide complet
- **ARCHITECTURE.md** - Vue d'ensemble
- **COMPONENTS_USAGE.md** - Exemples d'utilisation
- **USE_CASES_MAPPING.md** - Mapping use cases → UI
- **TESTING_GUIDE.md** - Guide de test

---

## Prochaines Étapes

### Court Terme
- [ ] Tester les formulaires avec différents cas
- [ ] Ajouter un écran "authenticated" dans App.tsx
- [ ] Implémenter la persistance de session

### Moyen Terme
- [ ] Ajouter `useQuery` hook
- [ ] Implémenter logout
- [ ] Ajouter validation de session au démarrage

### Long Terme
- [ ] Ajouter tests unitaires
- [ ] Ajouter plus de composants UI
- [ ] Implémenter thème global
- [ ] Optimiser performance

---

## Dépannage

### Error: "Cannot find module '@/ui/pages'"

**Solution:** Vérifier que l'import path est correct relative au fichier

```tsx
// ❌ Mauvais
import { LoginPage } from '@/ui/pages'

// ✅ Bon (relatif)
import { LoginPage } from '../ui/pages'

// ✅ Bon (alias tsconfig)
import { LoginPage } from '@/ui/pages'
```

### Error: "useUseCases must be used within UseCasesProvider"

**Solution:** Vérifier que le composant est dans l'arborescence du provider

```tsx
// ❌ Mauvais
export default function App() {
  const useCases = useUseCases()  // ❌ Provider n'est pas encore créé
  return <UseCasesProvider>...</UseCasesProvider>
}

// ✅ Bon
export default function App() {
  return (
    <UseCasesProvider>
      <AuthRouter />  // ✅ Provider wraps le composant
    </UseCasesProvider>
  )
}
```

### Error: "isValidEmail is not exported"

**Solution:** Vérifier que la fonction est exportée depuis le module

```tsx
// ❌ Vérifier l'export
import { isValidEmail } from '@/modules/authentication'

// ✅ L'export doit être dans index.ts du module
export { isValidEmail } from './domain/Parent'
```

---

## Performance

- Build time: ~1s
- Bundle size: ~206KB (gzip: ~65KB)
- Type checking: <1s
- Recompile on change: <500ms

---

## Contribution

Avant de modifier les composants:

1. Lancer les tests: `npm run test`
2. Vérifier le linting: `npm run lint`
3. Vérifier les types: `npx tsc --noEmit`
4. Builder: `npm run build`

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [BEM Methodology](http://getbem.com/)

---

**Bon développement ! 🎉**
