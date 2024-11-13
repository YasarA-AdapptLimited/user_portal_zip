import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";
import { AssessmentRegistrationService } from "../../core/service/assessmentRegistration.service";
import { AssessmentReportService } from "../../core/service/assessmentReport.service";
import { PreregService } from "../../core/service/prereg.service";
import { TechnicianService } from "../../core/service/technician.service";
import { CaseSplitPipe } from "../pipe/CaseSplit.pipe";
import { SupportingDocumentsSummaryComponent } from "./supportingDocumentsSummary.component";

describe('SupportingDocumentsSummary Component', () => {
    let component: SupportingDocumentsSummaryComponent, fixture: ComponentFixture<SupportingDocumentsSummaryComponent>;
    // let MockPreregService = jasmine.createSpyObj('PreregService', []);
    let MockPreregService, MockTechnicianService, MockAssessmentReportService, MockAssessmentRegistrationService;

    MockTechnicianService = jasmine.createSpyObj('TechnicianService', ['getSupportingDocuments']);
    MockPreregService = jasmine.createSpyObj('PreregService', ['getStudentSupportingDocs']);
    MockAssessmentRegistrationService = jasmine.createSpyObj('AssessmentRegistrationService', ['getAssessmentRegistrationSupportingDocs']);
    MockAssessmentReportService = jasmine.createSpyObj('AssessmentReportService', ['getProgressReportSupportingDocs']);
    
    beforeEach(() => {        
        const MockApplication = {
            activeForm: {
                attachments: [{
                    status: 1,
                    error: '',
                    invalidType: false,
                    tooBig: false,
                    type: 1,
                    fileId: '345',
                    filename: 'document',
                    filesize: 128
                }],
                declaration: {
                    isQ1Confirmed: null,
                    isQ2Confirmed: null,
                    isQ3Confirmed: null,
                    isQ4Confirmed: null
                },
                declarations: null,
                formStatus: null,
                id: null,
                isOverallDeclarationConfirmed: true,
                minStep: null,
                mode: null,
                get readonly() {
                    return true;
                },
                step: null,
                registrantStatus: null,
                requirePayment: null,
                trainee: null,
                scope: null
            },
            pastApplications: [{
                attachments: [{
                    status: 1,
                    error: '',
                    invalidType: false,
                    tooBig: false,
                    type: 1,
                    fileId: '123',
                    filename: 'certificate',
                    filesize: 128
                }],
                declaration: {
                    isQ1Confirmed: null,
                    isQ2Confirmed: null,
                    isQ3Confirmed: null,
                    isQ4Confirmed: null
                },
                declarations: null,
                formStatus: null,
                id: '123',
                isOverallDeclarationConfirmed: true,
                minStep: null,
                mode: null,
                get readonly() {
                    return true;
                },
                step: null,
                registrantStatus: null,
                requirePayment: null,
                trainee: null,
                scope: null
            }]
        };
        
        TestBed.configureTestingModule({
            imports: [],
            declarations: [SupportingDocumentsSummaryComponent, CaseSplitPipe],
            providers: [{ provide: PreregService, useValue: MockPreregService },
                {provide: TechnicianService, useValue: MockTechnicianService},            
                {provide: AssessmentReportService, useValue: MockAssessmentReportService},       
                {provide: AssessmentRegistrationService, useValue: MockAssessmentRegistrationService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SupportingDocumentsSummaryComponent);
        component = fixture.componentInstance;
        component.application = MockApplication;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });   

    it('attachments should be defined even when formId is null', () => {
        component.formId = null;
        component.isCountersignerView = false;
        component.removeAllButPhotos = false;
        fixture.detectChanges();
        expect(component.attachments.length).toBe(1);
    }); 
    
    it('attachments should be defined', () => {
        component.formId = '123';
        component.isCountersignerView = false;
        component.removeAllButPhotos = false;
        fixture.detectChanges();
        expect(component.attachments.length).toBe(1);
    }); 

    it('attachments should be defined when isCountersignerView is true', () => {
        component.formId = '123';
        component.isCountersignerView = true;
        component.removeAllButPhotos = false;
        fixture.detectChanges();
        expect(component.attachments.length).toBe(1);
    }); 

    it('attachments other than photos will be removed be defined when removeAllButPhotos is true', () => {
        component.formId = '123';
        component.isCountersignerView = true;
        component.removeAllButPhotos = true;
        fixture.detectChanges();
        expect(component.attachments.length).toBe(0);
    });

    it('attachemnts are sorted in the alphabetical order', () => {
        const attachments = [{ status: 1,
                        error: '',
                        invalidType: false,
                        tooBig: false,
                        type: 0,
                        fileId: '123',
                        filename: 'certificate',
                        filesize: 128
                    },
                    {   status: 1,
                        error: '',
                        invalidType: false,
                        tooBig: false,
                        type: 2,
                        fileId: '345',
                        filename: 'document',
                        filesize: 64
                    }];
        const resultedAttachments = [
                    {   status: 1,
                        error: '',
                        invalidType: false,
                        tooBig: false,
                        type: 2,
                        fileId: '345',
                        filename: 'document',
                        filesize: 64
                    },
                    {   status: 1,
                        error: '',
                        invalidType: false,
                        tooBig: false,
                        type: 0,
                        fileId: '123',
                        filename: 'certificate',
                        filesize: 128
                    }
                    ];

        expect(component.putInAlphabeticalOrder(attachments)).toEqual(resultedAttachments);        
    });

    it('returns icon based on file extension',() => {
        let file = {   status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 0,
            fileId: '123',
            filename: 'certificate.pdf',
            filesize: 128
        };

        expect(component.getIcon(file)).toBe('fa fa-file-pdf-o');

        file.filename = 'certificate.png';
        expect(component.getIcon(file)).toBe('fa fa-file-image-o');

        file.filename = 'certificate.doc';
        expect(component.getIcon(file)).toBe('fa fa-file-word-o');

        file.filename = 'certificate.zip';
        expect(component.getIcon(file)).toBe('fa fa-file-archive-o');

        file.filename = 'certificate';
        expect(component.getIcon(file)).toBe('fa fa-file-o');
    });

    it('should create download blob based on the role', () => {
        
        const file = {   status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 0,
            fileId: '123',
            filename: 'certificate.pdf',
            filesize: 128
        };

        component.isTechnician = true;
        let MockGetSupportingDocuments = MockTechnicianService.getSupportingDocuments.and.returnValue(of());
        component.download(file);
        expect(MockGetSupportingDocuments).toHaveBeenCalled();
    });

    it('should create download blob for student role', () => {
        const file = {   status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 0,
            fileId: '123',
            filename: 'certificate.pdf',
            filesize: 128
        };

        component.isStudent = true;
        let MockStudentSupportingDocs = MockPreregService.getStudentSupportingDocs.and.returnValue(of());
        component.download(file);
        expect(MockStudentSupportingDocs).toHaveBeenCalled();
    });
    
    it('should create download blob for AssessmentRegistration', () => {
        const file = {   status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 0,
            fileId: '123',
            filename: 'certificate.pdf',
            filesize: 128
        };

        component.isAssessmentRegistration = true;
        let MockAssessmentRegistrationSupportingDocs = MockAssessmentRegistrationService.getAssessmentRegistrationSupportingDocs.and.returnValue(of());
        component.download(file);
        expect(MockAssessmentRegistrationSupportingDocs).toHaveBeenCalled();
    });

    it('should create download blob for Aros', () => {
        const file = {   status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 0,
            fileId: '123',
            filename: 'certificate.pdf',
            filesize: 128
        };

        component.isAros = true;
        let MockProgressReportSupportingDocs = MockAssessmentReportService.getProgressReportSupportingDocs.and.returnValue(of());
        component.download(file);
        expect(MockAssessmentReportService.getProgressReportSupportingDocs).toHaveBeenCalled();
    });

});
