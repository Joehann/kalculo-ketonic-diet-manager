import { describe, expect, it } from 'vitest'
import { buildGetTermsTextQuery } from './getTermsTextQuery'
import type { TermsStoragePort } from '../ports/TermsStoragePort'
import type { Terms } from '../../domain/TermsAcceptance'

describe('GetTermsTextQuery', () => {
  it('returns current terms text and version', async () => {
    const termsData: Terms = {
      version: '1.0',
      text: 'Non-prescriptive medical disclaimer: This product is not a medical device...',
    }

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return termsData
      },
      async getTermsByVersion() {
        return null
      },
    }

    const query = buildGetTermsTextQuery(storagePort)
    const result = await query()

    expect(result.version).toBe('1.0')
    expect(result.text).toContain('Non-prescriptive medical disclaimer')
  })

  it('returns specific terms version if requested', async () => {
    const termsV1: Terms = {
      version: '1.0',
      text: 'Version 1.0 terms',
    }

    const storagePort: TermsStoragePort = {
      async getCurrentTerms() {
        return {
          version: '1.1',
          text: 'Version 1.1 terms',
        }
      },
      async getTermsByVersion(version) {
        if (version === '1.0') {
          return termsV1
        }
        return null
      },
    }

    const query = buildGetTermsTextQuery(storagePort)
    const result = await query('1.0')

    expect(result.version).toBe('1.0')
    expect(result.text).toBe('Version 1.0 terms')
  })
})
