import { Input, Component, forwardRef, OnInit, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ReturnToRegisterService } from '../../../../core/service/returnToRegister.service';
import { FormStepComponent } from '../../../..//shared/formStepper/formStep.component';
import { FormStepperService } from '../../../..//shared/formStepper/formStepper.service';
import { ReturnToRegisterApplication } from '../../model/ReturnToRegister';
import { ReturnToRegisterStep } from '../../model/ReturnToRegisterStep';


@Component({
  selector: 'app-rtr-review-step',
  templateUrl: './rtrReviewStep.component.html',
  styleUrls: ['./rtrReviewStep.scss'],
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => RtrReviewStepComponent)
    }
  ]
}) export class RtrReviewStepComponent extends FormStepComponent implements OnInit,AfterViewInit {
  title;
  @Input() stepId = ReturnToRegisterStep.Review;  
  applicant:ReturnToRegisterApplication;
  returnToRegisterStep = ReturnToRegisterStep;
  @Input() readonly = false;
  //placements: Array<Placement>;

  constructor(service: FormStepperService, private rtrService: ReturnToRegisterService) {
    super(service);
  }

  @Output() navigate = new EventEmitter<number>();

  ngOnInit() {    
    this.title = this.readonly ? 'Final review' : 'Review';
  }

  validate() {
    this.validity$.next({ valid: true, messages: [], touched: this.touched });
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.ready$.next(true);
     //this.viewReady = true;
    });
  }


  load() {
    this.ready$.next(true);
  }

  populateForm() { }

}
