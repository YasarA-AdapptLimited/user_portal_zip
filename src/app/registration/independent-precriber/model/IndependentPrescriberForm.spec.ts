import { ApplicationFormMode } from "../../../prereg/model/ApplicationFormMode";
import { ApplicationStatus } from "../../../prereg/model/ApplicationStatus";
import { RegistrantStatus } from "../../model/RegistrantStatus";
import { IndependentPrescriberApplicationStep } from "./IndependentPrescriberApplicationStep";
import { IndependentPrescriberForm } from "./IndependentPrescriberForm";

describe('Independent Prescriber Form', () => {
    let testForm;

    let formData = {
        id: '',
        formStatus: ApplicationStatus.InProgress,
        declarations: [],
        attachments: [],
        isOverallDeclarationConfirmed: false,
        step: IndependentPrescriberApplicationStep.QualificationDetails,
        minStep: IndependentPrescriberApplicationStep.Payment,
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
        testForm = new IndependentPrescriberForm(formData, RegistrantStatus.Applicant);
    });

    it('should init correctly', () => {
        expect(testForm).toBeTruthy();
    });

    it('should init correctly', () => {
        expect(testForm.readonly).toBe(false);
    });
});