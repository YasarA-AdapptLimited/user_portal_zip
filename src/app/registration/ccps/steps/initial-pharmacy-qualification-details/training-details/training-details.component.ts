import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trainingDetails } from '../../../model/initialPharmacyQualificationDetail';

@Component({
  selector: 'app-training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.scss']
})
export class TrainingDetailsComponent implements OnInit {
  editTrainingRow;
  addTrainingFlag: boolean = false;
  startDateTouched;
  endDateTouched;
  isEditTrainingDetails = false;
  @Input() trainingDetailsExists: boolean;
  @Input() existingTrainingDetails = [];
  trainingDetails: trainingDetails[];
  @Input() invalid: boolean = false;
  trainingDetailsSaved = false;
  @Output() saveTrainingDetails = new EventEmitter();
  dateRangeInvalid: boolean = false;
  currentDate = new Date();
  // allowEditOthers = true;
  @Input() touched = false;

  ngOnInit() {
    if (this.existingTrainingDetails && this.existingTrainingDetails.length > 0) {
      this.trainingDetails = this.existingTrainingDetails;
    } else {
      this.editTrainingRow = 0;
      this.initiateTrainingDetails();
    }
    if (this.trainingDetails?.length > 0 && this.trainingDetails?.length < 5 && !this.trainingDetailsExists && !this.checkObjectHasNullEmptyValue(this.trainingDetails[this.trainingDetails.length - 1])) this.addTrainingFlag = true;
  }

  addNew() {
    this.initiateTrainingDetails();
    this.editTrainingRow = this.trainingDetails.length - 1;
    this.isEditTrainingDetails = true;
    this.addTrainingFlag = false;
    // this.allowEditOthers = false;
    this.setstartEndDateNull();
  }

  editTrainingDetails(row) {
    this.addTrainingFlag = false;
    this.editTrainingRow = row;
    this.saveTrainingDetails.emit(this.trainingDetails);
    this.isEditTrainingDetails = true;
  }

  initiateTrainingDetails() {
    if (!this.trainingDetails) this.trainingDetails = [];
    this.trainingDetails.push({
      trainingSiteName: '',
      trainingSiteAddress: '',
      trainingStartDate: null,
      trainingEndDate: null
    });
  }

  updateTraining(i, updatedTrainingDetails) {
    if (this.trainingDetails.length < 5) this.addTrainingFlag = true;
    this.editTrainingRow = null;
    this.isEditTrainingDetails = false;
    this.trainingDetailsSaved = true;
    // this.allowEditOthers = true;
    this.saveTrainingDetails.emit(this.trainingDetails);
  }

  setstartEndDateNull() {
    this.startDateTouched = false;
    this.endDateTouched = false;
  }

  deleteTrainingDetails(index) {
    this.trainingDetails.splice(index, 1);
    this.editTrainingRow = null;
    this.saveTrainingDetails.emit(this.trainingDetails);
    this.dateRangeInvalid = false;
    this.isEditTrainingDetails = false;
    // this.allowEditOthers = true;

    if (this.trainingDetails.length === 0) {
      this.initiateTrainingDetails();
      this.editTrainingRow = 0;
      this.addTrainingFlag = false;
      this.trainingDetailsSaved = false;
    } else this.addTrainingFlag = true;
    this.setstartEndDateNull();
  }

  getErrorOnDelete(training) {
    let showErr = false;
    if(training) showErr = this.checkObjectHasNullEmptyValue(training);
    return showErr;
  }

  isDatePickerClicked(type) {
    if (type === 'startDate') this.startDateTouched = true;
    if (type === 'endDate') this.endDateTouched = true;
  }

  onDateChange(training) {
    if (training.trainingStartDate && training.trainingEndDate) {
      this.dateRangeInvalid = new Date(training.trainingStartDate) > new Date(training.trainingEndDate) ? true : false;
    }
  }

  allowSave(training: { siteName: string; siteAddress: string; startDate: Date; endDate: Date }) {
    return training['trainingSiteName'] && training['trainingSiteAddress'] && training['trainingStartDate'] && training['trainingEndDate'] && !this.dateRangeInvalid && training['trainingSiteName'].length < 2001 && training['trainingSiteAddress'].length < 3001;
  }

  get getTrainingRowEditable(): number{
    return this.editTrainingRow;
  }

  checkObjectHasNullEmptyValue(obj): boolean {
    for (const [key, value] of Object.entries(obj)) {
      if (!value || value === '') return true;
    }
    return false;
  }
}
