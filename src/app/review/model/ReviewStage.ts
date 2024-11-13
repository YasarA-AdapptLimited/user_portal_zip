export enum ReviewStage {
  Unknown = 0,
  /// <summary>
  /// Awaiting the Reviewers Annotations and the setting of the Initial PerformanceIndicator.
  /// </summary>
  Annotate = 1,
  /// <summary>
  /// The discussion phase has started between the reviewers.
  /// </summary>
  Discuss = 2,
  /// <summary>
  /// It's in the Feedback Stage (both Reviewers has set an Initial PerformanceIndicator).
  /// </summary>
  WriteFeedback = 3,
  /// <summary>
  /// LeadReviewer is awaiting Feedback Confirmation from SecondaryReviewer.
  /// </summary>
  AwaitingFeedbackApprovalByPeer = 4,
  /// <summary>
  /// Feedback Submitted for Approval. This means that QA is in progress.
  /// </summary>
  AwaitingFeedbackApprovalByQualityAssurer = 5,
  /// <summary>
  /// The QA has initiated a discussion with the reviewers.
  /// </summary>
  QualityAssuranceReviewDiscussion = 6,
  /// <summary>
  /// The QA has approved the Feedback.
  /// </summary>
  QualityAssuranceCompleted = 7,
  /// <summary>
  /// If the QA Manager has flagged this as needing further QA by a Manager.
  /// </summary>
  AwaitingFeedbackApprovalByQualityAssuranceManager = 8,
  /// <summary>
  /// The QA Manager has approved the Feedback.
  /// </summary>
  Approved = 9,
  /// <summary>
  /// GPhC QA has approved the Feedback.
  /// </summary>
  ReadyToBeSent = 10,
  /// <summary>
  /// Feedback has been sent to Registrant.
  /// </summary>
  FeedbackSent = 100
}
