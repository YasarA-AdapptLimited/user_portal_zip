import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { FormStepComponent } from '../../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../../shared/formStepper/formStepper.service';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';
import { ftpDeclarationObj } from '../../model/FtPDeclaration';

const QUESTION10 = 'Q10';
const QUESTION11 = 'Q11';

@Component({
  selector: 'app-ftp-declarations-two',
  templateUrl: './ftp-declarations-two.component.html',
  styleUrls: ['./ftp-declarations-two.component.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => FtpDeclarationTwoComponent)
    }    
  ]
})

export class FtpDeclarationTwoComponent extends FormStepComponent  implements OnInit {

  stepId = ReturnToRegisterStep.FtpDeclarationsTwo;
  title = 'Fitness to practise declarations (2)';
  declarationHeading = 'Fitness to practise declarations (2)';  
  question10 = new ftpDeclarationObj(QUESTION10);
  question11 = new ftpDeclarationObj(QUESTION11);
  valid;  
  @Input() touched = false;

  constructor(private formStepperService: FormStepperService) {
    super(formStepperService);
   }

  ngOnInit(): void {
    if(this.application.activeForm.restorationDeclarations.length > 0) {
      let ftpDeclaration = this.application.activeForm.restorationDeclarations.find( dec => dec.questionName === QUESTION10);
      if(ftpDeclaration) Object.assign(this.question10, ftpDeclaration);
      ftpDeclaration = this.application.activeForm.restorationDeclarations.find( dec => dec.questionName === QUESTION11);
      if(ftpDeclaration) Object.assign(this.question11, ftpDeclaration);           
    } else {
      this.application.activeForm.restorationDeclarations.push(this.question10, this.question11);
    }
  }

  populateForm() {
    this.updateDetails();
   }

  validate() {     
    let messages = [];
    this.valid = true;

    if(this.question10.isRegistered === undefined || this.question10.isRegistered === null) {
      messages.push('Please let us know if you have worked as pharmacist or pharmacy technician');
    }

    if((this.question11.isRegistered === undefined || this.question11.isRegistered === null)) {
      messages.push('Please let us know if you have used the title ‘pharmacist’ or ‘pharmacy technician’ while not registered with the GPhC');
    }

    if(this.question10.isRegistered) {
      if((this.question10.isInvestigated === undefined || this.question10.isInvestigated === null)) {
        messages.push('Please let us know if your work as pharmacist or pharmacy technician is investigated by the GPhC');      
      } 
      if(this.question10.isInvestigated === true) {
        if(!this.question10.caseReferenceNo || this.question10.caseReferenceNo === '') {
          messages.push('Please enter case reference number');
        }
      }
      if(this.question10.isInvestigated === false) {
        let errorMessages = [];
        if(!this.question10.titleUsed) {
          errorMessages.push(' your job title');
        }   
        if(!this.question10.titleUsedFrom || !this.question10.titleUsedUntil) {          
          errorMessages.push(' dates of your unregistered practise');
        } 
        if(this.question10.titleUsedFrom && this.question10.titleUsedUntil && 
          (new Date(this.question10.titleUsedFrom).setHours(0,0,0,0) > new Date(this.question10.titleUsedUntil).setHours(0,0,0,0))) {
          this.valid = false;          
        }
        if(!this.question10.employerName || this.question10.employerName ==='') {
          errorMessages.push(' employer name');
        }
        if(!this.question10.employerAddress) {
          errorMessages.push(' employer address');
        }
        if(this.question10.employerAddress && !this.question10.employerAddress.homeNation) {
          messages.push('Please select country in which you are resident')
        }
        if(errorMessages.length > 0) {
          let message = 'Please enter'+ errorMessages.toString();
          messages.push(message);
        }        
      }
    }

    if(this.question11.isRegistered) {
      if((this.question11.isInvestigated === undefined || this.question11.isInvestigated === null)) {
        messages.push('Please let us know if the title used had been investigated by the GPhC');        
      }
      if(this.question11.isInvestigated) {
        if(!this.question11.caseReferenceNo || this.question11.caseReferenceNo === '') {
          messages.push('Please enter case reference number');
        }
      }
      if(this.question11.isInvestigated === false) {
        let errorMessages = [];
        if(!this.question11.titleUsed || this.question11.titleUsed === '') {
          errorMessages.push(' the title you used');
        }
        if(!this.question11.titleUsedFrom || !this.question11.titleUsedUntil) {          
          errorMessages.push(' dates of your title use');
        } 
        if(this.question11.titleUsedFrom && this.question11.titleUsedUntil && 
          (new Date(this.question11.titleUsedFrom).setHours(0,0,0,0) > new Date(this.question11.titleUsedUntil).setHours(0,0,0,0))) {
          this.valid = false;          
        }
        if(!this.question11.howWhereUsedIt || this.question11.howWhereUsedIt === '') {
          errorMessages.push(' how or where you used the title');
        } else if(this.question11.howWhereUsedIt.trim().length > 0 &&
          this.question11.howWhereUsedIt.length > 5000){
            this.valid = false;
        }
        if(errorMessages.length > 0) {
          let message = 'Please enter'+ errorMessages.toString();
          messages.push(message);
        }
      }
    }

    this.valid = this.valid && !messages.length;

    this.validity$.next({ valid: this.valid, messages , touched: this.touched });
  }

  updateDetails() {  
    if(this.question10.isRegistered === false) {
      this.question10.setValuesIfNotRegistered();
    }

    if(this.question11.isRegistered === false) {
      this.question11.setValuesIfNotRegistered();
    }

    if(this.question10.isRegistered === true && this.question10.isInvestigated === true) {
      this.question10.setValuesIfInvestigated();
    }
    if(this.question10.isRegistered === true && this.question10.isInvestigated === false) {
      this.question10.setValuesIfNotInvestigated();
    }
    if(this.question11.isRegistered === true && this.question11.isInvestigated === true) {
      this.question11.setValuesIfInvestigated();
    }
    if(this.question11.isRegistered === true && this.question11.isInvestigated === false) {
      this.question11.setValuesIfNotInvestigated();
    }
    this.application.activeForm.restorationDeclarations.splice(0,this.application.activeForm.restorationDeclarations.length );
    this.application.activeForm.restorationDeclarations.push(
      JSON.parse(JSON.stringify(this.question10)), 
      JSON.parse(JSON.stringify(this.question11)));
  }

  onAnswerChange(val) { }

  dateChange() { }

  propagate() {
    this.validate();  
  }

  onDateRangeChange(dates) {
    this.setStartEndDate(this.question10, dates);
  }

  onDatesChange(dates) {
    this.setStartEndDate(this.question11, dates);
  }

  setStartEndDate(dateObject, selectedDates) {
    dateObject.titleUsedFrom = selectedDates.from;
    dateObject.titleUsedUntil = selectedDates.to;
    this.validate();
  }

  update(){
    this.validate();
  }
}
