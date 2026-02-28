import type { MacroTargets } from '../../../macro-targets/domain/MacroTargets'

export interface MacroTargetsQueryPort {
  getActiveByChildId(childId: string): Promise<MacroTargets>
}
