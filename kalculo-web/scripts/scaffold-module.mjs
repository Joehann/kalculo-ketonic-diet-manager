import { mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'

const [, , moduleNameArg] = process.argv

if (!moduleNameArg) {
  console.error('Usage: npm run scaffold:module -- <module-name>')
  process.exit(1)
}

const moduleName = moduleNameArg.trim().toLowerCase()
const modulePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

if (!modulePattern.test(moduleName)) {
  console.error(
    'Invalid module name. Use kebab-case only (example: parent-auth).',
  )
  process.exit(1)
}

const projectRoot = process.cwd()
const moduleRoot = path.join(projectRoot, 'src', 'modules', moduleName)

const toPascalCase = (value) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

const modulePascal = toPascalCase(moduleName)

const filesToCreate = [
  {
    relativePath: 'domain/ExampleAggregate.ts',
    content: `export type ${modulePascal}ExampleAggregate = {
  id: string
  label: string
}
`,
  },
  {
    relativePath: 'application/ports/LoadExampleQueryPort.ts',
    content: `import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'

export interface LoadExampleQueryPort {
  loadById(id: string): Promise<${modulePascal}ExampleAggregate | null>
}
`,
  },
  {
    relativePath: 'application/ports/SaveExampleCommandPort.ts',
    content: `import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'

export interface SaveExampleCommandPort {
  save(example: ${modulePascal}ExampleAggregate): Promise<void>
}
`,
  },
  {
    relativePath: 'application/queries/loadExampleQuery.ts',
    content: `import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'
import type { LoadExampleQueryPort } from '../ports/LoadExampleQueryPort'

export type LoadExampleQuery = (
  id: string,
) => Promise<${modulePascal}ExampleAggregate | null>

export const buildLoadExampleQuery =
  (queryPort: LoadExampleQueryPort): LoadExampleQuery =>
  async (id) => {
    if (!id.trim()) {
      throw new Error('id is required')
    }

    return queryPort.loadById(id)
  }
`,
  },
  {
    relativePath: 'application/commands/saveExampleCommand.ts',
    content: `import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'
import type { SaveExampleCommandPort } from '../ports/SaveExampleCommandPort'

export type SaveExampleCommand = (
  payload: ${modulePascal}ExampleAggregate,
) => Promise<void>

export const buildSaveExampleCommand =
  (commandPort: SaveExampleCommandPort): SaveExampleCommand =>
  async (payload) => {
    if (!payload.id.trim()) {
      throw new Error('id is required')
    }

    await commandPort.save(payload)
  }
`,
  },
  {
    relativePath: 'infrastructure/in-memory/InMemoryLoadExampleQueryAdapter.ts',
    content: `import type { LoadExampleQueryPort } from '../../application/ports/LoadExampleQueryPort'
import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'

const examples: Record<string, ${modulePascal}ExampleAggregate> = {
  demo: { id: 'demo', label: '${modulePascal} demo' },
}

export class InMemoryLoadExampleQueryAdapter implements LoadExampleQueryPort {
  async loadById(id: string): Promise<${modulePascal}ExampleAggregate | null> {
    return examples[id] ?? null
  }
}
`,
  },
  {
    relativePath: 'infrastructure/in-memory/InMemorySaveExampleCommandAdapter.ts',
    content: `import type { SaveExampleCommandPort } from '../../application/ports/SaveExampleCommandPort'
import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'

const storage = new Map<string, ${modulePascal}ExampleAggregate>()

export class InMemorySaveExampleCommandAdapter
  implements SaveExampleCommandPort
{
  async save(example: ${modulePascal}ExampleAggregate): Promise<void> {
    storage.set(example.id, example)
  }
}
`,
  },
  {
    relativePath: 'infrastructure/api/ApiLoadExampleQueryAdapter.ts',
    content: `import type { LoadExampleQueryPort } from '../../application/ports/LoadExampleQueryPort'
import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'

export class ApiLoadExampleQueryAdapter implements LoadExampleQueryPort {
  async loadById(_id: string): Promise<${modulePascal}ExampleAggregate | null> {
    throw new Error('Not implemented: API query adapter')
  }
}
`,
  },
  {
    relativePath: 'infrastructure/api/ApiSaveExampleCommandAdapter.ts',
    content: `import type { SaveExampleCommandPort } from '../../application/ports/SaveExampleCommandPort'
import type { ${modulePascal}ExampleAggregate } from '../../domain/ExampleAggregate'

export class ApiSaveExampleCommandAdapter implements SaveExampleCommandPort {
  async save(_example: ${modulePascal}ExampleAggregate): Promise<void> {
    throw new Error('Not implemented: API command adapter')
  }
}
`,
  },
  {
    relativePath: 'presentation/hooks/useExample.ts',
    content: `import { useState } from 'react'
import { useUseCases } from '../../../../app/providers/useUseCases'

export const use${modulePascal}Example = () => {
  const useCases = useUseCases()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      return await useCases.${moduleName.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())}.loadExampleQuery(
        id,
      )
    } catch (caught) {
      setError((caught as Error).message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { load, isLoading, error }
}
`,
  },
  {
    relativePath: 'index.ts',
    content: `import { buildLoadExampleQuery } from './application/queries/loadExampleQuery'
import { buildSaveExampleCommand } from './application/commands/saveExampleCommand'
import { ApiLoadExampleQueryAdapter } from './infrastructure/api/ApiLoadExampleQueryAdapter'
import { ApiSaveExampleCommandAdapter } from './infrastructure/api/ApiSaveExampleCommandAdapter'
import { InMemoryLoadExampleQueryAdapter } from './infrastructure/in-memory/InMemoryLoadExampleQueryAdapter'
import { InMemorySaveExampleCommandAdapter } from './infrastructure/in-memory/InMemorySaveExampleCommandAdapter'

export type ${modulePascal}DataSource = 'inmemory' | 'api'

export const build${modulePascal}UseCases = (dataSource: ${modulePascal}DataSource) => {
  const loadPort =
    dataSource === 'api'
      ? new ApiLoadExampleQueryAdapter()
      : new InMemoryLoadExampleQueryAdapter()
  const savePort =
    dataSource === 'api'
      ? new ApiSaveExampleCommandAdapter()
      : new InMemorySaveExampleCommandAdapter()

  return {
    loadExampleQuery: buildLoadExampleQuery(loadPort),
    saveExampleCommand: buildSaveExampleCommand(savePort),
  }
}
`,
  },
  {
    relativePath: 'README.md',
    content: `# ${modulePascal} Module

Scaffold generated by \`npm run scaffold:module -- ${moduleName}\`.

## Next steps

- Replace `ExampleAggregate` with real domain concepts.
- Replace API adapter placeholders with real infrastructure implementation.
- Wire this module in \`src/app/di/buildDiContainer.ts\`.
- Add module-specific tests from story Gherkin scenarios.
`,
  },
]

const fileExists = async (target) => {
  try {
    await access(target, constants.F_OK)
    return true
  } catch {
    return false
  }
}

const main = async () => {
  if (await fileExists(moduleRoot)) {
    console.error(`Module already exists: ${moduleRoot}`)
    process.exit(1)
  }

  for (const file of filesToCreate) {
    const targetPath = path.join(moduleRoot, file.relativePath)
    await mkdir(path.dirname(targetPath), { recursive: true })
    await writeFile(targetPath, file.content, 'utf8')
  }

  console.log(`Module scaffold created at src/modules/${moduleName}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
