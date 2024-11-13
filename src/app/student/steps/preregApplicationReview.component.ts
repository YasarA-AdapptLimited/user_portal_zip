import { Input, Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Applicant } from '../../account/model/Applicant';
import { PreregApplicationStep } from '../../shared/model/student/PreregApplicationStep';
import { PreregApplication } from '../../shared/model/student/PreregApplication';
import { Placement } from '../../shared/model/student/Placement';
import { TrainingSchemeType } from '../../shared/model/student/TrainingSchemeType';
import { StudentService } from '../../core/service/student.service';

@Component({
  selector: 'app-prereg-application-review',
  templateUrl: './preregApplicationReview.component.html',
  styleUrls: ['./preregApplicationReview.scss']
}) export class PreregApplicationReviewComponent  implements OnInit {

  applicant: Applicant;
  @Input() application: PreregApplication;
  @Input() readonly = false;
  @Input() showEdi = true;
  @Input() formId;
  @Input() pastApplication = false;
  PreregApplicationStep = PreregApplicationStep;
  placements: Array<Placement>;
  TrainingSchemeType = TrainingSchemeType;

  constructor(private studentService: StudentService) {
    
  }

  @Output() navigate = new EventEmitter<number>();
  ngOnInit() {
    this.applicant = this.application.trainee;
    
    if(this.pastApplication)
    {
        this.studentService.getPlacements(this.formId).subscribe(
          data => {            
            this.placements = data.placements;
            this.application.activeForm.trainingScheme = data.trainingScheme;
            data.placements.forEach(placement => {
              placement.trainingWindow.end.to = new Date(this.application.trainee.registrationDateLimit.split('T')[0]);
            }); 
          }
      )
    }
    else
    {
      this.placements = this.application.activeForm.placements;
    }
    
  }

  nth(i) {
    return i === 0 ? 'first' : (i === 1 ? 'second' : 'third');
  }

  goToStep(stepId) {
    this.navigate.emit(stepId);
  }
}
