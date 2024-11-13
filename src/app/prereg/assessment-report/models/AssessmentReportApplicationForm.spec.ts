import { FormScope } from "../../../registration/model/FormScope";
import { RegistrantStatus } from "../../../registration/model/RegistrantStatus";
import { ApplicationFormMode } from "../../model/ApplicationFormMode";
import { ApplicationStatus } from "../../model/ApplicationStatus";
import { AssessmentReportApplicationForm } from "./AssessmentReportApplicationForm";
import { AssessmentReportStep } from "./AssessmentReportStep";

describe('Assessment Report Application Form', () => {
    let testForm;
    let formDetails = {
        declarations: [],
        id:'123',
        formStatus: ApplicationStatus.InProgress,
        attachments:[],
        isOverallDeclarationConfirmed: false,
        isTrainingConfirmed: false,
        isAssessmentConfirmed: false,
        isJointTutoringArrangmentExists: null,
        tutorDetails: [],
        confirmTempRegistration: true,
        step: AssessmentReportStep.TemporaryRegistration,
        minStep: AssessmentReportStep.TemporaryRegistration,
        mode: ApplicationFormMode.Editable,
        registrantStatus: RegistrantStatus.Applicant,
        requirePayment: true,
        scope: FormScope.AssessmentRegistration,
        countersignatures: [],
        traineeFullName: 'XXX ZZZ',
        prgEntryNumber: 123456,
        trainingSiteName: 'qwe',
        trainingSiteAddress: 'asd',
        tutorFullName: 'abc',
        tutorGPhCId: 'a123',
        trainingNoOfWeeks: 12
    }

    beforeEach(() => {
        testForm = new AssessmentReportApplicationForm(formDetails, RegistrantStatus.Applicant);
    });

    it('should init correctly', () => {
        expect(testForm).toBeTruthy();
        expect(testForm.readonly).toBeFalse();
    });

    it('clearDeclarationSteps clears all the declarations', () => {
        testForm.clearDeclarationSteps();
        expect(testForm.declarations).toEqual([]);
    });
});