import { PaymentIdentifier } from "./PaymentIdentifier";

export class RenewalPaymentResponse {
    renewalIdentifier: PaymentIdentifier;
    paymentRequired: boolean;
    worldpayUrl: string;
}