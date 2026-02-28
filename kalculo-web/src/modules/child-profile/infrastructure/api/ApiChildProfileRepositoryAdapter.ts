import type { ChildProfileRepositoryPort } from '../../application/ports/ChildProfileRepositoryPort'
import type { ChildProfile } from '../../domain/ChildProfile'

export class ApiChildProfileRepositoryAdapter
  implements ChildProfileRepositoryPort
{
  async findByParentId(_parentId: string): Promise<ChildProfile | null> {
    void _parentId
    throw new Error('Not implemented: API child profile repository adapter')
  }

  async save(_profile: ChildProfile): Promise<void> {
    void _profile
    throw new Error('Not implemented: API child profile repository adapter')
  }
}
