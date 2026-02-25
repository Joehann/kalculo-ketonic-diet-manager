import type { TermsAcceptance } from '../../domain/TermsAcceptance'
import type { TermsAcceptanceRepositoryPort } from '../../application/ports/TermsAcceptanceRepositoryPort'

const acceptances: TermsAcceptance[] = []

export class InMemoryTermsAcceptanceRepositoryAdapter
  implements TermsAcceptanceRepositoryPort {
  async save(acceptance: TermsAcceptance): Promise<void> {
    const existing = acceptances.findIndex((a) => a.parentId === acceptance.parentId)
    if (existing >= 0) {
      acceptances[existing] = acceptance
    } else {
      acceptances.push(acceptance)
    }
  }

  async findByParentId(parentId: string): Promise<TermsAcceptance | null> {
    return acceptances.find((a) => a.parentId === parentId) || null
  }
}
