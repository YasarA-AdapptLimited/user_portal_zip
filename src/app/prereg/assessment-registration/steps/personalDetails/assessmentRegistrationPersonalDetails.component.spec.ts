import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { ApplicantComponent } from './../../../../account/applicant.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AssessmentRegistrationPersonalDetailsComponent } from './assessmentRegistrationPersonalDetails.component';
import { ContactEditComponent } from '../../../../account/contactEdit.component';
import { AddressComponent } from '../../../../account/address.component';


describe('( Assessment registration ) => Personal details ', () => {
  let component: AssessmentRegistrationPersonalDetailsComponent;
  let fixture: ComponentFixture<AssessmentRegistrationPersonalDetailsComponent>;
  let MockFormStepperService;

  const application = {
    trainee: {
      title: { name: 'XXX', id: 0 },
      forenames: 'YYY',
      middleName: 'ZZZ',
      surname: '',
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
      dateOfBirth: '01-01-1985',
      qualification: { courseName: 'pharmacy', courseType: 1 },
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
  }

  beforeEach(() => {
    MockFormStepperService = {};
    TestBed.configureTestingModule({
      declarations: [
        AssessmentRegistrationPersonalDetailsComponent,
        GphcIconComponent,
        ApplicantComponent,
        CollapsibleComponent,
        ContactEditComponent,
        AddressComponent,
        UtcDatePipe
      ],
      imports: [
        MatAutocompleteModule,
        TooltipModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: FormStepperService, useValue: MockFormStepperService }
      ]

    }).compileComponents();
    fixture = TestBed.createComponent(AssessmentRegistrationPersonalDetailsComponent);
    component = fixture.componentInstance;
    component = Object.assign(component,{ application });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('update make calls to makeDirty and validate method', () => {
    const makeDirtySpy: jasmine.Spy = spyOn(component, 'makeDirty');
    const validateSpy: jasmine.Spy = spyOn(component, 'validate');

    component.update();
    expect(makeDirtySpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should view be ready after ngAfterVieInit',fakeAsync(() => {
    const readySpy: jasmine.Spy = spyOn(component.ready$,'next');
    component.viewReady = true;
    component.ngAfterViewInit();
    tick();
    expect(readySpy).toHaveBeenCalledWith(true);
    expect(component.viewReady).toBeTrue();
  }));

  it('if the view is ready, set pass true into ready$', () => {
    component.viewReady = true;
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
    component.load();
    expect(ready$Spy).toHaveBeenCalledWith(true);
  });

});
