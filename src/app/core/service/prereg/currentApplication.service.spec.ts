import { TestBed, inject } from '@angular/core/testing';
import { Application } from '../../../prereg/model/Application';
import { CurrentApplicationService } from './currentApplication.service';

describe('Current Application Service', () => {
  let testService: CurrentApplicationService;
  const application: Application = {
    trainee: {
    title: { name: 'XYZ', id: 0 },
    forenames: '',
    middleName: '',
    surname: '',
    address: {
        line1: 'XXX',
        line2: '',
        line3: '',
        town: 'YYY',
        county: 'ZZZ',
        postcode: 'X123',
        country: 'XYZ'
    },
    contact: {
        email: 'test@test.com',
        mobilePhone: '123456789',
        telephone1: ''
    },
    dateOfBirth: '01-01-1985',
    qualification: { courseName: 'pharmacy', courseType: 1 },
    equalityDiversity: {
        ethnicity: 0,
        ethnicityOther: '',
        nationality: 0,
        religion: 0,
        religionOther: '',
        disabled: 0,
        disabilityDetails: '',
        gender: 0,
        sexualOrientation: 0
    }},                        
    forms: [],
    status: 1,
    activeForm: {
        id: '',
        formStatus: 2,
        declarations: [],
        attachments: [],
        isOverallDeclarationConfirmed: false
    },
    pastApplications: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentApplicationService]
    });
    testService = TestBed.inject(CurrentApplicationService);
  });

  it('should be created',() => {
    expect(testService).toBeTruthy();
  });

  it('setTrainee shares new trainee', () => {
    const nextSpy: jasmine.Spy = spyOn(testService.trainee, 'next');
    const { trainee } = application;
    testService.setTrainee(application);
    expect(nextSpy).toHaveBeenCalledWith(trainee);
  });

});
