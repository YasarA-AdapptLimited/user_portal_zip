export enum PaymentStatus {
  Outstanding = 717750000,
  Paid = 717750001,
  // STEP BEFORE PAID or FAILED
  Called = 717750002,
  // DD CANCELLED, USER HAVE TO PAY BY CARD
  Cancelled = 717750003,
  // ALWAYS A FAILED DD PAYMENT
  Failed = 717750004
}
