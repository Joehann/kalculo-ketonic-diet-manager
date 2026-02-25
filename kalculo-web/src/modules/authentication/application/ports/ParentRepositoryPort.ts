import type { Parent } from '../../domain/Parent'

export interface ParentRepositoryPort {
  findByEmail(email: string): Promise<Parent | null>
  save(parent: Parent): Promise<void>
  findById(id: string): Promise<Parent | null>
}
