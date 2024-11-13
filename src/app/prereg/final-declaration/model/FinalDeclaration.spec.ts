import { RegistrantStatus } from "../../../registration/model/RegistrantStatus";
import { ApplicationFormMode } from "../../model/ApplicationFormMode";
import { ApplicationStatus } from "../../model/ApplicationStatus";
import { FinalDeclaration } from "./FinalDeclaration";
import { FinalDeclarationStep } from "./FinalDeclarationStep";

describe('Final Declaration', () => {
    let testForm;

    let formData = {
        id: '',
        formStatus: ApplicationStatus.ReadyForCountersigning ,
        declarations: [],
        attachments: [],
        isOverallDeclarationConfirmed: false,
        step: FinalDeclarationStep.TrainingConfirmation,
        minStep: FinalDeclarationStep.Submit,
        mode: ApplicationFormMode.Editable,
        declaration: {
            isQ1Confirmed: true,
            isQ2Confirmed: false,
            isQ3Confirmed: false,
            isQ4Confirmed: false,
            isQ5Confirmed: false
        },
        registrantStatus: RegistrantStatus.Applicant
    }

    beforeEach(() => {
        testForm = new FinalDeclaration(formData, RegistrantStatus.Applicant);
    });

    it('should init correctly', () => {
        expect(testForm).toBeTruthy();
    });
});
