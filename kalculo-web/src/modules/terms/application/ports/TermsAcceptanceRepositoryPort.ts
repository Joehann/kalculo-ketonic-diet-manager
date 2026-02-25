import type { TermsAcceptance } from '../../domain/TermsAcceptance'

export interface TermsAcceptanceRepositoryPort {
  save(acceptance: TermsAcceptance): Promise<void>
  findByParentId(parentId: string): Promise<TermsAcceptance | null>
}
