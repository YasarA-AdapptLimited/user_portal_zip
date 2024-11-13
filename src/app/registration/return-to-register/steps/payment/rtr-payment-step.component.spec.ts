import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { of } from 'rxjs';
import { ReturnToRegisterService } from '../../../../core/service/returnToRegister.service';
import { RenewalService } from '../../../../core/service/renewal.service';
import { VoluntaryRemovalService } from '../../../../core/service/voluntaryRemoval.service';
import { TooltipModule } from '../../../../core/tooltip/tooltip.module';
import { CollapsibleComponent } from '../../../../shared/collapsible.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { GphcIconComponent } from '../../../../shared/gphc-icon.component';

import { RtrPaymentStepComponent } from './rtr-payment-step.component';

describe('RtrPaymentStepComponent', () => {
  let component: RtrPaymentStepComponent;
  let fixture: ComponentFixture<RtrPaymentStepComponent>;
  let MockFormStepperService, MockRenewalService, MockRTRService;
  let submit;

  const application = {
    activeForm: {
      applicationFees: 256,
      feeDescription: 'quaterly renewal fee',
      collectionMethod: 'online',
      dueDate: '03-05-2022',
      amount: 256,
      outStandingFee: 256,

    }
  }

  beforeEach(() => {
    MockFormStepperService = {};
    MockRenewalService = jasmine.createSpyObj('RenewalService',['getWordpayConfig']);
    MockRTRService = jasmine.createSpyObj('RTRService',['saveApplicationPayment'])
    TestBed.configureTestingModule({
        declarations: [
            RtrPaymentStepComponent,
            GphcIconComponent,
            CollapsibleComponent
        ],
        imports: [
            TooltipModule,
            FormsModule,
            ReactiveFormsModule,
            MatCheckboxModule,
            MatAutocompleteModule
        ],
        providers: [
          { provide: FormStepperService, useValue: MockFormStepperService },
          { provide: RenewalService, useValue: MockRenewalService },
          { provide: ReturnToRegisterService, useValue: MockRTRService },
        ]

    }).compileComponents();
    fixture = TestBed.createComponent(RtrPaymentStepComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
    MockRTRService.saveApplicationPayment.and.returnValue(true);
    submit = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should correctly get and set review details', () => {
    it('Trainee to be defined', () => {
      expect(component).toBeDefined(component.application.activeForm);
    });
  });

  it(` load all payments and set ready$ to true`, () => {
    // arrange
    const mockFunction = () => {
      const subscribe = () => {
        return of(true);
      };
      return subscribe;
    };
    MockRenewalService.getWordpayConfig.and.returnValue(of(mockFunction));
    const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
    // act
    component.load();
    // assert
    expect(ready$Spy).toHaveBeenCalled();
  });


  it('if theres no cart type selected, validity is false', () => {
    // arrange
    const validity$Spy = spyOn(component.validity$, 'next').and.callThrough();
    // act 
    component.validate();
    // assert
    expect(validity$Spy).toHaveBeenCalledWith(
      { valid: false, messages: ['You must select a card type to proceed to payment'], touched: undefined });
  });



  describe('beforeNext should set as true', () => {
    it('should call saveApplicationPayment when beforenext method is called', () => {

    let id = 123;

    component.worldpayForm = {
        nativeElement: jasmine.createSpyObj('nativeElement', ['submit'])
    }

    MockRTRService.saveApplicationPayment.and.returnValue(of({paymentIdentifier: id}));
    // act
    component.beforeNext();
    // assert
    expect(component.cartId).toBe(String(id));    
      });
  });


  it('populateForm method should be defined', () => {
    component.populateForm();
    expect(component.populateForm).toBeDefined();
  });
});
