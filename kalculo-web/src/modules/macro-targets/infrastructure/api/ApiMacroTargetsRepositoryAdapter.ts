import type { MacroTargetsRepositoryPort } from '../../application/ports/MacroTargetsRepositoryPort'
import type {
  MacroTargets,
  MacroTargetsHistoryEntry,
} from '../../domain/MacroTargets'

export class ApiMacroTargetsRepositoryAdapter implements MacroTargetsRepositoryPort {
  async findActiveByChildId(_childId: string): Promise<MacroTargets | null> {
    void _childId
    throw new Error('Not implemented: API macro targets repository adapter')
  }

  async saveActive(_targets: MacroTargets): Promise<void> {
    void _targets
    throw new Error('Not implemented: API macro targets repository adapter')
  }

  async appendHistory(_entry: MacroTargetsHistoryEntry): Promise<void> {
    void _entry
    throw new Error('Not implemented: API macro targets repository adapter')
  }

  async listHistoryByChildId(_childId: string): Promise<MacroTargetsHistoryEntry[]> {
    void _childId
    throw new Error('Not implemented: API macro targets repository adapter')
  }
}
