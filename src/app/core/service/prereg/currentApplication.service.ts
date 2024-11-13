import { Injectable } from '@angular/core';
import { ServiceBase } from '../service.base';
import { BehaviorSubject } from 'rxjs';
import { Applicant } from '../../../account/model/Applicant';
import { FormScope } from '../../../registration/model/FormScope';
import { Application } from '../../../prereg/model/Application';
import { IndependentPrescriberApplication } from '../../../registration/independent-precriber/model/IndependentPrescriberApplication';
import { Registrant } from '../../../registration/model/Registrant';
@Injectable()
export class CurrentApplicationService {

    trainee: BehaviorSubject<Applicant> = new BehaviorSubject(null);
    availableForm: BehaviorSubject<FormScope> = new BehaviorSubject(0);
    registrant: BehaviorSubject<Registrant> = new BehaviorSubject(null);

    setTrainee(application: Application): void {
        const { trainee } = application;
        this.trainee.next(trainee);
    }

    setIPRegistrant(application: IndependentPrescriberApplication): void {
        const { registrant } = application;
        this.registrant.next(registrant);
    }
}
