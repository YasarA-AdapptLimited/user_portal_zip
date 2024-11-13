export enum RTREligibilityType
{
    NotAvailable = 0,
    PharmacistVRemovalLessThanMonth = 1,
    PharmacistVRemovalMoreThanMonth = 2,
    PharmacistNotRenewalLessThanYear = 3,
    PharmacistNonComplianceLessThanYear = 4,
    PTechnicianVRemovalLessThanMonth = 5,
    PTechnicianVRemovalMoreThanMonth = 6,
    PTechnicianNotRenewalLessThanYear = 7,
    PTechnicianNonComplianceLessThanYear = 8
}