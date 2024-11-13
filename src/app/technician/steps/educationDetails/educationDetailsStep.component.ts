import { Component, OnInit, forwardRef, AfterViewInit, Input, Output, ChangeDetectorRef, AfterContentChecked, ViewEncapsulation } from '@angular/core';
import { FormStepComponent } from '../../../shared/formStepper/formStep.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';
import { Tooltip } from '../../../core/tooltip/Tooltip';
import { TechnicianService } from '../../../core/service/technician.service';
import { TechnicianQualificationType } from '../../model/TechnicianQualificationType';
import { QualificationType } from '../../model/QualificationType';
import { EducationDetails } from '../../model/EducationDetails';
import { TechnicianApplication } from '../../model/TechnicianApplication';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirmDialog.component';
import { EventEmitter } from '@angular/core';
import { TechnicianApplicationForm } from '../../model/TechnicianApplicationForm';
import { AttachmentType } from '../../../shared/model/AttachmentType';
@Component({
  selector: 'app-education-details-step',
  templateUrl: './educationDetailsStep.component.html',
  providers: [
    {
      provide: FormStepComponent,
      useExisting: forwardRef(() => EducationDetailsStepComponent)
    }
  ],
  styleUrls: ['./educationDetailsStep.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EducationDetailsStepComponent extends FormStepComponent implements AfterViewInit, AfterContentChecked, OnInit {
  knowledgeQualifications: Array<QualificationType> = [];
  competencyQualifications: Array<QualificationType> = [];
  combinedQualifications: Array<QualificationType> = [];
  @Input() readonly = false;
  @Output() navigate = new EventEmitter();
  @Output() dependentDocsStepsCleared = new EventEmitter();

  stepId = TechnicianApplicationStep.Education;
  title = 'Education details';
  viewReady = false;
  knowledgeDateNotSet = false;
  competencyDatesNotSet = false;
  combinedDatesNotSet = false;
  educationDetails: EducationDetails;
  tooltip: Tooltip = {
    id: 'help',
    content: 'Click here for more information.',
    width: 250,
    placement: 'right',
    order: -1
  };
  showHelp = false;
  isDisabled = false;
  attachments = [];

  constructor(service: FormStepperService,
    private technicianService: TechnicianService,
    private dialog: MatDialog, private ref: ChangeDetectorRef
  ) {
    super(service);
  }

  ngOnInit() {
    this.educationDetails = (<TechnicianApplication>this.application).activeForm.educationDetails;
    this.loadKnowledgeQualifications();
    this.loadCompetencyQualifications();
    this.loadCombinedQualifications();
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
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

  updateKnowledgeDates(dates) {
    this.application.activeForm.educationDetails.knowledge.dateCommenced = dates.from;
    this.application.activeForm.educationDetails.knowledge.dateAwarded = dates.to;
    this.knowledgeDateNotSet = false;
    this.update();
  }

  updateCompetencyDates(dates) {
    if ((this.hasValidWorkExperiences && this.hasValidDocs) || this.hasValidWorkExperiences) {
      this.warnForChangeOfDates();
      return;
    }

    this.application.activeForm.educationDetails.competency.dateCommenced = dates.from;
    this.application.activeForm.educationDetails.competency.dateAwarded = dates.to;
    this.competencyDatesNotSet = false;
    this.update();
  }

  updateCombinedDates(dates) {
    this.application.activeForm.educationDetails.combined.dateCommenced = dates.from;
    this.application.activeForm.educationDetails.combined.dateAwarded = dates.to;
    this.combinedDatesNotSet = false;
    this.update();
  }

  get hasValidWorkExperiences() {
    const hasWorkExperiences = !!(<TechnicianApplicationForm>this.application.activeForm).workExperiences.length;
    if (hasWorkExperiences) {
      const hasValidExperiences = (<TechnicianApplicationForm>this.application.activeForm).workExperiences.every(experience => {
        return experience.isValid;
      });
      return hasValidExperiences;
    }
  }

  get hasValidDocs() {
    const hasdocs = !!(<TechnicianApplicationForm>this.application.activeForm).attachments.length;
    if (hasdocs) {
      const hasValidDocTypes = (<TechnicianApplicationForm>this.application.activeForm).attachments.every(docType => {
        return docType.type;
      });
      return hasValidDocTypes;
    }
  }


  warnForChangeOfDates() {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Please confirm',
        message: `Changing the data on this step will clear the following steps if they are filled:
        - Work experience
        - Qualification Supporting document. Do you wish to continue ?
        `
      }
    });
    dialog.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.application.activeForm.clearWorkExperience();
        if (this.hasValidDocs) {
          this.clearQualificationDocs();
        }
      } else {
        this.navigate.emit(this.service.getFurthestStep());
      }
    });
  }


  beforePrev() {
    this.dirty = false;
    return true;
  }

  load() {
    if (this.viewReady) {
      this.ready$.next(true);
      this.populateForm();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.educationDetails = (<TechnicianApplication>this.application).activeForm.educationDetails;
      this.attachments = (<TechnicianApplication>this.application).activeForm.attachments;
      this.ready$.next(true);
      this.viewReady = true;
    });

  }

  update() {
    this.makeDirty();
    this.validate();
  }

  clearQualificationDocs() {
    if (this.attachments.length) {
      if (this.educationDetails.combined.qualificationId !== null) {
        this.attachments = this.application.activeForm.attachments.filter(
          this.removeTechnicianApplicationCombinedQualificationDocs);
      } else if (this.educationDetails.combined.qualificationId === null) {
        this.attachments = this.application.activeForm.attachments.filter(
          this.removeTechnicianApplicationKnowledgeCOmpetencyQualificationDocs);
      }
    }
  }

  removeTechnicianApplicationCombinedQualificationDocs(element, index, array) {
    return element.type !== AttachmentType.CombinedQualification;
  }

  removeTechnicianApplicationKnowledgeCOmpetencyQualificationDocs(element, index, array) {
    return (element.type !== AttachmentType.KnowledgeBasedQualification && element.type !== AttachmentType.CompetencyBasedQualification);
  }

  clearDependentSteps() {
    this.application.activeForm.clearQualificationAttachments();
    this.dependentDocsStepsCleared.emit('cleared');
   }

  validate() {
    const messages = [];
    const today = new Date();
   this.application.activeForm.attachments = this.attachments;
   
   //console.log('attachnments in validate', this.attachments);
   
    const hasKnowledgeQualificationSet = !!this.educationDetails.knowledge.qualificationId;
    const hasCompetencyQualificationSet = !!this.educationDetails.competency.qualificationId;
    const hasCombinedQualificationSet = !!this.educationDetails.combined.qualificationId;

    const hasKnowledgeDateCommencedSet = !!this.educationDetails.knowledge.dateCommenced;
    const hasKnowledgeDateAwardedSet = !!this.educationDetails.knowledge.dateAwarded;

    const hasCompetencyDateCommencedSet = !!this.educationDetails.competency.dateCommenced;
    const hasCompetencyDateAwardedSet = !!this.educationDetails.competency.dateAwarded;

    const hasCombinedDateCommencedSet = !!this.educationDetails.combined.dateCommenced;
    const hasCombinedDateAwardedSet = !!this.educationDetails.combined.dateAwarded;

    const { dateAwarded: knowledgeDateAwarded_ } = this.application.activeForm.educationDetails.knowledge;
    const { dateAwarded: competencyDateAwarded_ } = this.application.activeForm.educationDetails.competency;
    const { dateAwarded: combinedDateAwarded_ } = this.application.activeForm.educationDetails.combined;


    if (this.educationDetails.knowledge.qualificationId === null) {
     
      this.application.activeForm.educationDetails.knowledge.dateCommenced = null;
      this.application.activeForm.educationDetails.knowledge.dateAwarded = null;
    }
    if (this.educationDetails.competency.qualificationId === null) {
    
      this.application.activeForm.educationDetails.competency.dateCommenced = null;
      this.application.activeForm.educationDetails.competency.dateAwarded = null;
    }
    if (this.educationDetails.combined.qualificationId === null) {
      this.application.activeForm.educationDetails.combined.id = null;
      this.application.activeForm.educationDetails.combined.dateCommenced = null;
      this.application.activeForm.educationDetails.combined.dateAwarded = null;
    } else if (this.educationDetails.combined.qualificationId !== null) {
      this.application.activeForm.educationDetails.knowledge.id = null;
      this.application.activeForm.educationDetails.competency.id = null;
    }

    if (new Date(knowledgeDateAwarded_) > today) {
      this.knowledgeDateNotSet = true;
      messages.push(`Knowledge date awarded must not be after today`);
    }

    if (new Date(competencyDateAwarded_) > today) {
      this.competencyDatesNotSet = true;
      messages.push(`Competency date awarded must not be after today`);
    }

    if (new Date(combinedDateAwarded_) > today) {
      this.combinedDatesNotSet = true;
      messages.push(`combined date awarded must not be after today`);
    }

    if ((hasKnowledgeQualificationSet && hasCombinedQualificationSet) ||
      (hasCompetencyQualificationSet && hasCombinedQualificationSet)) {
      messages.push('Please select either knowledge & competency qualification (or) combined qualification');
    }

    if (!hasKnowledgeQualificationSet &&
      !hasCompetencyQualificationSet && !hasCombinedQualificationSet) {
      messages.push('Please select either knowledge & competency qualification (or) combined qualification');
    }
    if ((hasKnowledgeDateCommencedSet &&
      hasKnowledgeDateAwardedSet &&
      hasCompetencyDateCommencedSet &&
      hasCompetencyDateAwardedSet)) {

      const knowledgeDateCommenced = this.application.activeForm.educationDetails.knowledge.dateCommenced;
      const knowledgeDateAwarded = this.application.activeForm.educationDetails.knowledge.dateAwarded;
      const competencyDateCommenced = this.application.activeForm.educationDetails.competency.dateCommenced;
      const competencyDateAwarded = this.application.activeForm.educationDetails.competency.dateAwarded;

      this.validateQualificationDates(knowledgeDateCommenced, knowledgeDateAwarded,
        competencyDateCommenced, competencyDateAwarded, messages);
    }

    if (hasCombinedDateCommencedSet && hasCombinedDateAwardedSet) {
      const combinedDateCommenced = this.application.activeForm.educationDetails.combined.dateCommenced;
      const combinedDateAwarded = this.application.activeForm.educationDetails.combined.dateAwarded;

      this.validateCombinedQualificationDates(combinedDateCommenced, combinedDateAwarded, messages);
    }
    this.validity$.next({ valid: !messages.length, messages, touched: this.touched });
  }
  validateQualificationDates(knowledgeDateCommenced, knowledgeDateAwarded, competencyDateCommenced, competencyDateAwarded, messages) {
    let commencedDateForFirst: Date, awardDateForLast: Date, awardDateForLastPlusTwoYears: Date, commencedDateForFirstPlusFiveYears: Date;

    if (knowledgeDateCommenced !== null && knowledgeDateAwarded !== null &&
      competencyDateCommenced !== null && competencyDateAwarded !== null) {
      commencedDateForFirst = (knowledgeDateCommenced >= competencyDateCommenced ? new Date(competencyDateCommenced) :
        new Date(knowledgeDateCommenced));
      awardDateForLast = knowledgeDateAwarded >= competencyDateAwarded ? new Date(knowledgeDateAwarded) : new Date(competencyDateAwarded);
      awardDateForLast.setHours(0, 0, 0, 0);

      awardDateForLastPlusTwoYears = awardDateForLast;
      awardDateForLastPlusTwoYears.setMonth(awardDateForLast.getMonth() + 24);
      awardDateForLastPlusTwoYears.setHours(0, 0, 0, 0);

      commencedDateForFirstPlusFiveYears = commencedDateForFirst;
      commencedDateForFirstPlusFiveYears.setMonth(commencedDateForFirst.getMonth() + 60);
      commencedDateForFirstPlusFiveYears.setHours(0, 0, 0, 0);

      const lastDateOfCommencedPlusFiveYears = new Date(commencedDateForFirstPlusFiveYears.getFullYear(), 12, 31);
      lastDateOfCommencedPlusFiveYears.setHours(0, 0, 0, 0);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if ((commencedDateForFirstPlusFiveYears < todayDate && todayDate > lastDateOfCommencedPlusFiveYears)) {
        messages.push(`You do not appear to meet the eligibility criteria to register as a
        pharmacy technician, please contact the GPhC for further information.`);
      }
      const lastDateOfAwardPlusTwoYear = new Date(awardDateForLastPlusTwoYears.getFullYear(), 12, 31);
      lastDateOfAwardPlusTwoYear.setHours(0, 0, 0, 0);
      if (awardDateForLastPlusTwoYears < todayDate && todayDate > lastDateOfAwardPlusTwoYear) {
        messages.push(`You do not appear to meet the eligibility criteria to register as a pharmacy technician,
        please contact the GPhC for further information.`);
      }
    }
  }

  validateCombinedQualificationDates(combinedDateCommenced, combinedDateAwarded, messages) {
    let combinedCommencedDateForFirst: Date, combinedAwardDateForLast: Date,
      combinedAwardDateForLastPlusTwoYears: Date, combinedCommencedDateForFirstPlusFiveYears: Date;

    if (combinedDateCommenced !== null && combinedDateAwarded !== null) {
      combinedCommencedDateForFirst = new Date(combinedDateCommenced);
      combinedAwardDateForLast = new Date(combinedDateAwarded);
      combinedAwardDateForLast.setHours(0, 0, 0, 0);

      combinedAwardDateForLastPlusTwoYears = combinedAwardDateForLast;
      combinedAwardDateForLastPlusTwoYears.setMonth(combinedAwardDateForLast.getMonth() + 24);
      combinedAwardDateForLastPlusTwoYears.setHours(0, 0, 0, 0);

      combinedCommencedDateForFirstPlusFiveYears = combinedCommencedDateForFirst;
      combinedCommencedDateForFirstPlusFiveYears.setMonth(combinedCommencedDateForFirst.getMonth() + 60);
      combinedCommencedDateForFirstPlusFiveYears.setHours(0, 0, 0, 0);

      const lastDateOfCommencedPlusFiveYears = new Date(combinedCommencedDateForFirstPlusFiveYears.getFullYear(), 12, 31);
      lastDateOfCommencedPlusFiveYears.setHours(0, 0, 0, 0);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if ((combinedCommencedDateForFirstPlusFiveYears < todayDate && todayDate > lastDateOfCommencedPlusFiveYears)) {
        messages.push(`You do not appear to meet the eligibility criteria to register as a
        pharmacy technician, please contact the GPhC for further information.`);
      }
      const lastDateOfAwardPlusTwoYear = new Date(combinedAwardDateForLastPlusTwoYears.getFullYear(), 12, 31);
      lastDateOfAwardPlusTwoYear.setHours(0, 0, 0, 0);
      if (combinedAwardDateForLastPlusTwoYears < todayDate && todayDate > lastDateOfAwardPlusTwoYear) {
        messages.push(`You do not appear to meet the eligibility criteria to register as a pharmacy technician,
        please contact the GPhC for further information.`);
      }
    }
  }

  populateForm() { }
}

