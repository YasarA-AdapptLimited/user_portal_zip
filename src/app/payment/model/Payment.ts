import { PaymentChannel } from './PaymentChannel';
import { PaymentStatus } from './PaymentStatus';

export class Payment {

    id: number;
    description: string;
    transactionTime: string;
    totalAmount: number;
    currency: string;
    paymentCard: number;
    paymentChannel: PaymentChannel;
    paymentNumber: string;
    status: PaymentStatus;

    constructor(receipt) {
      Object.assign(this, receipt);
    }
  }
