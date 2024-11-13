import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { CollapsibleComponent } from '../../../../shared/collapsible.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';

import { SupportingDocumentsItemComponent } from '../../../../shared/supportingDocuments/supportingDocumentsItem.component';
import { FileUploadComponent } from '../../../../shared/fileUpload.component';
import { SupportingDocumentsService } from '../../../../shared/supportingDocuments/supportingDocuments.service';
import { GphcIconComponent } from '../../../../shared/gphc-icon.component';
import { AutocompleteComponent } from '../../../../shared/autocomplete.component';
import { UtcDatePipe } from '../../../../shared/pipe/UtcDate.pipe';
import { UtcDatePickerComponent } from '../../../../shared/utcDatePicker.component';
import { TooltipModule } from '../../../../core/tooltip/tooltip.module';
import { AssessmentRegistrationSupportingDocumentsStepComponent } from './assessmentRegistrationSupportingDocumentsStep.component';

describe('(Assessment Registration) => Supporting documents step', () => {
  let component: AssessmentRegistrationSupportingDocumentsStepComponent;
  let fixture: ComponentFixture<AssessmentRegistrationSupportingDocumentsStepComponent>;
  let MockFormStepperService, MockSupportingDocumentsService;


  beforeEach(() => {
    const application = {
      forms: [
        {
          attachments: [
            {
              deleteUrl: 'v1.0/assessmentRegistration/attachment/34ba8',
              fileId: '34ba',
              filename: 'pharmacist_pre-registration_application_2017_3.pdf',
              filesize: 561041,
              isDuplicateCopy: false,
              status: 3,
              type: 1
            }
          ]
        }
      ],
      activeForm: {
        attachments: []
      }
    };
    MockSupportingDocumentsService = jasmine.createSpyObj(['validate']);
    MockFormStepperService = {};
    TestBed.configureTestingModule({
      declarations: [
        AssessmentRegistrationSupportingDocumentsStepComponent,
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
    fixture = TestBed.createComponent(AssessmentRegistrationSupportingDocumentsStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  });

  it('validate method validates the step ', () => {
    // arrange
    const validity$spy: jasmine.Spy = spyOn(component.validity$, 'next');
    // act
    component.validate();
    // assert
    expect(validity$spy).toHaveBeenCalledWith({ valid: true, messages: [], touched: undefined });
  });

  it('on document upload, update the application', () => {
    const validateSpy: jasmine.Spy = spyOn(component,'validate');
    const makeDirtySpy: jasmine.Spy = spyOn(component,'makeDirty');

    let event = { type: 1,
      uploads: [{
        deleteUrl: 'v1.0/assessmentRegistration/attachment/34ba',
        fileId: '34ba88',
        filename: 'pre-registration_application.pdf',
        filesize: 561040,
        isDuplicateCopy: false,
        status: 3,
        type: 1
     }]
    }
    component.onUploaded(event);
    expect(validateSpy).toHaveBeenCalled();
    expect(makeDirtySpy).toHaveBeenCalled();
  });
});
