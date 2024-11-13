
import { Premise } from './Premise';
import { Subject, BehaviorSubject } from 'rxjs';
import { UnregisteredPremise } from './UnregisteredPremise';
import { SupervisingPharmacist } from './SupervisingPharmacist';

export class WorkExperience {

  startDate: string;
  endDate: string;
  id: string;
  supervisingPharmacists: Array<SupervisingPharmacist>;
  supervisingPharmacist: SupervisingPharmacist;
  premise: Premise | UnregisteredPremise;

  updated$ = new Subject();
  overlap$ = new BehaviorSubject<boolean>(false);
  placementId: string;
  isAllocated?: boolean;
  allocationReference?: string;
  workedHoursPerWeek: number;
  jobTitle = '';

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
      // if (!data.jobTitle) {
      //   data.jobTitle = '';
      // }
      if (data.supervisingPharmacist) {
        this.supervisingPharmacists = [data.supervisingPharmacist];
      }
      if (data.id) {
        this.id = data.id;
      }
      Object.assign(this, data);
    } else {
      this.supervisingPharmacists = [undefined];
    }

  }

  updatePremises(premise: Premise | UnregisteredPremise) {
    this.premise = premise;
    this.updated$.next('premise');
  }

  updateSupervisor(superviser: SupervisingPharmacist, index) {
    this.supervisingPharmacists[index] = superviser;
    this.supervisingPharmacist = superviser;
    if (!!this.supervisingPharmacist) {
      this.supervisingPharmacist.id = superviser.gphcId || superviser.gPhCId;
    }
    this.updated$.next('Supervisor');
  }

  updateWorkingHours(hours: string) {
    this.workedHoursPerWeek = +hours;
    this.updated$.next('workingHours');
  }

  updateJobTitle(title: string) {
    this.jobTitle = title;
    this.updated$.next('job title');
  }


  toJson() {
    const payload = Object.assign({}, this);


    if (!!payload.premise) {
      if (!!payload.premise.accreditedTo) {
            delete payload.premise.accreditedTo;
            delete payload.premise.eligibleAsTrainingSite;
         }
    }

    if (!!payload.supervisingPharmacist) {
      if (!!payload.supervisingPharmacist.gphcId &&
          !!payload.supervisingPharmacist.eligibleAsTutor) {
        delete payload.supervisingPharmacist.gphcId;
        delete payload.supervisingPharmacist.gPhCId;
        delete payload.supervisingPharmacist.eligibleAsTutor;
      }
    }

  
    delete payload.supervisingPharmacists;
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


  get workingHoursValid() {
    return this.workedHoursPerWeek >= 14;
  }

  get jobTitleValid() {
    return !!this.jobTitle;
  }

  
  get supervisorValid() {
    const hasSupervisor = this.supervisingPharmacists.filter(supervisor => supervisor !== undefined).length > 0;
    return hasSupervisor;
  }
  

  get datesValid() {
    return !!this.startDate && !!this.endDate;
  }

  get isWithinPermittedRange() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return  start >= this.trainingWindow.start.from && start <= this.trainingWindow.start.to && end <= this.trainingWindow.end.to;
  }


  get premiseValid() {
    return !!this.premise;
  }

  get allocationValid() {
    return true;
  /*  return this.isAllocated === false || (this.isAllocated === true && !!this.allocationReference);*/
  }

  get isValid() {
    return this.premiseValid &&
      this.supervisorValid &&
      this.datesValid &&
      this.workingHoursValid &&
      this.jobTitleValid;
  }

}
