import { FormTemplate } from '../../dynamic/model/FormTemplate'

interface RenewalConfigSection {
  declarationForm: FormTemplate;
}

export interface RenewalConfig {
  renewalFee: number;
  creditCardSurchargePercentage: number;
  continuingFitnessToPracticeDeclaration: RenewalConfigSection;
  renewalDeclaration: RenewalConfigSection;
}
