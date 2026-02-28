import type { ChildProfile } from '../../domain/ChildProfile'

export interface ChildProfileRepositoryPort {
  findByParentId(parentId: string): Promise<ChildProfile | null>
  save(profile: ChildProfile): Promise<void>
}
