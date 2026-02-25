---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/prd.md
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/architecture.md
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/ux-design-specification.md
---

# kalculo - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for kalculo, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Parents can create and access a secure account.
FR2: Caregivers can access shared content only through delegated access.
FR3: The system can enforce role-based permissions between parent and caregiver roles.
FR4: Parents can end caregiver access by ending or revoking an active sharing window.
FR5: The system can automatically expire caregiver access when the sharing window ends.
FR6: Parents can create and manage a child profile.
FR7: Parents can set a diet protocol type for a child (MVP: ketogenic, modified Atkins).
FR8: Parents can define and update child-specific macro targets.
FR9: The system can preserve a timestamped history of target-setting changes for each child, including actor identity and previous and new values.
FR10: Parents can add/select food items for menu planning.
FR11: The system can validate nutrition data coherence before allowing compliant planning.
FR12: The system can reject invalid or incomplete nutrition data with actionable feedback.
FR13: The system can calculate menu-level macro totals from selected meal items.
FR14: The system can assess whether a menu is compliant with child targets.
FR15: Parents can create daily menus composed of meal items.
FR16: Parents can update draft menus before lock.
FR17: Parents can lock a menu to freeze its executable content.
FR18: The system can prevent modification of locked menus by non-parent actors.
FR19: The system can preserve historical locked menus for later review.
FR20: Parents can create a bounded sharing window for one or more locked menus.
FR21: Caregivers can view shared locked menus in read-only mode.
FR22: Caregivers can confirm meal execution through checklist actions.
FR23: Parents can view caregiver checklist updates linked to shared menus.
FR24: The system can display sharing state status (active, pending, expired, revoked).
FR25: The system can record access and sharing lifecycle events including share created, share activated, menu viewed, checklist updated, share revoked, and share expired.
FR26: Parents can review an event history relevant to delegated care periods.
FR27: The system can associate access and sharing lifecycle events with actor identity and timestamp.
FR28: The product can present non-prescriptive medical positioning in onboarding, macro configuration, sharing setup, and caregiver shared-view flows.
FR29: Parents can accept terms and responsibility boundaries before child onboarding, menu planning, and caregiver sharing actions.
FR30: The system can prevent sharing of non-compliant menus.
FR31: Parents can complete child onboarding, macro configuration, menu planning, menu lock, and sharing setup workflows on smartphone and tablet form factors.
FR32: Caregivers can complete shared-menu viewing and meal checklist confirmation workflows on smartphone and tablet form factors.
FR33: The product can provide responsive layouts for supported MVP device categories (mobile/tablet).
FR34: The system can support user-initiated data updates for MVP workflows.

### NonFunctional Requirements

NFR1: 95% of core parent actions (open day plan, validate menu, lock menu, create share window) complete within 2 seconds on standard mobile networks.
NFR2: 95% of caregiver core actions (open shared menu, mark checklist item) complete within 2 seconds.
NFR3: Initial authenticated app load completes within 3 seconds for typical MVP payload size on modern mobile devices.
NFR4: Server-side compliance validation responses complete within 1 second for typical daily menus.
NFR5: All sensitive data is encrypted in transit using industry-standard secure protocols and encrypted at rest in persistent storage.
NFR6: Role-based access control is enforced server-side for every protected action.
NFR7: Caregiver role is strictly read-only for menu content; unauthorized mutation attempts are denied and logged.
NFR8: Authentication state handling must enforce secure expiration and invalidation behavior.
NFR9: Critical security events (auth failures, access denials, permission violations) are audit logged.
NFR10: The system achieves 99.5% monthly availability for MVP production service windows.
NFR11: Locked menu integrity is preserved across failures and retries (no partial lock states).
NFR12: Sharing window state transitions (active/expired/revoked) are deterministic and recoverable after restart.
NFR13: Data persistence for child targets, locked menus, and checklist events is durable and recoverable.
NFR14: Core parent/caregiver MVP flows meet WCAG 2.1 AA baseline.
NFR15: Interactive controls in critical kitchen flows provide touch-target sizing appropriate for mobile use.
NFR16: Error and validation states are communicated with accessible text, not color alone.
NFR17: Keyboard/focus navigation is supported for core authenticated flows.
NFR18: MVP architecture supports at least 10x growth from initial pilot user baseline without major redesign.
NFR19: Performance degradation remains under 10% under projected MVP growth load profile.
NFR20: Read-heavy caregiver access periods do not materially degrade parent planning operations.
NFR21: Internal service interface contracts remain stable and versionable to support future external integrations.
NFR22: Data model and event semantics are structured to enable future healthcare/professional integrations without breaking MVP workflows.
NFR23: Export and data interchange paths use documented formats to support future interoperability work.

### Additional Requirements

- Starter template and initialization are mandatory as the first implementation story:
  - Frontend: `npm create vite@latest kalculo-web -- --template react-ts`
  - Backend: `cargo generate --git https://github.com/thesurlydev/axum-template.git --name kalculo-api`
- Architecture baseline is mandatory: DDD + Clean/Hexagonal + strict CQS + SOLID + Tell, Don't Ask + Screaming Architecture.
- Commands and queries must be strictly separated; a use case must never call another use case directly.
- Boundary validation policy is mandatory on front and back:
  - frontend repository payloads are untrusted and parsed/validated before typing,
  - backend adapter outputs are validated/mapped before entering domain.
- TDD is mandatory with acceptance-oriented unit tests mapped from story Gherkin scenarios.
- Test double policy: prefer in-memory/stubs; mocks only for third-party integrations.
- Architecture fitness checks in CI are required to enforce layering, context boundaries, and anti-generic-service rules.
- Cross-context communication must use explicit contracts/ACL/events with versioning policy for breaking changes.
- Mandatory lock-before-share policy and prevention of sharing non-compliant menus.
- Deterministic and auditable lifecycle for sharing windows (activation, revocation, expiry).
- Reliable event logging for critical actions: lock, share, access, checklist updates, expiry, permission/security events.
- Mobile-first responsive implementation for phone + tablet with fast critical-path interactions and clear status-first feedback.
- UX requires explicit, persistent status communication (`conforme/non conforme`, `verrouille`, `partage actif/expire/revoque`).
- Role-adaptive UX is required:
  - parent: richer planning/control workflows,
  - caregiver: simplified read-only execution flows.
- Accessibility baseline: WCAG 2.1 AA on critical flows, non-color-only status meaning, keyboard/focus support, accessible error messaging.
- Browser/device compatibility target: latest stable Chrome/Safari/Firefox/Edge with emphasis on iOS Safari and Android Chrome.
- No real-time sync requirement in MVP; refresh-driven data freshness strategy must be clearly communicated in UI.
- Sensitive healthcare-related data handling must follow privacy-by-design, secure transport, secure at-rest storage, and auditable access patterns.
- Non-prescriptive medical framing and explicit responsibility boundaries are required in onboarding and sharing contexts.

### FR Coverage Map

FR1: Epic 1 - compte parent securise
FR2: Epic 4 - acces aidant uniquement par delegation
FR3: Epic 1 - RBAC parent/aidant
FR4: Epic 4 - revocation d'acces aidant
FR5: Epic 4 - expiration automatique partage
FR6: Epic 1 - creation/gestion profil enfant
FR7: Epic 1 - choix protocole dietetique
FR8: Epic 1 - configuration cibles macros
FR9: Epic 1 - historisation des changements de cibles
FR10: Epic 2 - ajout/selection aliments
FR11: Epic 2 - validation coherence nutritionnelle
FR12: Epic 2 - rejet donnees invalides avec feedback
FR13: Epic 2 - calcul total macros menu
FR14: Epic 2 - evaluation conformite menu
FR15: Epic 2 - creation menu quotidien
FR16: Epic 2 - edition brouillon avant lock
FR17: Epic 3 - verrouillage menu
FR18: Epic 3 - blocage modifications non parent
FR19: Epic 3 - conservation historique menus verrouilles
FR20: Epic 4 - creation fenetre de partage bornee
FR21: Epic 4 - vue aidant en lecture seule
FR22: Epic 5 - checklist d'execution aidant
FR23: Epic 5 - visibilite parent des confirmations aidant
FR24: Epic 4 - statuts de partage (active, pending, expired, revoked)
FR25: Epic 5 - journalisation evenements de partage/execution
FR26: Epic 5 - consultation historique d'evenements parent
FR27: Epic 5 - association evenements avec acteur et timestamp
FR28: Epic 1 - framing non-prescriptif medical
FR29: Epic 1 - acceptation des responsabilites/termes
FR30: Epic 2 - empecher partage si non conforme
FR31: Epic 6 - flows parent complets sur mobile/tablette
FR32: Epic 6 - flows aidant complets sur mobile/tablette
FR33: Epic 6 - layouts responsive MVP
FR34: Epic 6 - rafraichissement utilisateur des donnees MVP

## Epic List

### Epic 1: Onboarding parent et cadre de confiance
Permettre au parent de creer son compte, configurer le profil enfant et les cibles nutritionnelles, tout en posant clairement les limites de responsabilite du produit.
**FRs covered:** FR1, FR3, FR6, FR7, FR8, FR9, FR28, FR29

### Epic 2: Planification nutritionnelle conforme (brouillon)
Permettre au parent de composer un menu, calculer automatiquement les macros, detecter les incoherences et corriger avant validation finale.
**FRs covered:** FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR30

### Epic 3: Verrouillage de menu et integrite d'execution
Permettre au parent de verrouiller un menu executable, preserver son historique, et empecher toute modification non autorisee.
**FRs covered:** FR17, FR18, FR19

### Epic 4: Partage aidant gouverne et borne dans le temps
Permettre au parent de deleguer en toute securite via partage temporaire, statut explicite, revocation et expiration automatique.
**FRs covered:** FR2, FR4, FR5, FR20, FR21, FR24

### Epic 5: Execution aidant et visibilite parent
Permettre a l'aidant d'executer le menu en lecture seule avec checklist, pendant que le parent suit l'avancement et les evenements cles.
**FRs covered:** FR22, FR23, FR25, FR26, FR27

### Epic 6: Experience mobile/tablette complete et fraicheur des donnees
Garantir que les flows parent et aidant sont utilisables de bout en bout sur mobile/tablette avec UX responsive et rafraichissement utilisateur fiable.
**FRs covered:** FR31, FR32, FR33, FR34

## Epic 1: Onboarding parent et cadre de confiance

Permettre au parent de creer son compte, configurer le profil enfant et les cibles nutritionnelles, tout en posant clairement les limites de responsabilite du produit.

### Story 1.1: Initialiser le frontend avec simulation in-memory

As a membre de l'equipe produit,
I want initialiser `kalculo-web` (Vite React TS) avec une couche de donnees simulees (stubs/in-memory),
So that les stories metier frontend avancent immediatement sans dependre du backend, tout en restant conformes Clean Architecture/SOLID.

**FRs implemented:** FR31, FR33
**Additional requirement:** Front-first execution strategy with architecture guardrails

**Acceptance Criteria:**

**Given** un depot d'implementation vide cote frontend
**When** les commandes d'initialisation frontend officielles sont executees
**Then** `kalculo-web` est cree avec scripts de base operationnels (`dev`, `build`)
**And** une strategie de simulation est en place via stubs/in-memory derriere des ports/adapters
**And** les composants UI consomment des contrats applicatifs stables sans couplage direct a une API HTTP reelle
**And** les conventions d'architecture sont documentees: DDD/Clean layering, CQS strict, validation de frontiere, TDD par acceptance tests

### Story 1.2: Creer un compte parent avec authentification securisee

As a parent,
I want creer un compte et me connecter de facon securisee,
So that je puisse acceder a mon espace de planification.

**FRs implemented:** FR1, FR3

**Acceptance Criteria:**

**Given** un utilisateur non authentifie
**When** il soumet une inscription valide puis se connecte
**Then** un compte parent est cree et une session authentifiee est etablie
**And** les erreurs d'authentification sont explicites sans exposer de details sensibles

### Story 1.3: Accepter les termes et limites de responsabilite

As a parent,
I want accepter explicitement les termes et limites de responsabilite du produit,
So that le cadre non-prescriptif medical soit clair avant l'usage critique.

**FRs implemented:** FR28, FR29

**Acceptance Criteria:**

**Given** un parent au premier usage d'un flow critique
**When** il n'a pas encore accepte les termes requis
**Then** le systeme bloque la progression et affiche le consentement obligatoire
**And** l'acceptation est journalisee avec horodatage et identite de l'acteur

### Story 1.4: Gerer le profil enfant et le protocole dietetique

As a parent,
I want creer/modifier un profil enfant et definir le protocole dietetique,
So that la planification nutritionnelle soit contextualisee correctement.

**FRs implemented:** FR6, FR7

**Acceptance Criteria:**

**Given** un parent authentifie
**When** il cree ou met a jour un profil enfant avec un protocole autorise
**Then** le profil est persiste et reutilisable dans les flows de planification
**And** toute valeur invalide est rejetee avec message de correction actionnable

### Story 1.5: Configurer les cibles macros avec historique versionne

As a parent,
I want definir et ajuster les cibles macros d'un enfant,
So that les calculs de conformite reflentent les besoins actuels en gardant une trace des changements.

**FRs implemented:** FR8, FR9

**Acceptance Criteria:**

**Given** un profil enfant existant
**When** le parent enregistre de nouvelles cibles macros
**Then** les cibles actives sont mises a jour pour les prochains calculs
**And** un historique timestamped conserve ancienne valeur, nouvelle valeur et acteur

### Story 1.6: Initialiser le backend Axum en base technique isolee

As a membre de l'equipe produit,
I want initialiser `kalculo-api` (Axum template) comme base backend independante,
So that l'equipe puisse preparer les cas d'usage serveur et les politiques de validation sans bloquer l'avancement frontend.

**FRs implemented:** FR31, FR33
**Additional requirement:** Backend bootstrap deferred after frontend baseline

**Acceptance Criteria:**

**Given** un environnement Rust/Cargo pret
**When** les commandes d'initialisation backend officielles sont executees
**Then** `kalculo-api` est cree avec build/check/tests de base operationnels
**And** la structure du backend respecte l'intention Clean/Hexagonal (adapters -> application -> domain)
**And** les conventions de validation de frontiere et de CQS sont documentees avant implementation metier

### Story 1.7: Integrer les contrats frontend avec l'API reelle

As a membre de l'equipe produit,
I want remplacer les stubs/in-memory frontend par des adapters API reels,
So that le frontend conserve les memes cas d'usage et la meme UX tout en branchant la source de verite backend.

**FRs implemented:** FR1, FR6, FR8, FR10
**Additional requirement:** Contract-first migration from fake data to real backend

**Acceptance Criteria:**

**Given** un frontend fonctionnel sur donnees simulees et un backend bootstrappe
**When** les adapters d'infrastructure API sont implementes
**Then** les use cases frontend restent inchanges (seule l'implementation des ports change)
**And** les tests de non-regression valident que le comportement metier reste identique
**And** un mode fallback in-memory est disponible pour les tests et le developpement local sans dependance externe

## Epic 2: Planification nutritionnelle conforme (brouillon)

Permettre au parent de composer un menu, calculer automatiquement les macros, detecter les incoherences et corriger avant validation finale.

### Story 2.1: Ajouter et selectionner des aliments pour un menu

As a parent,
I want rechercher/ajouter des aliments a un menu quotidien,
So that je puisse composer les repas sans calcul manuel externe.

**FRs implemented:** FR10

**Acceptance Criteria:**

**Given** un menu du jour en brouillon
**When** le parent ajoute ou selectionne des aliments avec quantites
**Then** les lignes de repas sont enregistrees dans le brouillon
**And** chaque ligne conserve les donnees nutritionnelles necessaires au calcul

### Story 2.2: Valider la coherence nutritionnelle des donnees aliments

As a parent,
I want que le systeme valide la coherence des donnees nutritionnelles,
So that des donnees incompletes ou incoherentes ne puissent pas compromettre la conformite.

**FRs implemented:** FR11, FR12

**Acceptance Criteria:**

**Given** des donnees aliments incompletes ou incoherentes
**When** le parent tente de les utiliser pour la planification
**Then** le systeme bloque l'usage de ces donnees pour la conformite
**And** un feedback indique la cause et l'action de correction attendue

### Story 2.3: Creer et modifier un menu quotidien en mode brouillon

As a parent,
I want creer et modifier librement un menu tant qu'il n'est pas verrouille,
So that je puisse iterer rapidement avant validation finale.

**FRs implemented:** FR15, FR16

**Acceptance Criteria:**

**Given** un menu en etat brouillon
**When** le parent modifie des repas, portions ou ordre
**Then** les changements sont enregistres immediatement dans le brouillon
**And** le menu reste editable jusqu'au verrouillage explicite

### Story 2.4: Calculer les totaux macros et afficher la conformite

As a parent,
I want voir les totaux macros et le statut conforme/non conforme en temps reel applicatif,
So that je puisse corriger rapidement avant verrouillage.

**FRs implemented:** FR13, FR14

**Acceptance Criteria:**

**Given** un menu brouillon avec aliments valides
**When** un calcul de conformite est lance
**Then** le systeme retourne les totaux macros et le statut de conformite
**And** les ecarts par rapport aux cibles sont visibles de facon exploitable

### Story 2.5: Bloquer le partage des menus non conformes

As a parent,
I want etre empeche de partager un menu non conforme,
So that aucune delegation risquee ne soit possible.

**FRs implemented:** FR30

**Acceptance Criteria:**

**Given** un menu marque non conforme
**When** le parent tente d'ouvrir un flow de partage
**Then** le systeme refuse l'action de partage
**And** le message indique clairement les corrections necessaires avant partage

## Epic 3: Verrouillage de menu et integrite d'execution

Permettre au parent de verrouiller un menu executable, preserver son historique, et empecher toute modification non autorisee.

### Story 3.1: Verrouiller un menu conforme

As a parent,
I want verrouiller explicitement un menu conforme,
So that son contenu d'execution soit fige avant delegation.

**FRs implemented:** FR17

**Acceptance Criteria:**

**Given** un menu conforme en brouillon
**When** le parent confirme l'action de verrouillage
**Then** le menu passe a l'etat verrouille
**And** toute tentative d'edition ulterieure du brouillon d'origine est bloquee

### Story 3.2: Enforcer l'immutabilite pour les acteurs non parent

As a parent,
I want que les acteurs non parent ne puissent jamais modifier un menu verrouille,
So that les frontieres de responsabilite restent strictes.

**FRs implemented:** FR18

**Acceptance Criteria:**

**Given** un menu verrouille
**When** un acteur non parent tente une mutation
**Then** l'operation est refusee cote serveur
**And** l'evenement d'acces refuse est journalise

### Story 3.3: Conserver et consulter l'historique des menus verrouilles

As a parent,
I want retrouver les menus verrouilles precedents,
So that je puisse verifier des executions passees et reutiliser le contexte.

**FRs implemented:** FR19

**Acceptance Criteria:**

**Given** plusieurs menus verrouilles existants
**When** le parent ouvre la vue historique
**Then** les menus sont listes avec date, enfant et statut
**And** le detail d'un menu verrouille reste consultable en lecture seule

## Epic 4: Partage aidant gouverne et borne dans le temps

Permettre au parent de deleguer en toute securite via partage temporaire, statut explicite, revocation et expiration automatique.

### Story 4.1: Creer une fenetre de partage pour menus verrouilles

As a parent,
I want definir une fenetre temporelle de partage sur un ou plusieurs menus verrouilles,
So that la delegation soit strictement bornee dans le temps.

**FRs implemented:** FR20, FR24

**Acceptance Criteria:**

**Given** au moins un menu verrouille
**When** le parent configure debut/fin de partage valides
**Then** une fenetre de partage est creee avec statut initial coherent
**And** les menus rattaches a la fenetre sont clairement identifies

### Story 4.2: Donner un acces aidant uniquement par delegation

As a parent,
I want partager via un mecanisme d'acces delegue securise,
So that l'aidant n'accede qu'au perimetre autorise.

**FRs implemented:** FR2

**Acceptance Criteria:**

**Given** une fenetre de partage active
**When** l'aidant utilise le mecanisme d'acces delegue
**Then** il accede uniquement aux menus explicitement partages
**And** aucun contenu non delegue n'est expose

### Story 4.3: Afficher les menus partages en lecture seule cote aidant

As a caregiver,
I want consulter les menus partages sans pouvoir les modifier,
So that je puisse executer correctement sans risque d'alteration.

**FRs implemented:** FR21

**Acceptance Criteria:**

**Given** un aidant avec acces valide
**When** il ouvre un menu partage
**Then** les informations de preparation sont visibles en lecture seule
**And** les actions de modification de contenu ne sont pas disponibles

### Story 4.4: Revoquer immediatement un partage actif

As a parent,
I want revoquer un partage actif a tout moment,
So that je reprenne le controle immediatement en cas de besoin.

**FRs implemented:** FR4, FR24

**Acceptance Criteria:**

**Given** une fenetre de partage active
**When** le parent confirme la revocation
**Then** l'acces aidant est coupe immediatement
**And** le statut du partage passe a `revoked` avec trace d'audit

### Story 4.5: Expirer automatiquement les partages arrives a echeance

As a parent,
I want que les partages expirent automatiquement a la fin de la fenetre,
So that aucune autorisation ne persiste au-dela de la periode prevue.

**FRs implemented:** FR5, FR24

**Acceptance Criteria:**

**Given** une fenetre de partage avec date de fin depassee
**When** le cycle de verification d'etat s'execute
**Then** le statut passe a `expired` de facon deterministe
**And** toute tentative d'acces ulterieure est refusee avec message explicite

## Epic 5: Execution aidant et visibilite parent

Permettre a l'aidant d'executer le menu en lecture seule avec checklist, pendant que le parent suit l'avancement et les evenements cles.

### Story 5.1: Confirmer l'execution des repas via checklist aidant

As a caregiver,
I want marquer les repas executes dans une checklist simple,
So that le parent sache ce qui a ete fait pendant la garde.

**FRs implemented:** FR22

**Acceptance Criteria:**

**Given** un menu partage actif en lecture seule
**When** l'aidant confirme un repas execute
**Then** l'etat de checklist est enregistre avec horodatage
**And** l'action reste limitee a la confirmation (sans edition du menu)

### Story 5.2: Visualiser cote parent les confirmations aidant

As a parent,
I want voir les confirmations de checklist en quasi temps reel applicatif,
So that je puisse suivre l'execution delegatee avec confiance.

**FRs implemented:** FR23

**Acceptance Criteria:**

**Given** des confirmations checklist ont ete saisies par l'aidant
**When** le parent ouvre la vue de suivi
**Then** les confirmations apparaissent avec statut et heure
**And** l'affichage distingue clairement repas fait et restant

### Story 5.3: Journaliser les evenements critiques de delegation

As a parent,
I want que les evenements critiques de partage et d'acces soient traces,
So that je puisse auditer les periodes de delegation sensibles.

**FRs implemented:** FR25, FR27

**Acceptance Criteria:**

**Given** des actions critiques (partage, acces, checklist, revocation, expiration)
**When** ces actions se produisent
**Then** un evenement d'audit est ecrit avec acteur, timestamp, type et contexte
**And** les evenements refuses de securite sont egalement traces

### Story 5.4: Consulter l'historique d'evenements sur une periode de garde

As a parent,
I want filtrer l'historique des evenements par periode de delegation,
So that je puisse verifier rapidement qui a fait quoi et quand.

**FRs implemented:** FR26

**Acceptance Criteria:**

**Given** un historique d'evenements existant
**When** le parent filtre par fenetre de garde
**Then** seuls les evenements pertinents sont affiches
**And** chaque entree expose au minimum action, acteur et horodatage

## Epic 6: Experience mobile/tablette complete et fraicheur des donnees

Garantir que les flows parent et aidant sont utilisables de bout en bout sur mobile/tablette avec UX responsive et rafraichissement utilisateur fiable.

### Story 6.1: Livrer une interface responsive parent et aidant (mobile/tablette)

As a utilisateur mobile de Kalculo,
I want des ecrans adaptes smartphone et tablette pour tous les flows MVP critiques,
So that je puisse agir rapidement dans un contexte cuisine.

**FRs implemented:** FR31, FR32, FR33

**Acceptance Criteria:**

**Given** un appareil mobile ou tablette supporte
**When** l'utilisateur parcourt les flows critiques
**Then** la mise en page reste lisible, exploitable et coherente
**And** les controles critiques respectent une taille tactile appropriee

### Story 6.2: Atteindre les cibles de performance sur actions critiques

As a parent ou aidant,
I want des actions critiques rapides et predictibles,
So that l'utilisation reste fluide meme sous pression temporelle.

**FRs implemented:** FR31, FR32
**NFRs implemented:** NFR1, NFR2, NFR3, NFR4

**Acceptance Criteria:**

**Given** des conditions reseau mobiles standards
**When** un utilisateur execute les actions critiques definies MVP
**Then** les seuils de performance NFR cibles sont respectes
**And** les depassements de seuil sont instrumentes pour suivi

### Story 6.3: Gerer la fraicheur de donnees via rafraichissement utilisateur

As a parent ou aidant,
I want pouvoir rafraichir les donnees de facon explicite,
So that je consulte un etat fiable sans infrastructure temps reel.

**FRs implemented:** FR34

**Acceptance Criteria:**

**Given** une vue dont les donnees peuvent evoluer
**When** l'utilisateur declenche un rafraichissement
**Then** la vue recharge les donnees a jour et affiche un retour d'etat clair
**And** le produit indique explicitement que la fraicheur repose sur refresh en MVP

### Story 6.4: Satisfaire le baseline accessibilite WCAG 2.1 AA sur flows critiques

As a utilisateur avec besoins d'accessibilite,
I want une experience compatible avec les exigences WCAG AA sur les flows critiques,
So that je puisse utiliser le produit sans barriere majeure.

**FRs implemented:** FR31, FR32, FR33
**NFRs implemented:** NFR14, NFR15, NFR16, NFR17

**Acceptance Criteria:**

**Given** les flows critiques parent et aidant
**When** ils sont testes avec criteres accessibilite MVP
**Then** le contraste, la navigation clavier/focus et les messages d'erreur sont conformes
**And** les statuts critiques ne reposent pas uniquement sur la couleur
