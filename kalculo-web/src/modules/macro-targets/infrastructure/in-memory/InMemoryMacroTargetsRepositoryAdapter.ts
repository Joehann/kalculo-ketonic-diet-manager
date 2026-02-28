import type { MacroTargetsRepositoryPort } from '../../application/ports/MacroTargetsRepositoryPort'
import type {
  MacroTargets,
  MacroTargetsHistoryEntry,
} from '../../domain/MacroTargets'

export class InMemoryMacroTargetsRepositoryAdapter
  implements MacroTargetsRepositoryPort
{
  private readonly activeByChildId = new Map<string, MacroTargets>()
  private readonly historyByChildId = new Map<string, MacroTargetsHistoryEntry[]>()

  async findActiveByChildId(childId: string): Promise<MacroTargets | null> {
    return this.activeByChildId.get(childId) ?? null
  }

  async saveActive(targets: MacroTargets): Promise<void> {
    this.activeByChildId.set(targets.childId, targets)
  }

  async appendHistory(entry: MacroTargetsHistoryEntry): Promise<void> {
    const currentHistory = this.historyByChildId.get(entry.childId) ?? []
    this.historyByChildId.set(entry.childId, [entry, ...currentHistory])
  }

  async listHistoryByChildId(childId: string): Promise<MacroTargetsHistoryEntry[]> {
    return this.historyByChildId.get(childId) ?? []
  }
}
