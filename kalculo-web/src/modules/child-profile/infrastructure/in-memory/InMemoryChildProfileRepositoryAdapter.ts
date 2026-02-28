import type { ChildProfileRepositoryPort } from '../../application/ports/ChildProfileRepositoryPort'
import type { ChildProfile } from '../../domain/ChildProfile'

export class InMemoryChildProfileRepositoryAdapter
  implements ChildProfileRepositoryPort
{
  private readonly profilesByParentId = new Map<string, ChildProfile>()

  async findByParentId(parentId: string): Promise<ChildProfile | null> {
    return this.profilesByParentId.get(parentId) ?? null
  }

  async save(profile: ChildProfile): Promise<void> {
    this.profilesByParentId.set(profile.parentId, profile)
  }
}
