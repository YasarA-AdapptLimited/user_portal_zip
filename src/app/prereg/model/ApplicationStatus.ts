export enum ApplicationStatus {
  NotStarted = 1,
  InProgress = 2,

  // ROS
  CounterSigned = 4,

  // ROS (= trainees) Registration Application was submitted to CRM 
  // PROS (= students) Pre-Registration Application was submitted to CRM 
  Submitted = 3,

  // ROS:Means that the countersigner has been selected for this form, and that the
  // from is ready to be countersigned by that pharmacist.
  ReadyForCountersigning = 5,

  // ROS: If ApplicationForRegistration status is changing to 'approved
  // pending first year fee', FormStatus is set to
  // ApprovedPendingFirstYearFee by PreEntry subscriber
  // If this flag is true then 'First Year Payment should be available in UI'.
  ApprovedPendingFirstYearFee = 6,

  // ROS: If ApplicationForRegistration status is changing to 'Ineligible', FormStatus is set to Ineligible by PreEntry subscriber
  // PROS: If PreRegStatus is changing to 'Ineligible' in CRM, the form should be read-only https://mygphc.atlassian.net/browse/PROS-279
  Ineligible = 7,

  // ROS: First Year Fee was paid but the form was not approved in CRM
  PendingProcessing = 10,

  // ROS (= trainees) Registration Application was approved in CRM and both
  // payments were made; at this stage user is ready to be a
  // pharmacist/pharmacy technician
  // PROS (= students) Pre-Registration Application  was approved in CRM
  Approved = 11,

  // PROS (= students) Pre-Registration Application was marked as 'Waiting for applicant' in CRM
  // https://mygphc.atlassian.net/browse/PROS-281
  WaitingForApplicant = 12,

  // PROS (= students) Pre-Registration Application was marked as terminated in CRM
  // https://mygphc.atlassian.net/browse/PROS-61
  Terminated = 13,

  // PROS: If PreRegStatus is changing to 'Ceased Training' in CRM, the
  // form should be read-only https://mygphc.atlassian.net/browse/PROS-279
  CeasedTraining = 14,

  Refused = 15,

  ApprovedPendingRestorationFee = 16,

  RestorationFeePaidPendingApproval = 17
}
