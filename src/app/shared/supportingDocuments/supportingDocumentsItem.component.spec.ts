import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EventEmitter } from "events";
import { of } from "rxjs";
import { UploadService } from "../../core/service/upload.service";
import { AuthService } from "../../core/service/auth.service";
import { CollapsibleComponent } from "../collapsible.component";
import { FileUploadComponent } from "../fileUpload.component";
import { AttachmentType } from "../model/AttachmentType";
import { FileUpload } from "../model/FileUpload";
import { SupportingDocumentsService } from "./supportingDocuments.service";
import { SupportingDocumentsItemComponent } from "./supportingDocumentsItem.component";
import { LayoutService } from "../../core/service/layout.service";

describe('SupportingDocumentsItem Component', () => {
    let component: SupportingDocumentsItemComponent, fixture: ComponentFixture<SupportingDocumentsItemComponent>;
    let MockSupportingDocumentsService = jasmine.createSpyObj('SupportingDocumentsService', ['add']);
    let MockAuthService, MockUploadService, MockLayoutService;

    beforeEach(() => {        

        TestBed.configureTestingModule({
            declarations: [SupportingDocumentsItemComponent, CollapsibleComponent, FileUploadComponent],
            providers: [{ provide: SupportingDocumentsService, useValue: MockSupportingDocumentsService },
                        { provide: AuthService, useValue: MockAuthService },
                        { provide: UploadService, useValue: MockUploadService },
                        { provide: LayoutService, useValue: MockLayoutService}]
        }).compileComponents();

        fixture = TestBed.createComponent(SupportingDocumentsItemComponent);
        component = fixture.componentInstance;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });   

    
    it('should valid return false', () => {
        expect(component.valid).toBeTrue();
    });

    it('should PTValid return false', () => {
        expect(component.PTValid).toBeTrue();
    });

    it('uploadType should be defined for student and attachment should be added', () => {
        const registeredSpy: jasmine.Spy = spyOn(component.registered, 'emit');
        MockSupportingDocumentsService.add.and.returnValue(of({}));
        component.isStudent = true;
        component.attachmentType = 1;
        component.ngOnInit();
        expect(component.uploadType).toBe(3);
        expect(MockSupportingDocumentsService.add).toHaveBeenCalled();
        expect(registeredSpy).toHaveBeenCalledWith(1);
    });

    it('uploadType should be defined for technician and attachment should be added', () => {
        const registeredSpy: jasmine.Spy = spyOn(component.registered, 'emit');
        MockSupportingDocumentsService.add.and.returnValue(of({}));
        component.isTechnician = true;
        component.attachmentType = 1;
        component.ngOnInit();
        expect(component.uploadType).toBe(4);
        expect(component.titleOptions).toEqual(['Passport or EEA ID card', 'Photo drivers licence']);
        expect(MockSupportingDocumentsService.add).toHaveBeenCalled();
        expect(registeredSpy).toHaveBeenCalledWith(1);
    });

    it('uploadType should be defined for AssessmentReport and attachment should be added', () => {
        const registeredSpy: jasmine.Spy = spyOn(component.registered, 'emit');
        MockSupportingDocumentsService.add.and.returnValue(of({}));
        component.isAssessmentReport = true;
        component.attachmentType = 1;
        component.ngOnInit();
        expect(component.uploadType).toBe(5);
        expect(component.titleOptions).toEqual(['Photo ID card']);
        expect(MockSupportingDocumentsService.add).toHaveBeenCalled();
        expect(registeredSpy).toHaveBeenCalledWith(1);
    });

    it('uploadType should be defined for AssessmentRegistration and attachment should be added', () => {
        const registeredSpy: jasmine.Spy = spyOn(component.registered, 'emit');
        MockSupportingDocumentsService.add.and.returnValue(of({}));
        component.isAssessmentRegistration = true;
        component.attachmentType = 1;
        component.ngOnInit();
        expect(component.uploadType).toBe(6);
        expect(component.titleOptions).toEqual(['Photo ID card', 'Passport or EEA ID card']);
        expect(MockSupportingDocumentsService.add).toHaveBeenCalled();
        expect(registeredSpy).toHaveBeenCalledWith(1);
    });

    it('should validate if document is uploaded', () => {
        const file: FileUpload = {};
        const attachments: { [key: number]: Array<FileUpload> } = [];
        component.attachments = attachments;   
        component.mandatory = true;     
        component.title = 'Passport';
        expect(component.validate()).toEqual([`You haven't uploaded your passport`]);
    });

    it('should validate the number of documents', () => {
        const file: FileUpload = {
            status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 1,
            fileId: '123',
            filename: 'certificate',
            filesize: 128
        };
        const attachments: { [key: number]: Array<FileUpload> } = {0:[file]};
        component.attachments = attachments;   
        component.attachmentType = 0; 
        component.min = 2;
        component.title = 'Passport';
        expect(component.validate()).toEqual([`You must upload 2 documents`, `You haven't entered all the certifier details for your passport`]);
    });

    it('should validate the number of documents', () => {
        const file: FileUpload = {
            status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 1,
            fileId: '123',
            filename: 'certificate',
            filesize: 128
        };
        const attachments: { [key: number]: Array<FileUpload> } = {0:[file]};
        component.attachments = attachments;   
        component.attachmentType = 0; 
        component.min = 2;
        component.title = 'Passport';
        expect(component.validate()).toEqual([`You must upload 2 documents`, `You haven't entered all the certifier details for your passport`]);
    });    

    it('should validate the expiry dates of documents', () => {
        const file1: FileUpload = {
            status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 1,
            fileId: '123',
            filename: 'document',
            filesize: 128,
        };
        const file2: FileUpload = {
            status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 2,
            fileId: '345',
            filename: 'certificate',
            filesize: 128
        };
        const attachments: { [key: number]: Array<FileUpload> } = {0:[file1, file2]};
        component.attachments = attachments;   
        component.attachmentType = 0; 
        component.min = 2;
        component.requireExpiryDate = true;
        component.title = 'Document';
        expect(component.validate()).toEqual([`You must enter an expiry date for document documents`, `You haven't entered all the certifier details for your document`,
    `You must enter an expiry date for document documents`, `You haven't entered all the certifier details for your document`]);
    });

    it('should validate if expiry date of documents is in the past', () => {
        const file1: FileUpload = {
            status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 1,
            fileId: '123',
            filename: 'document',
            filesize: 128,
            expiryDate: '05-18-2020'
        };
        const file2: FileUpload = {
            status: 1,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 2,
            fileId: '345',
            filename: 'certificate',
            filesize: 128
        };
        const attachments: { [key: number]: Array<FileUpload> } = {0:[file1, file2]};
        component.attachments = attachments;   
        component.attachmentType = 0; 
        component.min = 2;
        component.requireExpiryDate = true;
        component.title = 'Document';
        expect(component.validate()).toEqual([`Expiry date for document must be in the future`, `You haven't entered all the certifier details for your document`,
    `You must enter an expiry date for document documents`, `You haven't entered all the certifier details for your document`]);
    });
});