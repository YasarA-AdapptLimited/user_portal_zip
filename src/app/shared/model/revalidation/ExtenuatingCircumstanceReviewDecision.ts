export enum ExtenuatingCircumstanceReviewDecision {
    Received = 0,
    Pending = 1,
    Approved = 2,
    /// <summary>
    /// Approved with modifications; might have been not allowing the complete
    /// reduction, or changing the Revalidation Deadline in the EC.
    /// </summary>
    PartiallyApproved = 3,
    //MAE-15: added new outcome of EC as no longer required
    NoLongerRequired = 4,
    /// <summary>
    /// Rejected by the reviewer.
    /// </summary>
    Rejected = 999,

    ///MAE-40: adding new outcome of EC
    RequestResubmission = 998
}
