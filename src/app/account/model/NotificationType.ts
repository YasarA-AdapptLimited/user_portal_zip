export enum NotificationType {
  Unknown = 0,
  RenewalReminder = 1,
  RenewalWindowOpening = 10,
  RevalidationReminder = 2,
  RevalidationReviewReminder = 3,
  RevalidationReviewBlockingReminder = 4,
  RevalidationReviewMessageReminder = 5,
  EmailChangeRequestNotification = 6,
  // ROS-252
  ApplicationApprovedPendingAssessmentNotification = 50,
  // ROS-256
  IneligibleBasedOnAssessmentNotification = 51,
  // ROS-157
  RegistrationPaymentRequiredNotification = 52,
  // ROS-255
  RegistryEntryNotification = 53,

  // ROS-249 - New Countersignature waiting for Pharmacist
  RegistrationFormCountersignatureRequested = 60,
  // ROS-250 - The countersigner countersigned.
  RegistrationFormCountersignatureApproved = 61,
  // ROS-516 - The countersigner refused to approve or reject for one reason or another.
  RegistrationFormCountersignatureRefused = 62,
  // ROS-251 - The countersigner rejected.
  RegistrationFormCountersignatureRejected = 63,
  // ROS-448 - Trainee recalled countersignature.
  RegistrationFormCountersignatureRecalled = 64,
  // ROS-633 - First year fee payment has been made
  RegistrationFormFirstYearFeeSuccessful = 65,
  // ROS-626 - Application fee successfully made
  RegistrationFormApplicationSubmitted = 66,

  // PROS (student & tutor) - learning contract notifications 
  PreRegistrationFormLearningContractSignatureRequested = 70,
  PreRegistrationFormLearningContractApproved = 71,
  PreRegistrationFormLearningContractRefused = 72,
  PreRegistrationFormLearningContractRejected = 73,
  PreRegistrationFormLearningContractRecalled = 74,
  PreRegistrationFormPaymentRequired = 75,
  // https://mygphc.atlassian.net/browse/PROS-4
  PreRegistrationFormApproved = 76,
  // https://mygphc.atlassian.net/browse/PROS-62
  PreRegistrationFormWaitingForApplicant = 77,
  // https://mygphc.atlassian.net/browse/PROS-61
  PreRegistrationFormTerminated = 78,
  PreRegistrationFormPaymentReceivedAndSubmitted = 101,
  PreRegistrationFormApprovedWelcomeLetter = 79,
  PreRegistrationFormLearningContractSignatureRequestedReminder = 102,


  ExtenuatingCircumstancesSent = 80,
  ExtenuatingCircumstancesApproved = 81,
  ExtenuatingCircumstancesPartiallyApproved = 82,
  ExtenuatingCircumstancesRejected = 83,
  RevalidationSubmissionSubmit = 84,
  //MAE-40: Added new Notificationtype for EC resubmission
  ExtenuatingCircumstancesRequestResubmit = 85,
  RevalidationSubmissionPartialSubmit = 86,
  RenewalRevalidationReminderSameDate = 90,
  RenewalRevalidationReminderPendingExtenuatingCircumstances = 91,
  RenewalRevalidationReminderExtensionGrantedRenewalDue = 92,
  RenewalRevalidationReminderExtensionGrantedRevalidationSubmissionDue = 93,
  RemediationEntered = 200,
  // Notification For When Registrant ends up in NoIR.
  NoIREntered = 201,

  // Notification for when NoR is issued on NoR dashboard
  NoRIssued = 202,
  TestNotification = 9999,

  RevalidationSelectedForReview = 20,
  RevalidationReviewFeedbackSent = 21,
  RevalidationReviewAvailable = 22,
  RevalidationReviewFeedbackRejected = 23,

  // technician notifications

  TechnicianApplicantCountersignatureRequested = 301,
  TechnicianApplicantCountersignatureApproved = 302,
  TechnicianApplicantCountersignatureRefused = 303,
  TechnicianApplicantCountersignatureRejected = 304,
  TechnicianApplicantCountersignatureRecalled = 305,
  TechnicianApplicantApplicationSubmitted = 306,
  TechnicianApplicantFirstYearFeePaymentSuccessful = 307,
  TechnicianApplicantFirstYearFeeAvailable = 308,
  TechnicianApplicantApplicationTerminated = 309,
  TechnicianApplicantNoticeOfEntry = 310,
  TechnicianApplicantApplicationWaitingForApplicant = 311,

  // AROS Notifications

  ProgressReportFormOpenNotification = 401,
  ProgressReportFormCountersignatureRequest = 402,
  ProgressReportFormCountersignatureRecalled = 403,
  ProgressReportFormCountersignatureApproved = 404,
  ProgressReportFormCountersignatureRefused = 405,
  ProgressReportFormCountersignatureRejected = 406,
  ProgressReportThirtNineWeekResultCleared = 407,
  ProgressReportTempRegistrationAccepted = 408,
  ProgressReportTempRegistrationRejected = 409,

  // Assessment Registration Notifictions
  AssessmentRegistrationApplicationAvailable = 420,
  AssessmentRegistrationApplicationPaymentSuccessful = 421,
  AssessmentAttemptApplicationApproved = 422,
  AssessmentAttemptResultPublished = 423,


  // 52 Week Final Declaration Notifications
  FiftyTwoWeekFinalDeclarationFormOpenNotification = 501,
  FinalDeclarationFormCountersignatureRequest = 502,
  FinalDeclarationFormCountersignatureRecalled = 503,
  FinalDeclarationFormCountersignatureApproved = 504,
  FinalDeclarationFormCountersignatureRefused = 505,
  FinalDeclarationFormCountersignatureRejected = 506,
  FinalDeclarationFormProvisionalAccepted = 507,
  FinalDeclarationFormProvisionalRejected = 508,
  FinalDeclarationFiftyTwoWeekResultCleared = 509,

  // Independent prescriber
  IndependentPrescriberEligibleForApplication = 601,
  IndependentPrescriberCountersignatureRequested = 602,
  IndependentPrescriberCountersignatureRecalled = 603,
  IndependentPrescriberMentorRequestApproved = 604,
  IndependentPrescriberMentorRequestDeclined = 605,
  IndependentPrescriberMentorRequestRefused = 606,
  IndependentPrescriberApplicationAutoApproved = 607,
  IndependentPrescriberApplicationNonAutoApproved = 608,
  IndependentPrescriberApplicationApproved = 609,

  //VR notifications
  VoluntaryRemovalApplicationReceived = 701,
  VoluntaryRemovalApplicationApproved = 702,
  VoluntaryRemovalApplicationAutoApproved = 703,
  VoluntaryRemovalRegistrationStatusUpdated = 704,
  
  //RTR notifications
  ReturnToRegisterApplicationPendingRestorationFee = 801,
  ReturnToRegisterApplicationReceivedRevalidationRequired = 802,
  ReturnToRegisterApplicationReceivedRevalidationNotRequired = 803,
  ReturnToRegisterApplicationTerminated = 804,
  ReturnToRegisterApplicationApproved = 805,
  ReturnToRegisterRegistrationStatusUpdated = 806,
  ReturnToRegisterApplicationTerminatedNonPayment = 807,
  ReturnToRegisterApplicationFeePaymentReminder = 808,
  ReturnToRegisterRevalidationSubmitReminder = 809,

  //CCPS notification
  CertificateProfessionalStandingApplicationSubmitted = 901,
  CertificateProfessionalStandingWaitingForApplicant = 902,
  CertificateProfessionalStandingApplicationCompleted = 903
}
