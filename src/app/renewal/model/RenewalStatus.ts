export enum RenewalStatus {
  Unknown = 0,
  NotDue = 1,
  Pending = 717750000,
  DDPaymentPending = 717750001,
  DDPaymentProcessing = 717750006,
  Complete = 717750002,
  DDDeclarationMissed = 717750003,
  DDPaymentFailed = 717750004,
  RenewalDeadlineMissed = 717750005,
  PaymentInProgress = -1
}
