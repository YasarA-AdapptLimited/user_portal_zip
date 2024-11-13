import { Component, OnInit, Input } from '@angular/core';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';

import { TechnicianService } from '../../../core/service/technician.service';
import { TechnicianQualificationType } from '../../model/TechnicianQualificationType';
import { QualificationType } from '../../model/QualificationType';
import { EducationDetails } from '../../model/EducationDetails';
import { TechnicianApplication } from '../../model/TechnicianApplication';

@Component({
  selector: 'app-education-details-step-summary',
  templateUrl: './educationDetailsSummray.component.html',
  styleUrls: ['./educationDetailsSummary.component.scss']
})
export class EducationDetailsSummaryComponent implements OnInit {
  knowledgeQualifications: Array<QualificationType> = [];
  competencyQualifications: Array<QualificationType> = [];
  combinedQualifications: Array<QualificationType> = [];
  @Input() readonly = false;
  @Input() application: TechnicianApplication;

  stepId = TechnicianApplicationStep.Education;
  title = 'Education details';
  viewReady = false;
  knowledgeDateNotSet = false;
  competencyDatesNotSet = false;
  combinedQualificationDateNotSet = false;
  educationDetails;
  isCombinedQualification : boolean;


  constructor(private technicianService: TechnicianService) {
    // super(service);
  }

  ngOnInit() {
    // console.log({application: this.application});
    this.educationDetails = (<TechnicianApplication>this.application).activeForm.educationDetails;
    this.isCombinedQualification = this.application.activeForm.educationDetails.combined.qualificationId !== null ? true : false;
    this.loadKnowledgeQualifications();
    this.loadCompetencyQualifications();
    this.loadCombinedQualifications();
  }

  loadKnowledgeQualifications() {
    this.technicianService.getQualificationList(TechnicianQualificationType.Knowledge).subscribe(qualifications => {
      this.knowledgeQualifications = qualifications;
    });
  }

  loadCompetencyQualifications() {
    this.technicianService.getQualificationList(TechnicianQualificationType.Competency).subscribe(qualifications => {
      this.competencyQualifications = qualifications;
    });
  }

  loadCombinedQualifications() {
    this.technicianService.getQualificationList(TechnicianQualificationType.Combined).subscribe(qualifications => {
      this.combinedQualifications = qualifications;
    });
  }




  populateForm() { }
}

