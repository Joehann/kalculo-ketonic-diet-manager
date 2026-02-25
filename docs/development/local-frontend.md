# Local Frontend Commands

This project currently runs frontend-only with fake in-memory data.

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
cd kalculo-web
npm install
```

## Run in Development

```bash
cd kalculo-web
npm run dev
```

## Select Data Source

Use `VITE_DATA_SOURCE` to switch adapter implementations from the composition root:

```bash
# default (if unset): inmemory
VITE_DATA_SOURCE=inmemory npm run dev

# future API mode
VITE_DATA_SOURCE=api npm run dev
```

## Build

```bash
cd kalculo-web
npm run build
```

## Lint

```bash
cd kalculo-web
npm run lint
```

## Tests

```bash
cd kalculo-web
npm test
```

## Scaffold a new bounded-context module

```bash
cd kalculo-web
npm run scaffold:module -- parent-auth
```
