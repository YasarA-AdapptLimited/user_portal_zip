import { Title } from "./CCPSDetails";

export class ProfessionalStandingDetail {
    country: string; 
    regulatoryBodyId: string;  
    contactName?: string; 
    telephone?: string;  
    emailAddress?:string;
    continueExistingName: boolean;
    forenames:string;
    middleName:string;
    regulatoryBodyName:string;
    surname:string;
    title:Title;
}

