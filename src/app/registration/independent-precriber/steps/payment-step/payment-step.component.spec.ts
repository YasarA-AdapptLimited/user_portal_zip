import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentStepComponent } from './payment-step.component';
import { RenewalService } from '../../../../core/service/renewal.service';
import { IndependentPrescriberService } from '../../../../core/service/independentPrescriber.service';
import { of } from 'rxjs';



describe('( Independent Prescriber ) => Payment Step ', () => {
    let component: PaymentStepComponent;
    let fixture: ComponentFixture<PaymentStepComponent>;
    let MockFormStepperService, MockRenewalService, MockIPService;

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
        {provide: IndependentPrescriberService, useValue: MockIPService},
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
          { valid: false, messages: [ 'You must select a card type to proceed to payment' ] , touched: undefined})
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


      it('populateForm method should be defined', () => {
        component.populateForm();
        expect(component.populateForm).toBeDefined();
      });
    
});
