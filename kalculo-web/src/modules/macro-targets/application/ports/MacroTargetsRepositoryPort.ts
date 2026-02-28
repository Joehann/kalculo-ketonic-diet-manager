import type {
  MacroTargets,
  MacroTargetsHistoryEntry,
} from '../../domain/MacroTargets'

export interface MacroTargetsRepositoryPort {
  findActiveByChildId(childId: string): Promise<MacroTargets | null>
  saveActive(targets: MacroTargets): Promise<void>
  appendHistory(entry: MacroTargetsHistoryEntry): Promise<void>
  listHistoryByChildId(childId: string): Promise<MacroTargetsHistoryEntry[]>
}
