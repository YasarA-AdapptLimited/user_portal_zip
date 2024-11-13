import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { LogService } from './log.service';
import { CustomErrorHandler } from './CustomErrorHandler';
import { RegisterSearchParams, RegisterSearchBy, RegisterSearchResult } from '../../registration/model/RegisterSearchParams';
import { of as observableOf, from as observableFrom, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LetterType } from '../../registration/model/LetterType';
import { PremisesSearchParams, PremisesSearchResult, PremisesSearchBy } from '../../registration/model/PremisesSearchParams';
import { Address } from '../../account/model/Address';
import { ApplicationDetails } from '../../registration/model/ApplicationDetails';
import { ServiceBase } from './service.base';
import { HttpClient } from '@angular/common/http';

const mockLetters = [
  {
    letterType: LetterType.Remediation,
    letterDate: '2016-07-05T00:00:00',
    data: {}
  },
  {
    letterType: LetterType.NoticeOfIntentToRemove,
    letterDate: '2017-07-05T00:00:00',
    data: {}
  }, {
    letterType: LetterType.NoticeOfRemoval,
    letterDate: '2018-07-05T00:00:00',
    data: {}
  }, {
    letterType: LetterType.NoticeOfEntry,
    letterDate: '2015-07-05T00:00:00',
    data: {}
  }
];


@Injectable()
export class RegistrationService extends ServiceBase {

  letters;
  ccpsRegBodieSelected$ = new BehaviorSubject<Array<{formId: string, regulatoryBodyId: string}>>([]);

  constructor(
    http: HttpClient,
    auth: AuthService,
    log: LogService,
    errorHandler: CustomErrorHandler
  ) {
    super(http, auth, log, errorHandler);
  }

  searchRegister(params: RegisterSearchParams): Observable<Array<RegisterSearchResult>> {
    const gphcId = results => {
      return results.map(result => {
        result.gphcId = result.gPhCId;
        return result;
      });
    };

    let url = params.applicationType ? `/v1.0/registrant/autocomplete?Skip=${params.skip}&Take=${params.take}&${params.applicationType}=true&` :
              `/v1.0/registrant/autocomplete?Skip=${params.skip}&Take=${params.take}&`;
      if(params.searchBy === RegisterSearchBy.Number) {
        url = url + `RegistrationNumber=${params.regNumber}`
      } else {
        url = params.firstName ? (params.lastName ? url + `Forenames=${params.firstName}&Surname=${params.lastName}` : url + `Forenames=${params.firstName}`) : 
              url + `Surname=${params.lastName}`;
      }

    return super.get(url).pipe(map(gphcId));    
  }

  searchPremises(params: PremisesSearchParams): Observable<Array<PremisesSearchResult>> {
    const premisesAddress = premises => {
      premises.map(premise => {
        premise.address = new Address(premise.address);
      });
      return premises;
    };
    switch (params.searchBy) {
      case PremisesSearchBy.Postcode:
        return super.get(`v1.0/premise/${params.postcode}`)
          .pipe(map(result => result.premises))
          .pipe(map(premisesAddress));
      case PremisesSearchBy.Number:
        return super.get(`v1.0/premise/${params.regNumber}`)
          .pipe(map(result => result.premises))
          .pipe(map(premisesAddress));
      default:
        return observableOf([]);
    }

  }

  getLetters() {
    if (this.letters) {
      return observableOf(this.letters);
    } else {
      return super.get('/v1.0/registrant/letters?Skip=0&Take=1?Skip=0&Take=1')
        .pipe(tap(letters => {
          this.letters = letters;
        }));
    }
  }

  getLearningContracts() {
    return super.get('/v1.0/tutor/learningcontracts');
  }


  submitLearningContractResponse(payload) {
    return super.post('/v1.0/tutor/learningcontracts/decision', payload);
  }

  getLearningContract(formId) {
    return super.get(`v1.0/tutor/learningcontract/?formId=${formId}`);
  }

  createLetters() {
    return super.get('v1.0/registrant/letters/create');
  }

  getAvailableForms() : Observable<ApplicationDetails> {    
      return super.get('v1.0/registrant/availableforms');
  }
}
