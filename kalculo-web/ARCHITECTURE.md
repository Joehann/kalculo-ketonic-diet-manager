# Architecture Globale - Kalculo Frontend

## Vue d'Ensemble de la Structure

```
src/
├── app/                          # Configuration & Infrastructure
│   ├── di/
│   │   └── buildDiContainer.ts  # Injection de dépendances
│   ├── providers/
│   │   ├── UseCasesContext.ts   # React Context
│   │   ├── useCases.ts          # Hook pour accéder aux use cases
│   │   └── UseCasesProvider.tsx # Provider wrapper
│   └── env/
│       └── dataSource.ts        # Configuration de l'environnement
│
├── modules/                      # Couche Métier (Domain & Application)
│   ├── authentication/          # Module d'authentification
│   │   ├── domain/
│   │   │   ├── Parent.ts
│   │   │   └── errors/
│   │   ├── application/
│   │   │   ├── commands/       # Use cases
│   │   │   ├── queries/
│   │   │   └── ports/          # Interfaces
│   │   └── infrastructure/      # Implémentations des ports
│   ├── terms/                   # Module des conditions
│   ├── nutrition/               # Module nutrition
│   └── ...autres modules
│
└── ui/                          # Couche Présentation (NEW)
    ├── design-system/           # Composants réutilisables
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Card.tsx
    │   ├── Alert.tsx
    │   └── index.ts
    ├── pages/                   # Pages & composants spécifiques
    │   ├── auth/
    │   │   ├── LoginPage/
    │   │   │   ├── index.tsx
    │   │   │   └── LoginPage.css
    │   │   ├── RegisterPage/
    │   │   ├── forms/
    │   │   │   ├── LoginForm.tsx
    │   │   │   ├── RegisterForm.tsx
    │   │   │   └── index.ts
    │   │   └── index.ts
    │   ├── AuthRouter.tsx       # Orchestration
    │   └── index.ts
    ├── hooks/                   # Hooks personnalisés
    │   ├── useMutation.ts       # Hook pour mutations
    │   └── index.ts
    ├── index.ts
    └── README.md
```

## Architecture en Couches

```
┌─────────────────────────────────────────────────────┐
│         COUCHE PRÉSENTATION (UI)                    │
│  ┌─────────────────────────────────────────────────┐│
│  │ Design System                                    ││
│  │ Button, Input, Card, Alert, etc.                ││
│  └─────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │ Pages & Composants                              ││
│  │ LoginPage, RegisterPage, Forms, etc.            ││
│  └─────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │ Hooks Personnalisés                             ││
│  │ useMutation, useQuery (future)                  ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
         ↓ (Appelle via useUseCases)
┌─────────────────────────────────────────────────────┐
│   COUCHE APPLICATION (Use Cases / CQRS)             │
│  ┌──────────────┬──────────────────────────────────┐│
│  │ Commands     │ Queries                          ││
│  │ • login      │ • validateSession                ││
│  │ • register   │                                  ││
│  │ • logout     │                                  ││
│  └──────────────┴──────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
         ↓ (Dépend de)
┌─────────────────────────────────────────────────────┐
│      COUCHE DOMAINE (Entités & Règles Métier)      │
│  ┌─────────────────────────────────────────────────┐│
│  │ Parent, SessionToken, Validation                ││
│  │ InvalidCredentialsError, InvalidPasswordError   ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
         ↓ (Utilise via ports)
┌─────────────────────────────────────────────────────┐
│   COUCHE INFRASTRUCTURE (Adaptateurs)               │
│  ┌──────────────┬──────────────────────────────────┐│
│  │ In-Memory    │ API (future)                     ││
│  │ • Adapters   │ • HTTP Client                    ││
│  │ • Storage    │ • API Adapters                   ││
│  └──────────────┴──────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Flux de Données - Authentification

### Scénario: Connexion d'un Utilisateur

```
1. UTILISATEUR
   └─ Remplit le formulaire (email, password)
   └─ Clique sur "Se connecter"

2. UI COMPONENTS
   ├─ LoginForm valide les inputs
   ├─ useMutation est appelé
   └─ État loading = true

3. HOOKS
   └─ useMutation reçoit les credentials
   └─ Appelle la mutation function

4. CONTEXT & PROVIDERS
   └─ useUseCases() récupère les use cases
   └─ Appelle loginParentCommand(email, password)

5. APPLICATION LAYER
   ├─ loginParentCommand valide email
   ├─ Recherche le parent par email
   ├─ Vérifie le mot de passe
   ├─ Crée une session
   └─ Persiste la session

6. DOMAIN LAYER
   ├─ Valide les règles métier
   ├─ Génère le token
   ├─ Calcule l'expiration
   └─ Retourne SessionToken

7. RETOUR AUX COMPOSANTS
   ├─ useMutation reçoit les données
   ├─ onSuccess callback exécuté
   └─ État loading = false

8. UI MÀ JOUR
   ├─ Alert de succès affichée
   ├─ Utilisateur redirigé
   └─ Session stockée (localStorage, sessionStorage, etc.)
```

## Intégration des Modules

### Modules d'Authentification
```
authentication/
├── domain/
│   ├── Parent.ts              # Entité Principal
│   ├── errors/
│   │   └── AuthenticationError.ts
│   └── validations
├── application/
│   ├── commands/
│   │   ├── loginParentCommand.ts
│   │   ├── registerParentCommand.ts
│   │   └── logoutParentCommand.ts
│   ├── queries/
│   │   └── validateSessionQuery.ts
│   └── ports/
│       ├── ParentRepositoryPort.ts
│       ├── PasswordHasherPort.ts
│       └── SessionStoragePort.ts
└── infrastructure/
    ├── in-memory/
    │   ├── InMemoryParentRepositoryAdapter.ts
    │   ├── InMemoryPasswordHasherAdapter.ts
    │   └── InMemorySessionStorageAdapter.ts
    └── api/
        ├── ApiParentRepositoryAdapter.ts
        ├── ApiPasswordHasherAdapter.ts
        └── ApiSessionStorageAdapter.ts
```

### Utilisation dans UI
```
LoginForm.tsx
    ↓
useUseCases()
    ↓
useCases.authentication.loginParentCommand
    ↓
loginParentCommand(email, password)
    ↓
Retourne SessionToken
    ↓
useMutation onSuccess
    ↓
Afficher succès & redirection
```

## Gestion des Erreurs

### Types d'Erreurs

```
┌─────────────────────────────────────┐
│     Authentication Errors           │
├─────────────────────────────────────┤
│ • InvalidCredentialsError           │
│ • InvalidPasswordError              │
│ • InvalidEmailError                 │
│ • ParentNotFoundError               │
│ • SessionExpiredError               │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│     Affichage dans UI               │
├─────────────────────────────────────┤
│ Alert type="error"                  │
│ Message spécifique pour l'utilisateur│
│ → "Email ou mot de passe invalide"  │
│ → "Le compte n'existe pas"          │
└─────────────────────────────────────┘
```

## Flux d'Injection de Dépendances

```
main.tsx
    ↓
<UseCasesProvider>
    ├─ buildDiContainer()
    ├─ Instancie les adaptateurs
    ├─ Construit les use cases
    └─ Passe via Context
    ↓
<App>
    ├─ AuthRouter
    ├─ LoginPage
    └─ Forms
        ↓
    useUseCases()
        ↓
    Récupère les use cases du Context
```

## Points Clés de l'Architecture

### 1. Séparation des Responsabilités
- **Design System** : Présentation pure, pas de logique
- **Pages** : Orchestration et routing
- **Formulaires** : Validation et état
- **Hooks** : Logique réutilisable
- **Modules** : Logique métier complètement isolée

### 2. Abstraction des Dépendances
Les use cases ne connaissent pas les adapateurs concrets (in-memory vs API).
Cela permet de changer d'implémentation sans toucher à la couche présentation.

### 3. Type Safety
Tout est fortement typé avec TypeScript pour éviter les bugs à l'exécution.

### 4. Réutilisabilité
- Les composants du design system sont complètement réutilisables
- Les hooks peuvent être utilisés dans différents formulaires
- Les pages peuvent être combinées avec d'autres pages

## Évolution Possible

```
PHASE 1 (Actuelle) ✓
├─ Design System basique
├─ LoginForm & RegisterForm
├─ useMutation hook
└─ Intégration avec use cases

PHASE 2 (À venir)
├─ useQuery hook
├─ useAuth hook (encapsulation)
├─ More UI components (Modal, Dropdown, etc.)
├─ Responsive design
└─ Thème globale

PHASE 3 (Plus tard)
├─ State management (Redux, Zustand, etc.)
├─ Form library (React Hook Form, Formik)
├─ Tests E2E (Cypress, Playwright)
└─ Performance optimization
```

## Ressources

- [Architecture Hexagonale (Ports & Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [React Context API](https://react.dev/reference/react/useContext)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)
