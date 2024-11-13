import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { TechnicianService } from '../../core/service/technician.service';
import { TechnicianActivation } from './model/TechnicianActivation';

@Component({
  selector: 'app-technician-confirmation',
  templateUrl: './technician-confirmation.component.html',
  styleUrls: ['./accountActivation.scss', './technician-confirmation.component.scss']
})
export class TechnicianConfirmationComponent implements OnInit {

  steps = [0, 1];
  activation: TechnicianActivation;
  currentStep;
  selectedAnswer;
  loading = false;
  serverErrors;
  confirmationFailed = false;

  constructor(private auth: AuthService,
    private technicianService: TechnicianService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.technicianService.getTechnicianDetails()
      .subscribe(technicianDetails => {
        this.activation = technicianDetails;
        this.loading = false;
      });
  }

  selectWhetherConfirmed(answer: boolean): void {
    this.selectedAnswer = answer;
    if (this.selectedAnswer) {
      this.technicianService.confirmTechnicianDetails(this.activation).subscribe(() => {
        setTimeout(() => {
          this.auth.logout();
        }, 3000);
      }, error => {
        this.confirmationFailed = true;
        this.serverErrors = error;
      });
    }
    this.currentStep = 1;
  }

}
