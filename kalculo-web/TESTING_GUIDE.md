# Guide de Test - Composants d'Authentification

## Test Manual - Checklist

### 1. LoginForm
- [ ] Affichage correcte du formulaire
- [ ] Validation des champs requis
- [ ] Erreur affichée si email/password invalides
- [ ] État loading correct pendant la requête
- [ ] Message de succès après connexion
- [ ] Champs vidés après succès

### 2. RegisterForm
- [ ] Affichage correcte du formulaire
- [ ] Validation email (format invalide)
- [ ] Validation password (minimum 8 caractères)
- [ ] Validation password confirmation (doit correspondre)
- [ ] Messages d'erreur spécifiques
- [ ] État loading correct
- [ ] Message de succès après inscription

### 3. LoginPage
- [ ] Card centrée sur l'écran
- [ ] Gradient de fond correct
- [ ] Lien vers Register page fonctionne
- [ ] Redirection après connexion réussie

### 4. RegisterPage
- [ ] Card centrée sur l'écran
- [ ] Gradient de fond correct
- [ ] Lien vers Login page fonctionne
- [ ] Redirection après inscription réussie

### 5. AuthRouter
- [ ] Affiche LoginPage par défaut
- [ ] Navigue vers RegisterPage au clic sur le lien
- [ ] Revient à LoginPage après inscription
- [ ] Callback onAuthenticationSuccess déclenché au login

### 6. Design System Components

#### Button
- [ ] Rendu correct pour chaque variante (primary, secondary, danger)
- [ ] Rendu correct pour chaque taille (sm, md, lg)
- [ ] État disabled fonctionne
- [ ] État loading affiche spinner et texte
- [ ] onClick callback fonctionne

#### Input
- [ ] Label affiché correctement
- [ ] Placeholder fonctionne
- [ ] Erreur affichée en rouge
- [ ] HelperText affiché en gris
- [ ] État disabled fonctionne
- [ ] onChange callback fonctionne

#### Card
- [ ] CardHeader, CardBody, CardFooter affichés correctement
- [ ] Bornes et ombres correctes
- [ ] Espacement interne correct

#### Alert
- [ ] Toutes les variantes affichées (success, error, warning, info)
- [ ] Couleurs correctes
- [ ] Bouton close fonctionne
- [ ] Message affiché correctement

## Scénarios de Test

### Scénario 1: Inscription et Connexion Réussies
1. Accéder à `/` (AuthRouter)
2. Cliquer sur "Créer un compte"
3. Remplir le formulaire avec les données valides:
   - Email: `test@example.com`
   - Password: `securepassword123`
   - Confirm Password: `securepassword123`
4. Cliquer sur "Créer un compte"
5. Voir le message de succès
6. Être redirigé à la page de login
7. Remplir le login avec les mêmes identifiants
8. Cliquer sur "Se connecter"
9. Voir le message de succès et être redirigé

**Résultat Attendu:** ✓ Inscription et connexion réussies

### Scénario 2: Email Invalide à l'Inscription
1. Cliquer sur "Créer un compte"
2. Entrer email invalide: `notanemail`
3. Cliquer sur "Créer un compte"
4. Voir message d'erreur: "Email format is invalid"

**Résultat Attendu:** ✓ Erreur affichée

### Scénario 3: Passwords Non Correspondants
1. Cliquer sur "Créer un compte"
2. Remplir:
   - Email: `test@example.com`
   - Password: `securepassword123`
   - Confirm Password: `differentpassword`
3. Cliquer sur "Créer un compte"
4. Voir message d'erreur: "Passwords do not match"

**Résultat Attendu:** ✓ Erreur affichée

### Scénario 4: Password Trop Court
1. Cliquer sur "Créer un compte"
2. Remplir:
   - Email: `test@example.com`
   - Password: `short`
   - Confirm Password: `short`
3. Cliquer sur "Créer un compte"
4. Voir message d'erreur: "Password must be at least 8 characters long"

**Résultat Attendu:** ✓ Erreur affichée

### Scénario 5: Connexion avec Credentials Incorrects
1. Cliquer sur "Se connecter"
2. Entrer:
   - Email: `nonexistent@example.com`
   - Password: `anypassword`
3. Cliquer sur "Se connecter"
4. Voir message d'erreur: "Email ou mot de passe invalide"

**Résultat Attendu:** ✓ Erreur affichée

### Scénario 6: Navigation Entre Login et Register
1. Accéder à `/`
2. Voir LoginPage
3. Cliquer sur "Créer un compte"
4. Voir RegisterPage
5. Cliquer sur "Se connecter"
6. Voir LoginPage

**Résultat Attendu:** ✓ Navigation fonctionne

## Tests Unitaires (Exemples)

### Test: LoginForm Validation

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/ui/pages'
import { UseCasesProvider } from '@/app/providers/UseCasesProvider'

describe('LoginForm', () => {
  it('should display email and password inputs', () => {
    render(
      <UseCasesProvider>
        <LoginForm />
      </UseCasesProvider>,
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
  })

  it('should call onSuccess when login is successful', async () => {
    const onSuccess = vi.fn()

    render(
      <UseCasesProvider>
        <LoginForm onSuccess={onSuccess} />
      </UseCasesProvider>,
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /se connecter/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    // Wait for async operation
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  it('should display error message on invalid credentials', async () => {
    render(
      <UseCasesProvider>
        <LoginForm />
      </UseCasesProvider>,
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /se connecter/i })

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email ou mot de passe invalide/i)).toBeInTheDocument()
    })
  })
})
```

### Test: Button Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/ui/design-system'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button', { name: /click me/i }))
    expect(onClick).toHaveBeenCalled()
  })

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading={true}>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should render with correct variant class', () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    expect(container.querySelector('.button--danger')).toBeInTheDocument()
  })
})
```

### Test: Input Component

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/ui/design-system'

describe('Input', () => {
  it('should render with label', () => {
    render(<Input label="Email" type="email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('should display error message', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })

  it('should display helper text', () => {
    render(<Input label="Password" helperText="Min 8 chars" />)
    expect(screen.getByText(/min 8 chars/i)).toBeInTheDocument()
  })

  it('should call onChange when user types', () => {
    const onChange = vi.fn()
    render(<Input type="text" onChange={onChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(onChange).toHaveBeenCalled()
  })
})
```

## Performance Testing

### Métriques à Vérifier
- [ ] Temps de chargement du formulaire < 500ms
- [ ] Temps de validation < 100ms
- [ ] Réponse du serveur < 2s
- [ ] Animation de transition < 300ms

### Outil: Chrome DevTools
1. Ouvrir DevTools (F12)
2. Aller à l'onglet "Performance"
3. Cliquer sur "Record"
4. Effectuer l'action (ex: cliquer sur "Se connecter")
5. Cliquer sur "Stop"
6. Analyser les résultats

## Accessibilité (A11y)

### Checklist
- [ ] Tous les inputs ont des labels associés
- [ ] Tous les boutons ont des labels descriptifs
- [ ] Les couleurs ont un contraste suffisant (WCAG AA)
- [ ] Les alerts ont role="alert"
- [ ] Keyboard navigation fonctionne
- [ ] Lecteur d'écran peut lire les contenus

### Test avec aXe DevTools
1. Installer l'extension aXe DevTools
2. Ouvrir les DevTools
3. Aller à l'onglet "axe DevTools"
4. Cliquer sur "Scan ALL of my page"
5. Corriger les erreurs détectées

## Responsive Design

### Points de Rupture à Tester
- [ ] Mobile (320px)
- [ ] Tablette (768px)
- [ ] Desktop (1024px)
- [ ] Large Desktop (1440px)

### Tests
1. Ouvrir DevTools
2. Cliquer sur "Toggle device toolbar" (Ctrl+Shift+M)
3. Sélectionner différents appareils
4. Vérifier que l'UI s'adapte correctement

## Coverage

### Objectif
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

### Commande
```bash
npm run test -- --coverage
```

## Continuous Integration

### Pipeline de Test (recommandé)
```
Commit Code
    ↓
Linting (ESLint)
    ↓
Type Checking (TypeScript)
    ↓
Unit Tests (Vitest)
    ↓
Build (Vite)
    ↓
✓ Merge si tout passe
```
