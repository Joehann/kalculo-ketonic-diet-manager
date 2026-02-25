import type { Terms } from '../../domain/TermsAcceptance'
import type { TermsStoragePort } from '../../application/ports/TermsStoragePort'

const DEFAULT_TERMS: Terms = {
  version: '1.0',
  text: `Non-Prescriptive Medical Disclaimer

Kalculo is a nutrition and meal planning application designed to help caregivers manage dietary protocols. This application is NOT a medical device and does not provide medical advice, diagnosis, or treatment.

The nutritional calculations and macro-nutrient tracking provided by Kalculo are for informational purposes only. Users must consult with qualified healthcare professionals (physicians, registered dietitians) before implementing any dietary changes, especially for children with special dietary needs or medical conditions.

Liability Boundaries

Kalculo and its developers assume no responsibility for:
- Nutritional accuracy or completeness of calculations
- Adverse effects from following meal plans created in Kalculo
- Medical complications arising from dietary changes
- Misuse or misinterpretation of nutritional data

User Responsibility

By using Kalculo, you acknowledge that:
- Meal planning decisions should be made under professional healthcare guidance
- You are responsible for verifying all nutritional information independently
- You assume all risks associated with using this application
- Healthcare professionals retain authority over all dietary recommendations

For medical guidance, please consult appropriate healthcare providers.`,
}

export class InMemoryTermsStorageAdapter implements TermsStoragePort {
  async getCurrentTerms(): Promise<Terms> {
    return DEFAULT_TERMS
  }

  async getTermsByVersion(version: string): Promise<Terms | null> {
    if (version === DEFAULT_TERMS.version) {
      return DEFAULT_TERMS
    }
    return null
  }
}
