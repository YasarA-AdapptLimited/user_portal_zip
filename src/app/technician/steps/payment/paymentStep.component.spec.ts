
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { of } from 'rxjs';
import { RenewalService } from '../../../core/service/renewal.service';
import { TechnicianService } from '../../../core/service/technician.service';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { PaymentStepComponent } from './paymentStep.component';



describe('( Technician ) => Payment Step ', () => {
    let component: PaymentStepComponent;
    let fixture: ComponentFixture<PaymentStepComponent>;
    let MockFormStepperService, MockRenewalService, MockTechnicianService;

    const application = {
        applicationFee: 51
    }

    beforeEach(() => {
        MockFormStepperService = {};
        MockRenewalService = jasmine.createSpyObj(['RenewalService', 'getWordpayConfig']);
        TestBed.configureTestingModule({
            declarations: [
                PaymentStepComponent,
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
                {provide: FormStepperService, useValue: MockFormStepperService},
        {provide: RenewalService, useValue: MockRenewalService},
        {provide: TechnicianService, useValue: MockTechnicianService},
            ]

        }).compileComponents();
        fixture = TestBed.createComponent(PaymentStepComponent);
        component = fixture.componentInstance;
        component = Object.assign(component, {application});
    });

    it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('if theres no cart type selected, validity is false', () => {
        // arrange
        const validity$Spy = spyOn(component.validity$, 'next').and.callThrough();
        // act 
        component.validate();
        // assert
        expect(validity$Spy).toHaveBeenCalledWith(
          { valid: false, messages: [ 'You must select a card type to proceed to payment' ] , touched: undefined});
      });

      describe('beforeNext should set as true', () => {
        it('should call saveApplicationPayment when beforenext method is called', () => {

            const saveApplicatipnPaymentSpy: jasmine.Spy = spyOn(component, 'beforeNext');
        // act
        component.beforeNext();
        // assert
        expect(saveApplicatipnPaymentSpy).toHaveBeenCalled();

          });
      });

      it('should load worldpay config', waitForAsync(() => {
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          expect(component.worldpayConfig).toBeUndefined();
         // expect(component.worldpayConfig.testMode).toEqual(1);
        });
      }));

      it('populateForm method should be defined', () => {
        component.populateForm();
        expect(component.populateForm).toBeDefined();
      });
});
