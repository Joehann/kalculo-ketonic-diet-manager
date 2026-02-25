import { describe, expect, it } from 'vitest'
import { buildCheckTermsAcceptanceQuery } from './checkTermsAcceptanceQuery'
import type { TermsAcceptanceRepositoryPort } from '../ports/TermsAcceptanceRepositoryPort'
import type { TermsStoragePort } from '../ports/TermsStoragePort'
import { TermsNotAcceptedError } from '../../domain/errors/TermsError'

describe('CheckTermsAcceptanceQuery', () => {
  it('returns true when parent has accepted current terms version', async () => {
    const repositoryPort: TermsAcceptanceRepositoryPort = {
      async save() {},
      async findByParentId() {
        return {
          parentId: 'parent-1',
          acceptedAt: new Date(),
          termsVersion: '1.0',
        }
      },
    }

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return {
          version: '1.0',
          text: 'Terms text',
        }
      },
      async getTermsByVersion() {
        return null
      },
    }

    const query = buildCheckTermsAcceptanceQuery(repositoryPort, storagePort)
    const result = await query('parent-1')

    expect(result).toBe(true)
  })

  it('throws TermsNotAcceptedError when parent has not accepted terms', async () => {
    const repositoryPort: TermsAcceptanceRepositoryPort = {
      async save() {},
      async findByParentId() {
        return null
      },
    }

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return {
          version: '1.0',
          text: 'Terms text',
        }
      },
      async getTermsByVersion() {
        return null
      },
    }

    const query = buildCheckTermsAcceptanceQuery(repositoryPort, storagePort)

    await expect(query('parent-1')).rejects.toThrow(TermsNotAcceptedError)
  })

  it('throws TermsNotAcceptedError when terms version has been updated', async () => {
    const repositoryPort: TermsAcceptanceRepositoryPort = {
      async save() {},
      async findByParentId() {
        return {
          parentId: 'parent-1',
          acceptedAt: new Date(),
          termsVersion: '1.0',
        }
      },
    }

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return {
          version: '1.1',
          text: 'Updated terms text',
        }
      },
      async getTermsByVersion() {
        return null
      },
    }

    const query = buildCheckTermsAcceptanceQuery(repositoryPort, storagePort)

    await expect(query('parent-1')).rejects.toThrow(TermsNotAcceptedError)
  })
})
