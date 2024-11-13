import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { LayoutService } from '../../../core/service/layout.service';
import { PersonalDetailsStepComponent } from './personalDetailsStep.component';
import { ApplicantComponent } from '../../../account/applicant.component';
import { ContactEditComponent } from '../../../account/contactEdit.component';
import { AddressEditComponent } from './addressEdit.component';

describe('Personal details step component (technician)', () => {
  let component: PersonalDetailsStepComponent;
  let fixture: ComponentFixture<PersonalDetailsStepComponent>;
  let MockFormStepperService, MockLayoutService;

  beforeEach(waitForAsync(() => {
    const application = {
      activeForm: {
        previousApplicationsAndRegistrations: {
          applications: {
            preRegistrationTraining: {
              undertaken: true,
              preRegistrationNumber: '123213',
              startDate: new Date()
            },
            registration: {
              applied: true,
              registrationNumber: '',
              type: null,
              applicationDate: null
            }
          },
          registrations: [
            {
              registered: true,
              type: 1,
              nameOfBody: 'Caesar',
              registrationNumber: '324243',
             wasCertificateRequested: true
            },
            {
              registered: false,
              type: 0,
              nameOfBody: '',
              registrationNumber: '',
              wasCertificateRequested: false
            },
          ]
        }
      },
      trainee: {
        title: { name: 'ABC', id: 12345 },
        forenames: 'XYZ',
        middleName: 'XYZ',
        surname: 'XYZ',
        address: {
          line1: 'XXX',
          line2: '',
          line3: '',
          town: 'YYY',
          county: 'ZZZ',
          postcode: 'X123',
          country: 'XYZ'
        },
        contact: {
          email: 'test@test.com',
          mobilePhone: '123456789',
          telephone1: ''
        },
        dateOfBirth: '',
        qualification: { courseName: '', courseType: null },
        equalityDiversity: {
          ethnicity: 0,
          ethnicityOther: '',
          nationality: 0,
          religion: 0,
          religionOther: '',
          disabled: 0,
          disabilityDetails: '',
          gender: 0,
          sexualOrientation: 0
        }
      }
    };
    MockFormStepperService = {};
    MockLayoutService = {};
    TestBed.configureTestingModule({
      declarations: [
        PersonalDetailsStepComponent,
        ApplicantComponent,
        CollapsibleComponent,
        ContactEditComponent,
        AddressEditComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,

      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService },
        { provide: LayoutService, useValue: MockLayoutService },
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(PersonalDetailsStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  }));

  it('should create', () => {
      expect(component).toBeTruthy();
  });
  
  it('should applicant be defined on init', () => {
    fixture.detectChanges();
    expect(component.applicant).toBe(component.application.trainee);
  });

  it('should notify on load of the page', () => {
    component.viewReady = true;
    let readySpy: jasmine.Spy = spyOn(component.ready$, 'next');
    component.load();
    expect(readySpy).toHaveBeenCalledWith(true);
  });

  it('should update method update form and its validation', () => {
    const makeDirtySpy: jasmine.Spy = spyOn(component,'makeDirty');
    const validateSpy: jasmine.Spy = spyOn(component,'validate');
    component.update();
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should validate method validate the form', () => {    
    component.applicant = component.application.trainee;
    component.validate();
    expect(component.hasTitle).toBe(true);
  });

  it('method populateForm should be defined', () => {
    component.populateForm();
    expect(component.populateForm).toBeDefined();
  });
});
