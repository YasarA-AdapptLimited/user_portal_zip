import { RenewalStatus } from './RenewalStatus';
import { RenewalPaymentMethod  } from './RenewalPaymentMethod';
import { Payment } from '../../payment/model/Payment';

export interface Renewal {
  revalidationCompleted: boolean;
  paymentMethod: RenewalPaymentMethod;
  isRenewable?: boolean;
  renewalDate: string;
  windowCloseDate: string;
  status: RenewalStatus;
  isCash: boolean;
  isDD: boolean;
  isDue: boolean;
  notDue: boolean;
  isComplete: boolean;
  selectedCard: string;
  agreed: boolean;
  renewalFee: number;
}
