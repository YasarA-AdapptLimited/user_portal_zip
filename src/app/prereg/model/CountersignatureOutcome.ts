export enum CountersignatureOutcome {
    Unknown = 0,
    Pending = 1,
    Approved = 2,
    /// <summary>
    /// Refused to be reviewed by the reviewer. Could be because he was asked to
    /// review or counter-sign in err.
    /// </summary>
    Refused = 998,
    /// <summary>
    /// Rejected by the reviewer.
    /// </summary>
    Rejected = 999
}
