export enum PaymentType {
    Unknown = 0,
    // ROS
    RegistrationApplicationFee = 1,
    // ROS
    RegistrationFirstYearFee = 2,
    // PROS
    PreRegistrationApplicationFee = 3,
    // TROS
    PharmacyTechnicianRegistrationApplicationFee = 4,
    // TROS
    PharmacyTechnicianFirstYearFee = 5,
    // AROS
    AssessmentRegistrationApplicationFee = 6,
    // IndyPrescriber
    IndependentPrescriberApplicationFee = 7,
    //Voluntary Removal Application
    PharmacistVRemoval1QuarterRenewalFee = 8,
    PharmacistVRemoval2QuarterRenewalFee = 9,
    PharmacistVRemoval3QuarterRenewalFee = 10,
    PTechnicianVRemoval1QuarterRenewalFee = 11,
    PTechnicianVRemoval2QuarterRenewalFee = 12,
    PTechnicianVRemoval3QuarterRenewalFee = 13,

    //RTR aplication 
    PharmacistRTRAppFeeVoluntaryRemovalLessThanMonth = 14,
    PharmacistRTRAppFeeVoluntaryRemovalMoreThanMonth = 15,
    PharmacistRTRAppFeeAfterNonRenewalLessThanYear = 16,
    PharmacistRTRAppFeeAfterNonComplianceLessThanYear = 17,
    PhyTechRTRAppFeeVoluntaryRemovalLessThanMonth = 18,
    PhyTechRTRAppFeeVoluntaryRemovalMoreThanMonth = 19,
    PhyTechRTRAppFeeAfterNonRenewalLessThanYear = 20,
    PhyTechRTRAppFeeAfterNonComplianceLessThanYear = 21,
    PharmacistRestorationFee = 22,
    PhyTechnicianRestorationFee = 23,
    PharmacistRestorationAndRenewalFee = 24,
    PhyTechnicianRestorationAndRenewalFee = 25,

    //CCPS application
    CertOfProfessionalStandingApplicationFee = 27

}
