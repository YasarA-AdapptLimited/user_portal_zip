import { Tutor } from './Tutor';
import { TrainingSite } from './TrainingSite';
import { Premise } from './Premise';
import { Subject, BehaviorSubject } from 'rxjs';
import { LearningContractResponse } from './LearningContractResponse';

export class Placement {

  startDate: string;
  endDate: string;
  trainingSite: TrainingSite;
  tutors: Array<Tutor>;
  updated$ = new Subject();
  overlap$ = new BehaviorSubject<boolean>(false);
  placementId: string;
  isAllocated?: boolean;
  allocationReference?: string;

  trainingWindow: {
    start: {
      from: Date,
      to: Date
    },
    end: {
      to: Date
    }
  };


  constructor(data?) {
    if (data) {
      if (!data.trainingScheme) {
        data.trainingScheme = {};
      }
      Object.assign(this, data);
      if ((<any>this.trainingSite).premise.premiseId) {
        (<any>this.trainingSite).premise.id = (<any>this.trainingSite).premise.premiseId;
      }
      this.tutors.forEach(tutor => {
        delete (<any>tutor).gPhCId;
        if ((<any>tutor).tutorgPhCId) {
          (<any>tutor).gphcId = (<any>tutor).tutorgPhCId;
        }
      });

    } else {
      this.tutors = [undefined];
      this.trainingSite = {};
    }

  }

  updatePremises(premise: Premise) {
    this.trainingSite = { premise };
    this.updated$.next('premise');
  }

  updateTutor(tutor: Tutor, index) {
    this.tutors[index] = tutor;
    this.updated$.next('tutor');
  }


  toJson() {
    const payload = Object.assign({}, this);

    (<any>payload.trainingSite).premise.premiseId = (<any>payload.trainingSite).premise.id;
    payload.tutors.forEach(tutor => {
      delete (<any>tutor).gPhCId;
      (<any>tutor).tutorGphcId = tutor.gphcId;
    });
    delete payload.updated$;
    delete payload.overlap$;
    return payload;

  }

  setDaterange(daterange) {
    if (this.startDate !== daterange.from || this.endDate !== daterange.to) {

      this.startDate = daterange.from;
      this.endDate = daterange.to;
      this.updated$.next('dates');
    }

  }


  addTutor() {
    this.tutors.push(undefined);
    this.updated$.next();
  }

  removeTutor(index) {
    this.tutors.splice(index, 1);
    this.updated$.next();
  }

  get tutorValid() {
    const hasTutor = this.tutors.filter(tutor => tutor !== undefined).length > 0;
    return hasTutor && !this.contractRejected && this.tutorsEligible;
  }

  get tutorsEligible() {
    const hasIneligible =  this.tutors.find(tutor => tutor !== undefined &&  tutor.eligibleAsTutor === false);
    return !hasIneligible;
  }

  get contractRejected() {
    return this.tutors.filter(tutor => tutor && (tutor.learningContractResponse === LearningContractResponse.Rejected ||
      tutor.learningContractResponse === LearningContractResponse.Refused)).length > 0;
  }

  get datesValid() {
    return !!this.startDate && !!this.endDate;
  }

  get isWithinPermittedRange() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return  start >= this.trainingWindow.start.from && start <= this.trainingWindow.start.to && end <= this.trainingWindow.end.to;
  }


  get trainingSiteValid() {
    return !!this.trainingSite.premise &&
      this.trainingSite.isOwner !== undefined &&
      this.trainingSite.isRelated !== undefined;
  }



  get allocationValid() {
    return true;
  /*  return this.isAllocated === false || (this.isAllocated === true && !!this.allocationReference);*/
  }

  get isValid() {
    return this.trainingSiteValid &&
      this.tutorValid && this.datesValid; // && this.allocationValid;
  }

}
