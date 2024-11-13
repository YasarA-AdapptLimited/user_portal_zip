
export interface EducationDetailsMetadata {
    dateAwarded?: string;
    dateCommenced?: string;
    qualificationId?: string;
    id?: string;
    qualificationType?: number;
}
export interface EducationDetails {
    knowledge?: EducationDetailsMetadata;
    competency?: EducationDetailsMetadata;
    combined?: EducationDetailsMetadata;
}
