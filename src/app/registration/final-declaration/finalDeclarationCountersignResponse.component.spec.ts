import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollapsibleComponent } from '../../shared/collapsible.component';
import { AuthService } from '../../core/service/auth.service';
import { FinalDeclarationService } from '../../core/service/finalDeclaration.service';
import { FinalDeclarationCountersignResponseComponent } from './finalDeclarationCountersignResponse.component';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CountersignatureOutcome } from '../../prereg/model/CountersignatureOutcome';

describe('Final Declaration Counter Sign Response Component', () => {
    let fixture: ComponentFixture<FinalDeclarationCountersignResponseComponent>;
    let component: FinalDeclarationCountersignResponseComponent;
    let app: any;
    let MockAuthService: jasmine.Spy;
    let mockFinalDeclarationService = jasmine.createSpyObj('FinalDeclarationService',['submitCountersignatureOutcome','formatAddress','focusOnInvalidInputs']);    
    let routerSpy =  { navigate: jasmine.createSpy('navigate')};
    let form;
    let formDefaultValue = {
      'anyProblemsEffected':'no',
      'traineeProgressComments':'test',
      'annualLeaves': 1,
      'sickLeaves': 1,
      'otherLeaves':1,
      'otherLeaveDetails':1,
      'response': CountersignatureOutcome.Rejected,
      'professionalHealthcareName':'test',
      'professionalHealthJobRole':'technician',
      'professionalHealthRegNumber':'123',
      'responseReason':'test'
    };
    MockAuthService = jasmine.createSpyObj(['logout']);

    beforeEach(async() => {          
      TestBed.configureTestingModule({
        declarations: [ FinalDeclarationCountersignResponseComponent,
                        CollapsibleComponent                         
                      ],
        imports: [ FormsModule, MatRadioModule, BrowserAnimationsModule ],
        providers: [{ provide: AuthService, useValue: MockAuthService },
                    { provide: FinalDeclarationService, useValue: mockFinalDeclarationService },
                    { provide: ActivatedRoute, useValue:  {
                      snapshot: 
                      {
                        params: {
                          id: '24fkzrw3487943uf358lovd',
                          date: '13-04-2021',
                          role: 'student'
                        }
                      }
                    }},
                    { provide: Router, useValue: routerSpy}]
      }).compileComponents();        
    });

    beforeEach(fakeAsync(()=> {
        fixture = TestBed.createComponent(FinalDeclarationCountersignResponseComponent);
        component = fixture.componentInstance;
        app = fixture.debugElement.componentInstance;     
        mockFinalDeclarationService.submitCountersignatureOutcome.and.returnValue(of('Submitted successfully'));
        fixture.detectChanges(); 
        tick();
        form = fixture.componentInstance.countersignForm.form;
        form.setValue(formDefaultValue);
        flush();
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should format name', () => {
      let traineetName = {
          title : { name: 'Mr' },
          forenames: ['KhH1121993'],
          middleName : null,
          surname: 'GhH1121993'
        };
        expect(component.formatName(traineetName)).toBe('Mr KhH1121993  GhH1121993');
    });

    it('should call format address on onint', () =>{
      const spyFormatAddress = spyOn(component, 'formatAddress');
      component.ngOnInit();
      expect(spyFormatAddress).toHaveBeenCalled();
    });

    it('should call submitOutcome method on button click', fakeAsync(() =>{      
      fixture.detectChanges();
      tick();
      spyOn(component, 'submitOutcome');
      let button = fixture.debugElement.nativeElement.querySelector('button');               
      button.click();
      expect(component.submitOutcome).toHaveBeenCalled();
      flush();
    }));

    it('should navigate to /registration on submit', () => { 
      component.exit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/registration']);
    });

    it('should print', () => {
      let windowOpenSpy = spyOn(window, 'print');
      component.print();
      expect(windowOpenSpy).toHaveBeenCalled();
    });    

    it('annual leaves - form control should be invalid if value is null', (fakeAsync(() =>{  
        form.controls['annualLeaves'].setValue(null);
        fixture.detectChanges();        
        expect(form.controls['annualLeaves'].valid).toBeFalsy()         
        flush();
    })));

    it('annual leaves - form control should be valid if value is valid', (fakeAsync(() =>{  
        fixture.detectChanges();        
        expect(form.controls['annualLeaves'].valid).toBeTrue();         
        flush();
    })));

    it('sick leaves - form control should be invalid if value is null', (fakeAsync(() =>{  
        form.controls['sickLeaves'].setValue(null);
        fixture.detectChanges();        
        expect(form.controls['sickLeaves'].valid).toBeFalsy()         
        flush();
    })));

    it('sick leaves - form control should be valid if value is valid', (fakeAsync(() =>{  
        fixture.detectChanges();        
        expect(form.controls['sickLeaves'].valid).toBeTrue();         
        flush();
    })));


    it('other leaves - form control should be invalid if value is null', (fakeAsync(() =>{        
        form.controls['otherLeaves'].setValue(null);
        fixture.detectChanges();        
        expect(form.controls['otherLeaves'].valid).toBeFalsy()         
        flush();
    })));

    it('other leaves - form control should be valid if value is valid', (fakeAsync(() =>{        
        fixture.detectChanges();        
        expect(form.controls['otherLeaves'].valid).toBeTrue();         
        flush();
    })));

    it('response reason - form control should be invalid if value is null', (fakeAsync(() =>{        
        form.controls['responseReason'].setValue(null);
        fixture.detectChanges();        
        expect(form.controls['responseReason'].valid).toBeFalsy()         
        flush();
    })));

    it('response reason - form control should be valid if value is valid', (fakeAsync(() =>{        
        fixture.detectChanges();        
        expect(form.controls['responseReason'].valid).toBeTrue();         
        flush();
    })));

    it('any problems affected - form control should be invalid if value is null', (fakeAsync(() =>{             
        form.controls['anyProblemsEffected'].setValue(null);   
        expect(form.controls['anyProblemsEffected'].valid).toBeFalsy()         
        flush();
    })));

    it('any problems effected - form control should be valid if value is valid', (fakeAsync(() =>{        
        fixture.detectChanges();        
        expect(form.controls['anyProblemsEffected'].valid).toBeTrue();         
        flush();
    })));

    it('trainee progress comments - form control should be invalid if value is null', (fakeAsync(() =>{        
        form.controls['traineeProgressComments'].setValue(null);
        fixture.detectChanges();        
        expect(form.controls['traineeProgressComments'].valid).toBeFalsy()         
        flush();
    })));

    it('trainee progress comments - form control should be valid if value is valid', (fakeAsync(() =>{        
        fixture.detectChanges();        
        expect(form.controls['traineeProgressComments'].valid).toBeTrue();         
        flush();
    })));

    it('on submit when response is refused submitOutcome method should be called with countersignerComment=""', fakeAsync(() => {      
        form.controls['response'].setValue(CountersignatureOutcome.Refused);
        fixture.detectChanges();  
        component.submitOutcome(component.countersignForm.value);
        expect(mockFinalDeclarationService.submitCountersignatureOutcome).toHaveBeenCalled();
        flush();
    }));

    it('should call focusOnInvalidInputs method when countersignature response is approved and the form is invalid', fakeAsync(() => {
    spyOn(component, 'focusOnInvalidInputs');    
      form.controls['anyProblemsEffected'].setValue('');
      form.controls['response'].setValue(CountersignatureOutcome.Approved);
      fixture.detectChanges(); 
      component.submitOutcome(component.countersignForm.value);
      expect(component.focusOnInvalidInputs).toHaveBeenCalled();
      flush();
    }));

    it('should call focusOnInvalidInputs method when countersignature response is rejected and the form is invalid', fakeAsync(() => {
      spyOn(component, 'focusOnInvalidInputs');      
        form.controls['anyProblemsEffected'].setValue('');
        form.controls['response'].setValue(CountersignatureOutcome.Rejected);
        fixture.detectChanges(); 
        component.submitOutcome(component.countersignForm.value);
        expect(component.focusOnInvalidInputs).toHaveBeenCalled();
        flush();
    }));

    it('should call submitCountersignatureOutcome method when countersignature response is approved and the form is valid', fakeAsync(() => {
        spyOn(component, 'focusOnInvalidInputs');        
          form.controls['response'].setValue(CountersignatureOutcome.Approved);
          fixture.detectChanges(); 
          component.submitOutcome(component.countersignForm.value);
          expect(mockFinalDeclarationService.submitCountersignatureOutcome).toHaveBeenCalled();
          flush();
    }));
    
    it('should call submitCountersignatureOutcome method when countersignature response is rejected and the form is valid', fakeAsync(() => {
          spyOn(component, 'focusOnInvalidInputs');          
            form.controls['response'].setValue(CountersignatureOutcome.Rejected);
            fixture.detectChanges(); 
            component.submitOutcome(component.countersignForm.value);
            expect(mockFinalDeclarationService.submitCountersignatureOutcome).toHaveBeenCalled();
            flush();
    }));
});
