# Guide d'Utilisation des Composants d'Authentification

## Quick Start

### 1. Afficher la page d'authentification

```tsx
import { AuthRouter } from '@/ui/pages'

function App() {
  return (
    <UseCasesProvider>
      <AuthRouter
        onAuthenticationSuccess={(session) => {
          console.log('Utilisateur connecté:', session)
          // Rediriger vers le dashboard
        }}
      />
    </UseCasesProvider>
  )
}
```

## Composants

### Design System

#### Button
Composant bouton réutilisable avec plusieurs variantes.

```tsx
import { Button } from '@/ui/design-system'

// Variante primaire
<Button variant="primary">Envoyer</Button>

// Variante secondaire
<Button variant="secondary">Annuler</Button>

// Variante danger
<Button variant="danger">Supprimer</Button>

// Avec état loading
<Button isLoading={true}>Chargement...</Button>

// Différentes tailles
<Button size="sm">Petit</Button>
<Button size="md">Normal</Button>
<Button size="lg">Grand</Button>
```

#### Input
Composant input avec label, validation et helper text.

```tsx
import { Input } from '@/ui/design-system'

// Input simple
<Input
  type="text"
  label="Nom"
  placeholder="Votre nom"
/>

// Input avec erreur
<Input
  type="email"
  label="Email"
  error="Email invalide"
  placeholder="user@example.com"
/>

// Input avec helper text
<Input
  type="password"
  label="Mot de passe"
  helperText="Minimum 8 caractères"
/>
```

#### Card
Composant card pour grouper le contenu.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/ui/design-system'

<Card>
  <CardHeader>
    <h2>Titre de la Card</h2>
  </CardHeader>
  <CardBody>
    <p>Contenu principal</p>
  </CardBody>
  <CardFooter>
    <button>Action</button>
  </CardFooter>
</Card>
```

#### Alert
Composant alerte pour les messages de succès, erreur, warning et info.

```tsx
import { Alert } from '@/ui/design-system'

// Alerte de succès
<Alert type="success">Opération réussie !</Alert>

// Alerte d'erreur
<Alert type="error" onClose={() => setShowError(false)}>
  Une erreur est survenue
</Alert>

// Alerte d'avertissement
<Alert type="warning">Attention: action irréversible</Alert>

// Alerte info
<Alert type="info">Information importante</Alert>
```

### Pages & Formulaires

#### AuthRouter
Point d'entrée pour l'authentification. Gère automatiquement la navigation entre Login et Register.

```tsx
import { AuthRouter } from '@/ui/pages'

<AuthRouter
  onAuthenticationSuccess={(session: SessionToken) => {
    // Gérer la redirection ou stocker la session
    localStorage.setItem('token', session.token)
  }}
/>
```

#### LoginPage
Page de connexion complète.

```tsx
import { LoginPage } from '@/ui/pages'

<LoginPage
  onLoginSuccess={(session) => {
    console.log('Connecté avec le token:', session.token)
  }}
  onNavigateToRegister={() => {
    // Aller à la page d'inscription
  }}
/>
```

#### RegisterPage
Page d'inscription complète.

```tsx
import { RegisterPage } from '@/ui/pages'

<RegisterPage
  onRegisterSuccess={(parent) => {
    console.log('Compte créé pour:', parent.email)
    // Optionnellement rediriger vers login
  }}
  onNavigateToLogin={() => {
    // Aller à la page de connexion
  }}
/>
```

#### LoginForm
Composant formulaire de connexion réutilisable.

```tsx
import { LoginForm } from '@/ui/pages'

<LoginForm
  onSuccess={(session) => {
    console.log('Connexion réussie!')
  }}
/>
```

#### RegisterForm
Composant formulaire d'inscription réutilisable.

```tsx
import { RegisterForm } from '@/ui/pages'

<RegisterForm
  onSuccess={(parent) => {
    console.log('Inscription réussie!')
  }}
/>
```

## Hooks

### useMutation
Hook générique pour les mutations asynchrones.

```tsx
import { useMutation } from '@/ui/hooks'
import { useUseCases } from '@/app/providers/useUseCases'

function MyComponent() {
  const useCases = useUseCases()

  const { mutate, data, error, isLoading } = useMutation(
    async (credentials: { email: string; password: string }) => {
      return await useCases.authentication.loginParentCommand(
        credentials.email,
        credentials.password,
      )
    },
    {
      onSuccess: (session) => {
        console.log('Succès!')
      },
      onError: (error) => {
        console.error('Erreur:', error)
      },
    },
  )

  return (
    <>
      <button
        onClick={() => mutate({ email: 'test@test.com', password: 'password' })}
        disabled={isLoading}
      >
        {isLoading ? 'Chargement...' : 'Envoyer'}
      </button>
      {error && <p>Erreur: {error.message}</p>}
      {data && <p>Résultat: {JSON.stringify(data)}</p>}
    </>
  )
}
```

## Architecture & Flux de Données

### Flux d'Authentification

```
1. Utilisateur remplit le formulaire (LoginForm)
   ↓
2. Clique sur "Se connecter"
   ↓
3. useMutation est appelé avec les credentials
   ↓
4. useUseCases() récupère le loginParentCommand du contexte
   ↓
5. Le command est exécuté (appel à la couche application)
   ↓
6. onSuccess callback met à jour l'UI
   ↓
7. Utilisateur est redirigé vers le dashboard
```

### Gestion d'Erreurs

Les erreurs sont gérées à plusieurs niveaux :

1. **Validation côté client** : Dans les formulaires (RegisterForm, LoginForm)
2. **Erreurs métier** : InvalidCredentialsError, InvalidPasswordError, etc.
3. **Affichage UI** : Composant Alert avec type="error"

```tsx
import { InvalidCredentialsError } from '@/modules/authentication'

const { error } = useMutation(...)

if (error instanceof InvalidCredentialsError) {
  // Afficher message spécifique
}
```

## Bonnes Pratiques

### 1. Utiliser les composants du Design System
Toujours utiliser les composants du design-system pour maintenir la cohérence.

### 2. Séparation des Préoccupations
- **Design System** : Aucune logique métier
- **Pages** : Logique d'orchestration
- **Formulaires** : Validation et état du formulaire
- **Hooks** : Logique réutilisable

### 3. Types TypeScript
Toujours typer les props et les callbacks :

```tsx
interface LoginPageProps {
  onLoginSuccess?: (session: SessionToken) => void
  onNavigateToRegister?: () => void
}
```

### 4. Gestion d'État Minimal
Utiliser des hooks minimaux pour l'état local. Pour l'état global, utiliser le context des use cases.

### 5. CSS Modulaire
Chaque composant a son propre fichier CSS pour éviter les conflits.

## Exemple Complet d'Intégration

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UseCasesProvider } from './app/providers/UseCasesProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseCasesProvider>
      <App />
    </UseCasesProvider>
  </StrictMode>,
)
```

```tsx
// src/App.tsx
import { useState } from 'react'
import { AuthRouter } from './ui/pages'
import type { SessionToken } from './modules/authentication'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [session, setSession] = useState<SessionToken | null>(null)

  if (!isAuthenticated) {
    return (
      <AuthRouter
        onAuthenticationSuccess={(sessionToken) => {
          setSession(sessionToken)
          setIsAuthenticated(true)
          // Optionnel: rediriger ou charger des données
        }}
      />
    )
  }

  return (
    <main>
      <header>
        <h1>Bienvenue dans Kalculo</h1>
        <p>Session Token: {session?.token}</p>
        <button onClick={() => setIsAuthenticated(false)}>
          Déconnexion
        </button>
      </header>
      <section>
        {/* Contenu de l'application */}
      </section>
    </main>
  )
}

export default App
```

## Prochaines Étapes

1. **Ajouter useQuery hook** pour les requêtes en lecture
2. **Implémenter useAuth hook** pour encapsuler la logique d'authentification
3. **Ajouter plus de composants UI** : Modal, Dropdown, Tabs, etc.
4. **Ajouter des tests** : Unit tests et integration tests
5. **Améliorer le thème** : Tokens de couleur, responsive design
