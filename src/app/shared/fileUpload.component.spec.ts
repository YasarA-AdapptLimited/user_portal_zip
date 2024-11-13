import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Observable, of, throwError } from "rxjs";
import { AuthService } from "../core/service/auth.service";
import { LayoutService } from "../core/service/layout.service";
import { UploadService } from "../core/service/upload.service";
import { CollapsibleComponent } from "./collapsible.component";
import { FileUploadComponent } from "./fileUpload.component";
import { AttachmentType } from "./model/AttachmentType";
import { UploadStatus } from "./model/UploadStatus";


describe('FileUpload Component', () => {
    let component: FileUploadComponent, fixture: ComponentFixture<FileUploadComponent>;
    let MockAuthService, MockUploadService, MockLayoutService;

    const files = [
        {
            status: 3,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 1,
            fileId: '123',
            filename: 'certificate.png',
            filesize: 128
        },
        {
            status: 3,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 2,
            fileId: '345',
            filename: 'document.pdf',
            filesize: 64,
            title: 'Photo drivers licence'
        },
        {
            status: 3,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 1,
            fileId: '890',
            filename: 'certificate.png',
            filesize: 128
        }        
    ];

    MockUploadService = jasmine.createSpyObj('UploadService', ['deleteFile']);

    beforeEach(() => {           

        TestBed.configureTestingModule({
            declarations: [FileUploadComponent, CollapsibleComponent],
            providers: [
                { provide: AuthService, useValue: MockAuthService},
                { provide: UploadService, useValue: MockUploadService},
                { provide: LayoutService, useValue: MockLayoutService}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FileUploadComponent);
        component = fixture.componentInstance;
        component.files = files;
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });  

    it('should define files', () => {
        component.setExisting = null;
        expect(component.files).toEqual([]);
    });

    it('certifierTemplate should be equal to photoCertifierTemplate for attachmentType - photo', () => {
        component.requireCertifier = true;
        component.attachmentType = 3;
        expect(component.certifierTemplate).toEqual(component.photoCertifierTemplate);
    });

    it('certifierTemplate should be equal to birthCertificateCertifierTemplate for attachmentType - BirthCertificate', () => {
        component.requireCertifier = true;
        component.attachmentType = 2;
        expect(component.certifierTemplate).toEqual(component.birthCertificateCertifierTemplate);
    });

    it('certifierTemplate should be defaultCertifierTemplate for other attachment types', () => {
        component.requireCertifier = true;
        component.attachmentType = 0;
        expect(component.certifierTemplate).toEqual(component.defaultCertifierTemplate);
    });

    it('deleteAll method should delete all the existing files', () => {
        let spyDelete: jasmine.Spy = spyOn(component,'delete');
        component.deleteAll();
        expect(spyDelete).toHaveBeenCalledTimes(3);
    });

    it('delete method removes the file indicated', fakeAsync(() => {
        const file = {
                        status: 3,
                        error: '',
                        invalidType: false,
                        tooBig: false,
                        type: 1,
                        fileId: '890',
                        filename: 'certificate.png',
                        filesize: 128,
                        name:'certificate.png'
                        };
        const MockDeleteFile = MockUploadService.deleteFile.and.returnValue(of({}));
        const spyDeleted: jasmine.Spy = spyOn(component.deleted, 'emit');
        const spyUploaded: jasmine.Spy = spyOn(component.uploaded, 'emit');
        component.delete(file);        
        tick();
        expect(spyDeleted).toHaveBeenCalledWith(file);
        expect(spyUploaded).toHaveBeenCalledWith(component.uploadedFiles);
    }));

    it('delete method on throw of error', fakeAsync(() => {
        const file = {
                        status: 3,
                        error: '',
                        invalidType: false,
                        tooBig: false,
                        type: 1,
                        fileId: '890',
                        filename: 'certificate.png',
                        filesize: 128,
                        name:'certificate.png'
                        };
        const MockDeleteFile = MockUploadService.deleteFile.and.returnValue(throwError(new Error('error')));        
        component.delete(file);        
        tick();
        expect(file.status).toBe(UploadStatus.Error);
        expect(file.error).toBe('error');
    }));



    it('today should return current date', () => {                
        expect(component.today).toEqual(new Date());
    });

    it('uploadedFileCount should return files count', () => {
        component.files = files;
        expect(component.uploadedFileCount).toEqual(3);
    });

    it('uploadedFiles return all the files that are loaded', () => {
        component.files = files;
        expect(component.uploadedFiles).toEqual(files);
    });

    it('remove will delete the mentioned file from files list', () => {
        const file = {
            status: 3,
            error: '',
            invalidType: false,
            tooBig: false,
            type: 2,
            fileId: '345',
            filename: 'document.pdf',
            filesize: 64
        };
        component.files = files;

        component.remove(file);
        expect(component.files.length).toBe(3);
    });

    it('propogate method emits the uploaded files', () => {
        let spyEmit: jasmine.Spy = spyOn(component.uploaded,'emit');
        component.files = files;
        component.propagate();
        expect(component.titleOptions).toEqual(['GP registration letter', 'National insurance card', 'Other']);
        expect(spyEmit).toHaveBeenCalledWith(component.uploadedFiles);
    });
    
    it('setExisting sets defines the files list of files are already present', () => {
        component.setExisting = files;
        expect(component.files).toBeDefined();    
    })
});