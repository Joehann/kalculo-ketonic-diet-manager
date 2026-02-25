# Mapping Use Cases → Composants UI

## Architecture: Use Cases → UI Layer

```
┌─────────────────────────────────────────────────────┐
│            APPLICATION LAYER (Use Cases)            │
│  ┌──────────────────────────────────────────────────┐│
│  │ Commands                                         ││
│  ├──────────────────────────────────────────────────┤│
│  │ • registerParentCommand(email, password)        ││
│  │ • loginParentCommand(email, password)           ││
│  │ • logoutParentCommand()                         ││
│  ├──────────────────────────────────────────────────┤│
│  │ Queries                                          ││
│  ├──────────────────────────────────────────────────┤│
│  │ • validateSessionQuery()                        ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────┐
│            PRESENTATION LAYER (UI)                  │
│  ┌──────────────────────────────────────────────────┐│
│  │ AuthRouter                                       ││
│  │  └─ Navigation entre Login/Register              ││
│  │                                                  ││
│  │ LoginPage                                        ││
│  │  └─ LoginForm                                    ││
│  │      └─ useMutation → loginParentCommand         ││
│  │      └─ Design System components                 ││
│  │                                                  ││
│  │ RegisterPage                                     ││
│  │  └─ RegisterForm                                 ││
│  │      └─ useMutation → registerParentCommand      ││
│  │      └─ Design System components                 ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Détail des Cas d'Utilisation

### 1. Inscription (Registration Flow)

**Use Case:** `registerParentCommand`

**Composants Impliqués:**
- AuthRouter
  - RegisterPage
    - RegisterForm
      - useMutation hook
        - registerParentCommand call
      - Input components (email, password, confirmPassword)
      - Button component
      - Alert component (error)

**Flux:**
```
1. Utilisateur clique sur "Créer un compte" dans AuthRouter
   ↓
2. RegisterPage s'affiche
   ↓
3. RegisterForm affiche les champs (email, password, confirm password)
   ↓
4. Utilisateur remplir les champs
   ↓
5. Utilisateur clique sur "Créer un compte"
   ↓
6. RegisterForm valide les données côté client
   ↓
7. useMutation appelle registerParentCommand
   ↓
8. Résultat:
   - ✅ Succès: Alert "Inscription réussie", redirection vers LoginPage
   - ❌ Erreur: Alert affiche le message d'erreur
```

**Éléments de Validation:**
```tsx
const validation = validateRegisterForm(email, password, confirmPassword)
// Vérifie:
// - Email format valide (regex)
// - Password >= 8 caractères
// - Password === confirmPassword
```

**Erreurs Métier Gérées:**
```
• InvalidEmailError          → "Email invalide ou déjà utilisé"
• InvalidPasswordError       → "Le mot de passe doit contenir au moins 8 caractères"
• Erreurs serveur            → Message générique
```

---

### 2. Connexion (Login Flow)

**Use Case:** `loginParentCommand`

**Composants Impliqués:**
- AuthRouter
  - LoginPage
    - LoginForm
      - useMutation hook
        - loginParentCommand call
      - Input components (email, password)
      - Button component
      - Alert component (success/error)

**Flux:**
```
1. Utilisateur arrive sur AuthRouter (défaut = LoginPage)
   ↓
2. LoginForm affiche les champs (email, password)
   ↓
3. Utilisateur remplir les champs
   ↓
4. Utilisateur clique sur "Se connecter"
   ↓
5. LoginForm valide les données côté client
   ↓
6. useMutation appelle loginParentCommand
   ↓
7. Résultat:
   - ✅ Succès: Alert "Connexion réussie", callback onAuthenticationSuccess
   - ❌ Erreur: Alert affiche le message d'erreur
```

**Éléments de Validation:**
```tsx
// Validation côté client
if (!email.trim() || !password.trim()) {
  // Erreur affichée (optionnel - la validation métier gère aussi ça)
}
```

**Erreurs Métier Gérées:**
```
• InvalidCredentialsError    → "Email ou mot de passe invalide"
• InvalidEmailError          → "Email invalide"
• Parent not found           → "Email ou mot de passe invalide"
```

---

### 3. Déconnexion (Logout Flow) - À venir

**Use Case:** `logoutParentCommand`

**Composants Impliqués:**
- Dashboard/App component
  - Header
    - Button "Déconnexion"
      - useMutation hook
        - logoutParentCommand call

**Flux Prévu:**
```
1. Utilisateur clique sur "Déconnexion"
   ↓
2. useMutation appelle logoutParentCommand
   ↓
3. Résultat:
   - ✅ Succès: Session supprimée, redirection vers AuthRouter
```

---

### 4. Validation de Session (Future) - À venir

**Use Case:** `validateSessionQuery`

**Composants Impliqués:**
- App component (au démarrage)
  - useEffect hook
    - validateSessionQuery call
  - Conditionally render AuthRouter ou Dashboard

**Flux Prévu:**
```
1. App component monte
   ↓
2. useEffect appelle validateSessionQuery
   ↓
3. Résultat:
   - ✅ Session valide: Affiche le Dashboard
   - ❌ Session invalide/expirée: Affiche AuthRouter
```

---

## Implémentation Détaillée

### RegisterForm → registerParentCommand

```tsx
// src/ui/pages/auth/forms/RegisterForm.tsx

const { mutate, isLoading, error, data } = useMutation<
  Parent,  // Type de retour
  Error,   // Type d'erreur
  { email: string; password: string }  // Type de variable
>(
  // Mutation function - appelle le use case
  async (credentials: { email: string; password: string }) => {
    return await useCases.authentication.registerParentCommand(
      credentials.email,
      credentials.password,
    )
  },
  {
    // Callbacks
    onSuccess: (parent: Parent) => {
      // Nettoyer le formulaire
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setValidationErrors({})
      // Notifier le parent
      onSuccess?.(parent)
    },
  },
)
```

**Type Flow:**
```
RegisterForm props: { onSuccess?: (parent: Parent) => void }
  ↓
RegisterForm state: { email, password, confirmPassword }
  ↓
useMutation<Parent, Error, Credentials>
  ├─ Entrée: Credentials ({ email, password })
  ├─ Process: await registerParentCommand(...)
  └─ Sortie: Parent
  ↓
onSuccess callback: (parent: Parent) => void
  ├─ Reset form state
  ├─ Call parent onSuccess
  └─ Parent redirects
```

### LoginForm → loginParentCommand

```tsx
// src/ui/pages/auth/forms/LoginForm.tsx

const { mutate, isLoading, error, data } = useMutation<
  SessionToken,  // Type de retour
  Error,         // Type d'erreur
  { email: string; password: string }  // Type de variable
>(
  // Mutation function
  async (credentials: { email: string; password: string }) => {
    return await useCases.authentication.loginParentCommand(
      credentials.email,
      credentials.password,
    )
  },
  {
    // Callbacks
    onSuccess: (session: SessionToken) => {
      // Nettoyer le formulaire
      setEmail('')
      setPassword('')
      // Notifier le parent
      onSuccess?.(session)
    },
  },
)
```

**Type Flow:**
```
LoginForm props: { onSuccess?: (session: SessionToken) => void }
  ↓
LoginForm state: { email, password }
  ↓
useMutation<SessionToken, Error, Credentials>
  ├─ Entrée: Credentials ({ email, password })
  ├─ Process: await loginParentCommand(...)
  └─ Sortie: SessionToken
  ↓
onSuccess callback: (session: SessionToken) => void
  ├─ Reset form state
  ├─ Call parent onSuccess
  └─ Parent redirects
```

---

## Gestion des Erreurs

### Niveau 1: Validation Côté Client (Optionnel)

**Où:** Dans le composant form
**Responsable:** validateRegisterForm, validateLoginForm
**Exemple:**
```tsx
const errors = validateRegisterForm(email, password, confirmPassword)
if (errors) {
  setValidationErrors(errors)
  return // Ne pas appeler mutate
}
```

### Niveau 2: Validation Métier (Use Case)

**Où:** Dans la couche application (commands)
**Responsable:** registerParentCommand, loginParentCommand
**Exemple:**
```ts
if (!isValidEmail(email)) {
  throw new InvalidEmailError(...)
}
```

### Niveau 3: Affichage Erreur (UI)

**Où:** Dans le composant form
**Responsable:** Alert component
**Exemple:**
```tsx
{error && (
  <Alert type="error">
    {error instanceof InvalidCredentialsError
      ? 'Email ou mot de passe invalide'
      : error.message}
  </Alert>
)}
```

---

## Exemple Complet: Flux d'Inscription

```
User Interface
├─ 1. Utilisateur clique "Créer un compte"
│
UI Components
├─ 2. AuthRouter change currentView = 'register'
├─ 3. RegisterPage s'affiche
├─ 4. RegisterForm s'affiche avec les inputs
│
User Interaction
├─ 5. Utilisateur remplit:
│     - Email: test@example.com
│     - Password: securepass123
│     - Confirm: securepass123
├─ 6. Utilisateur clique "Créer un compte"
│
Validation Layer
├─ 7. RegisterForm valide côté client
│     - Email format OK ✓
│     - Password >= 8 chars ✓
│     - Passwords match ✓
├─ 8. RegisterForm appelle mutate()
│
State Management
├─ 9. useMutation: isLoading = true
├─ 10. Button affiche "Chargement..."
│
Application Layer
├─ 11. registerParentCommand(email, password) appelé
├─ 12. Domain validation:
│      - isValidEmail()
│      - isValidPasswordFormat()
│      - createParent()
├─ 13. Infrastructure:
│      - parentRepository.add(parent)
│      - passwordHasher.hash(password)
│
Result
├─ 14a. SUCCESS:
│       - Parent créé avec ID unique
│       - useMutation: isLoading = false, data = Parent
│       - onSuccess callback exécuté
│       - RegisterForm reset
│       - Alert "Inscription réussie"
│       - AuthRouter redirects to LoginPage
│
│ 14b. ERROR:
│       - InvalidEmailError lancée
│       - useMutation: isLoading = false, error = InvalidEmailError
│       - Alert "Email invalide ou déjà utilisé"
│       - Utilisateur peut réessayer
```

---

## Intégration avec DI Container

```tsx
// main.tsx
<UseCasesProvider>
  <App />
</UseCasesProvider>

// buildDiContainer.ts
const container = {
  useCases: {
    authentication: buildAuthenticationUseCases(
      parentRepositoryAdapter,
      passwordHasherAdapter,
      sessionStorageAdapter,
    ),
  },
}

// UseCasesProvider.tsx
<UseCasesContext.Provider value={container.useCases}>

// RegisterForm.tsx
const useCases = useUseCases()
await useCases.authentication.registerParentCommand(email, password)
```

---

## Résumé des Types

```typescript
// From domain/application
type Parent = {
  id: string
  email: string
  passwordHash: string
  role: 'parent'
  createdAt: Date
  updatedAt: Date
}

type SessionToken = {
  token: string
  parentId: string
  expiresAt: Date
  createdAt: Date
}

// Command types
type RegisterParentCommand = (email: string, password: string) => Promise<Parent>
type LoginParentCommand = (email: string, password: string) => Promise<SessionToken>
type LogoutParentCommand = () => Promise<void>

// Query types
type ValidateSessionQuery = () => Promise<SessionToken | null>

// Hook types
type UseMutation<TData, TError, TVariables> = {
  mutate: (variables: TVariables) => Promise<void>
  data: TData | null
  error: TError | null
  isLoading: boolean
}
```

---

## À Venir

### Connexion des Queries
```tsx
// Future: useQuery hook
const { data: session } = useQuery(
  () => useCases.authentication.validateSessionQuery()
)

if (session) {
  // Afficher dashboard
} else {
  // Afficher auth pages
}
```

### Gestion de Session Persistante
```tsx
// App.tsx (future)
useEffect(() => {
  const token = localStorage.getItem('sessionToken')
  if (token) {
    // Valider et restaurer la session
  }
}, [])
```

### Logout Handler
```tsx
// Header.tsx (future)
const handleLogout = async () => {
  await useCases.authentication.logoutParentCommand()
  localStorage.removeItem('sessionToken')
  navigate('/auth')
}
```
