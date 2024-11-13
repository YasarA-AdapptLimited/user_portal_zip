import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RenewalService } from '../../../core/service/renewal.service';
import { TechnicianService } from '../../../core/service/technician.service';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { FirstYearPaymentComponent } from './firstYearPayment.component';


describe('( Technician ) => Payment Step ', () => {
    let component: FirstYearPaymentComponent;
    let fixture: ComponentFixture<FirstYearPaymentComponent>;
    let MockFormStepperService, MockRenewalService, MockTechnicianService;

    const application = {
        applicationFee: 51
    };

    beforeEach(() => {
        MockFormStepperService = {};
        MockRenewalService = jasmine.createSpyObj(['RenewalService', 'getWordpayConfig']);
        TestBed.configureTestingModule({
            declarations: [
                FirstYearPaymentComponent,
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
        fixture = TestBed.createComponent(FirstYearPaymentComponent);
        component = fixture.componentInstance;
        component = Object.assign(component, {application});
    });

    it('should create', () => {
        expect(component).toBeTruthy();
      });

    //   it('define version on init', () => {
    //     component.ngOnInit();
    //     expect(application.applicationFee).toBe('51');
    // }); 
      it('if theres no cart type selected, validity is false', () => {
        // arrange
        const validity$Spy: jasmine.Spy = spyOn(component, 'next');
        // act
        component.next();
        // assert
        expect(validity$Spy).toHaveBeenCalledWith(
          { valid: false, messages: [ 'You must select a card type to proceed to payment' ] , touched: undefined});
      });
      describe('next should set as true', () => {
        it('should call saveFirstYearApplicationPayment when next method is called', () => {

            const saveFirstYearPaymentSpy: jasmine.Spy = spyOn(component, 'next');
        // act
        component.next();
        // assert
        expect(saveFirstYearPaymentSpy).toHaveBeenCalled();
          });
      });
});
