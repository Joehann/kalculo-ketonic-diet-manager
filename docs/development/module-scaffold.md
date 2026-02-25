# Module Scaffold (Frontend)

Use this command to generate a new bounded-context module skeleton in the frontend:

```bash
cd kalculo-web
npm run scaffold:module -- parent-auth
```

## What is generated

The scaffold creates:

- `domain` with a starter aggregate type.
- `application` with:
  - `queries` and `commands`
  - `*QueryPort` and `*CommandPort` interfaces
- `infrastructure` with:
  - `in-memory` adapters
  - `api` adapters (placeholders)
- `presentation/hooks` with a starter hook.
- `index.ts` module composition helper.
- `README.md` with next steps.

## Important integration step

After scaffold generation, register the module in:

- `kalculo-web/src/app/di/buildDiContainer.ts`

Only the composition root should choose adapter mapping (`inmemory` vs `api`).
