import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';

import { SupportingDocumentsStepComponent } from './supportingDocumentsStep.component';
import { SupportingDocumentsItemComponent } from '../../../shared/supportingDocuments/supportingDocumentsItem.component';
import { FileUploadComponent } from '../../../shared/fileUpload.component';
import { SupportingDocumentsService } from '../../../shared/supportingDocuments/supportingDocuments.service';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { AutocompleteComponent } from '../../../shared/autocomplete.component';
import { UtcDatePipe } from '../../../shared/pipe/UtcDate.pipe';
import { UtcDatePickerComponent } from '../../../shared/utcDatePicker.component';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';

describe('Supporting documents step (Technician)', () => {
  let component: SupportingDocumentsStepComponent;
  let fixture: ComponentFixture<SupportingDocumentsStepComponent>;
  let MockFormStepperService, MockSupportingDocumentsService;


  beforeEach(() => {
    const application = {
      activeForm: {
          applicationType: 981360001,
          isSupportingDocumentsForwardedConfirmed: false,
          attachments: []
      },
      forms: [
        { attachments: [
            {
              certifier: {
                companyName: null,
                date: null,
                name: null,
                number: null,
                type: null,
              },
              deleteUrl: 'v1.0/registrationform/attachment/34ba881e-03f7-4947-87ca-cec8619b7714',
              expiryDate: null,
              fileId: '34ba881e-03f7-4947-87ca-cec8619b7714',
              filename: 'pharmacist_pre-registration_application_2017_3.pdf',
              filesize: 561041,
              isDuplicateCopy: false,
              status: 3,
              title: null,
              type: 11
            },
            {
              certifier: {
                companyName: null,
                date: null,
                name: null,
                number: null,
                type: null
              },
              deleteUrl: 'v1.0/registrationform/attachment/4cb267a5-84e0-44cf-8193-a4a129fa4e50',
              expiryDate: null,
              fileId: '4cb267a5-84e0-44cf-8193-a4a129fa4e50',
              filename: 'pharmacist_pre-registration_application_2017_3.pdf',
              filesize: 561041,
              isDuplicateCopy: false,
              status: 3,
              title: null,
              type: 7
            }
          ]
        }
      ]
    };
    MockSupportingDocumentsService = jasmine.createSpyObj(['validate']);
    MockFormStepperService = {};
    TestBed.configureTestingModule({
      declarations: [
        SupportingDocumentsStepComponent,
        SupportingDocumentsItemComponent,
        FileUploadComponent,
        CollapsibleComponent,
        GphcIconComponent,
        AutocompleteComponent,
        UtcDatePipe,
        UtcDatePickerComponent,
      ],
      imports: [
        MatCheckboxModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule
      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: SupportingDocumentsService, useValue: MockSupportingDocumentsService },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SupportingDocumentsStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when initialising, set local attachment to === application form attachments', () => {
    // arrange
    // act
    component.ngOnInit();
    const attachmentKeys = Object.keys(component.attachments);
    // assert
    expect(attachmentKeys).toEqual(['7', '11']);
  });

  it('if the view is ready, set pass true into ready$', () => {
    // arrange
    component.viewReady = true;
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
    // act
    component.load();
    // assert
    expect(ready$Spy).toHaveBeenCalledWith(true);
  });

  it('can register document types to registeredDocTypes array', () => {
    // arrange
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
    // act
    component.onRegistered(1);
    // assert
    expect(component.registeredDocTypes.length).toBe(1);
    // tick(1000);
    // setTimeout(() => {
    //   expect(component.viewReady).toBeTruthy();
    //   expect(ready$Spy).toHaveBeenCalledWith(true);
    // }, 1000);
  });


  it('should not save, if appType is < 2 years && supporting documents have not been forwarded', () => {
    // arrange
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    // act
    component.validate();
    // assert
    expect(validity$spy).toHaveBeenCalledWith(
      { valid: false,
        messages: [ 
          `This section is mandatory, please confirm that you understand you must forward your 
      supporting documents to the GPhC in order for your application to be processed.`
        ], 
        touched: undefined
      }
    );
    // [ Object({ valid: false, messages: [ 'This section is mandatory, as you have told us you have completed less than two years experience abroad' ], touched: undefined }) ]
  });

  it('should method clearAttachments, empty the attachments', () => {
    component.clearAttachments(); 
    expect(component.clearAttachments.length).toBe(0);
  });

  it('should method updateApplication, validate the application', () => {
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');
    const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');
    component.updateApplication(); 
    expect(validateSpy).toHaveBeenCalled();
    expect(makeDirtySpy).toHaveBeenCalled();
  });

  it('on upload of documents, should update the application', () => {
    const event = {uploads:[{
      certifier: {
        companyName: null,
        date: null,
        name: null,
        number: null,
        type: null
      },
      deleteUrl: 'v1.0/registrationform/attachment/4cb267a5-84e0-44cf-8193-a4a129fa4e50',
      expiryDate: null,
      fileId: '4cb267a5-84e0-44cf-8193-a4a129fa4e50',
      filename: 'pharmacist_pre-registration_application_2017_3.pdf',
      filesize: 561041,
      isDuplicateCopy: false,
      status: 3,
      title: null,
      type: 7
    }]};
    let updateApplicationSpy: jasmine.Spy = spyOn(component,'updateApplication');
    component.onUploaded(event); 
    expect(updateApplicationSpy).toHaveBeenCalled();
  });

});
