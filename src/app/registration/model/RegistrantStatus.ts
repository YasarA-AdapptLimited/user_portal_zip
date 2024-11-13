export enum RegistrantStatus {
  // Student
  OSPAPClassList = 717750002,
  MPharmClassList = 717750003,
  MPharmClassListS = 717750013,

  // PreReg Trainee
  PreRegistrationTrainee = 717750000,
  PreRegistrationTraineeS = 717750014,
  ReadyForRegistration = 717750015,
  // Refused should be handled exactly as a PreRegistrationTrainee. Refused was
  // never handled in MyGPhC prior to ROS, but the requirements states that a
  // Refused user should have the same access to the system as a
  // PreRegistrationTrainee. This resulted in the bug:
  // https://mygphc.atlassian.net/browse/ROS-608
  // Stuart's spec for this change is in:
  // https://mygphc.atlassian.net/browse/ROS-611
  Refused = 981360002,

  Unknown = 0,
  OSPAPAssessment = 717750001,
  Registered = 717750006,
  Erased = 717750007,
  Suspended = 717750008,
  Terminated = 717750016,
  RemovedFailedToRenew = 717750009,
  RemovedCPDNonCompliance = 717750010,
  RemovedVoluntary = 717750011,
  Deleted = 717750012,
  TemporaryRegistration = 981360000,
  Applicant = 717750004,
  IneligibleToRegister = 717750005,
  // https://mygphc.atlassian.net/browse/RP2-105
  // Replaces RemovedCPDNonCompliance.
  RemovedRevalNonCompliance = 981360003
}
