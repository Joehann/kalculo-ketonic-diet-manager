import type { Parent } from '../../domain/Parent'
import type { ParentRepositoryPort } from '../../application/ports/ParentRepositoryPort'

const parents: Parent[] = [
  {
    id: 'parent-test-1',
    email: 'demo@example.com',
    passwordHash: 'hashed-demo-password',
    role: 'parent',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
]

export class InMemoryParentRepositoryAdapter implements ParentRepositoryPort {
  async findByEmail(email: string): Promise<Parent | null> {
    return parents.find((p) => p.email === email.toLowerCase()) || null
  }

  async save(parent: Parent): Promise<void> {
    const existing = parents.findIndex((p) => p.id === parent.id)
    if (existing >= 0) {
      parents[existing] = parent
    } else {
      parents.push(parent)
    }
  }

  async findById(id: string): Promise<Parent | null> {
    return parents.find((p) => p.id === id) || null
  }
}
