import { RenewalConfig } from '../../renewal/model/RenewalConfig';
import { Renewal } from '../../renewal/model/Renewal';
import { ServiceBase } from './service.base';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { RenewalStatus } from '../../renewal/model/RenewalStatus';
import { WorldpayCartId } from '../../renewal/model/WorldpayCartId';
import { WorldpayConfig } from '../../renewal/model/WorldpayConfig';
import { RenewalPaymentMethod } from '../../renewal/model/RenewalPaymentMethod';
import { FormTemplate } from '../../dynamic/model/FormTemplate';

export const pending = {
    revalidationCompleted: true,
    paymentMethod: RenewalPaymentMethod.PaymentCard,
    renewalDate: '2017-11-10',
    windowCloseDate: '2017-11-10',
    status: RenewalStatus.Pending,
    renewalFee: 250,
    isCash: true,
    isDD: false,
    isDue: true,
    isComplete: false,
    selectedCard: undefined,
    agreed: false,
    notDue: false
};

