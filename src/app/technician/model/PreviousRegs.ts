export interface PreviousRegistrations {
    registered?: boolean;
    type?: number;
    nameOfBody?: string;
    registrationNumber?: string;
    wasCertificateRequested?: boolean;
}

export class PreviousRegs implements PreviousRegistrations {
    registered: boolean;
    nameOfBody = '';
    registrationNumber = '';
    wasCertificateRequested: boolean;
    

    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

