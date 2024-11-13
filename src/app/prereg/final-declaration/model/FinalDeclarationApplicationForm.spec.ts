import { RegistrantStatus } from "../../../registration/model/RegistrantStatus";
import { ApplicationFormMode } from "../../../prereg/model/ApplicationFormMode";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { FinalDeclarationApplicationForm } from "./FinalDeclarationApplicationForm";
import { FinalDeclarationStep } from "./FinalDeclarationStep";

describe('Final Declaration Application Form', () => {
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
        testForm = new FinalDeclarationApplicationForm(formData, RegistrantStatus.Applicant);
    });

    it('should init correctly', () => {
        expect(testForm).toBeTruthy();
    });

    it('should test final declaration application form', () => {
        expect(testForm.readonly).toBe(false);
    });

    it('declarations are cleared on call of clearDeclarationSteps', () => {
        testForm.clearDeclarationSteps();
        expect(testForm.declarations.length).toBe(0);
    });
});
