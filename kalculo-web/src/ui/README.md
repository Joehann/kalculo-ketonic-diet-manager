# Architecture de la couche Présentation (UI)

## Overview

La couche présentation est organisée en trois niveaux :

1. **Design System** (`src/ui/design-system/`) - Composants réutilisables et basiques
2. **Pages** (`src/ui/pages/`) - Pages complet et composants spécifiques à une page
3. **Hooks** (`src/ui/hooks/`) - Hooks réutilisables pour la gestion d'état et les effets

## Structure

```
src/ui/
├── design-system/           # Composants réutilisables
│   ├── Button.tsx          # Composant bouton
│   ├── Button.css
│   ├── Input.tsx           # Composant input
│   ├── Input.css
│   ├── Card.tsx            # Composant card
│   ├── Card.css
│   ├── Alert.tsx           # Composant alerte
│   ├── Alert.css
│   └── index.ts
├── pages/                   # Pages et sous-composants
│   ├── auth/
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.css
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RegisterForm.css
│   │   │   └── index.ts
│   │   ├── LoginPage/
│   │   │   ├── index.tsx
│   │   │   └── LoginPage.css
│   │   ├── RegisterPage/
│   │   │   ├── index.tsx
│   │   │   └── RegisterPage.css
│   │   └── index.ts
│   ├── AuthRouter.tsx      # Router pour la navigation auth
│   └── index.ts
├── hooks/                   # Hooks personnalisés
│   ├── useMutation.ts      # Hook pour les mutations (appels aux use cases)
│   └── index.ts
└── index.ts
```

## Design System

### Composants Disponibles

#### Button
```tsx
import { Button } from '@/ui/design-system'

<Button variant="primary" size="md" isLoading={false}>
  Click me
</Button>
```

**Props :**
- `variant`: `'primary' | 'secondary' | 'danger'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `isLoading`: `boolean` (default: `false`)

#### Input
```tsx
import { Input } from '@/ui/design-system'

<Input
  type="email"
  label="Email"
  error="Invalid email"
  helperText="Enter a valid email"
  placeholder="user@example.com"
/>
```

**Props :**
- `label`: `string` (optional)
- `error`: `string` (optional)
- `helperText`: `string` (optional)
- Hérite de `HTMLInputElement` attributes

#### Card
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/ui/design-system'

<Card>
  <CardHeader>
    <h1>Title</h1>
  </CardHeader>
  <CardBody>
    <p>Content here</p>
  </CardBody>
  <CardFooter>
    <button>Action</button>
  </CardFooter>
</Card>
```

#### Alert
```tsx
import { Alert } from '@/ui/design-system'

<Alert type="success" onClose={() => {}}>
  Opération réussie !
</Alert>
```

**Props :**
- `type`: `'success' | 'error' | 'warning' | 'info'`
- `onClose`: `() => void` (optional)

## Pages & Formulaires

### AuthRouter
Point d'entrée principal pour l'authentification. Gère la navigation entre Login et Register.

```tsx
import { AuthRouter } from '@/ui/pages'
import { UseCasesProvider } from '@/app/providers/UseCasesProvider'

function App() {
  return (
    <UseCasesProvider>
      <AuthRouter
        onAuthenticationSuccess={(session) => {
          console.log('User logged in:', session)
        }}
      />
    </UseCasesProvider>
  )
}
```

### LoginPage
Page de connexion avec un formulaire de login.

```tsx
import { LoginPage } from '@/ui/pages'

<LoginPage
  onLoginSuccess={(session) => {}}
  onNavigateToRegister={() => {}}
/>
```

### RegisterPage
Page d'inscription avec un formulaire de register.

```tsx
import { RegisterPage } from '@/ui/pages'

<RegisterPage
  onRegisterSuccess={(parent) => {}}
  onNavigateToLogin={() => {}}
/>
```

### LoginForm & RegisterForm
Composants de formulaire réutilisables.

```tsx
import { LoginForm, RegisterForm } from '@/ui/pages'

<LoginForm onSuccess={(session) => {}} />
<RegisterForm onSuccess={(parent) => {}} />
```

## Hooks

### useMutation
Hook générique pour exécuter des mutations asynchrones (appels aux use cases).

```tsx
import { useMutation } from '@/ui/hooks'
import { useUseCases } from '@/app/providers/useUseCases'

function MyComponent() {
  const useCases = useUseCases()

  const { mutate, data, error, isLoading } = useMutation<
    SessionToken,
    Error,
    { email: string; password: string }
  >(
    async (credentials) => {
      return await useCases.authentication.loginParentCommand(
        credentials.email,
        credentials.password,
      )
    },
    {
      onSuccess: (session) => {
        console.log('Login successful:', session)
      },
      onError: (error) => {
        console.error('Login failed:', error)
      },
    },
  )

  return (
    <button onClick={() => mutate({ email: 'test@test.com', password: '12345678' })}>
      Login
    </button>
  )
}
```

## Intégration avec les Use Cases

### Flux d'Authentification

1. **UseCasesProvider** expose les use cases via React Context
2. **Pages/Formulaires** utilisent `useUseCases()` pour accéder aux commands/queries
3. **useMutation hook** exécute les use cases de manière asynchrone
4. **Design System** affiche l'état et les erreurs

### Exemple Complet

```tsx
import { UseCasesProvider } from '@/app/providers/UseCasesProvider'
import { AuthRouter } from '@/ui/pages'

export default function App() {
  return (
    <UseCasesProvider>
      <AuthRouter
        onAuthenticationSuccess={(session) => {
          localStorage.setItem('sessionToken', session.token)
          // Rediriger vers la page d'accueil
        }}
      />
    </UseCasesProvider>
  )
}
```

## Conventions

### Nommage des fichiers
- Composants : PascalCase (ex: `LoginForm.tsx`)
- Hooks : camelCase avec préfixe `use` (ex: `useMutation.ts`)
- Styles : Même nom que le composant avec `.css` (ex: `LoginForm.css`)

### Organisation des dossiers
- **design-system** : Aucune dépendance sur les use cases
- **pages** : Peut avoir des sous-dossiers pour organiser les sous-composants
- **hooks** : Logique réutilisable qui peut être utilisée dans plusieurs pages

### CSS
- Utiliser BEM pour les noms de classes (ex: `.card__header`)
- Modularité : Chaque composant = un fichier CSS
- Éviter les cascades globales

## Prochaines Étapes

1. **Améliorer useMutation** :
   - Supporter les types génériques plus complexes
   - Ajouter retry logic
   - Ajouter cache (si besoin)

2. **Ajouter plus de composants UI** :
   - Form wrapper
   - Modal
   - Dropdown
   - Tabs
   - etc.

3. **Ajouter des hooks supplémentaires** :
   - `useQuery` pour les lectures
   - `useLocalStorage` pour la persistance
   - `useAuth` pour encapsuler la logique d'authentification

4. **Tests** :
   - Unit tests pour les composants
   - Integration tests pour les pages
