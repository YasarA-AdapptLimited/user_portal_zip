import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndependentPrescriberFinalReviewComponent } from './independentPrescriberApplicationFinalReview.component';
import { IndependentPrescriberForm } from '../../model/IndependentPrescriberForm';
import { IndependentPrescriberService } from '../../../../core/service/independentPrescriber.service';
import { ApplicationStatus } from '../../../../technician/model/ApplicationStatus';
import { of } from 'rxjs';

describe('(Final Declaration) =>  review step', () => {
  let component: IndependentPrescriberFinalReviewComponent;
  let fixture: ComponentFixture<IndependentPrescriberFinalReviewComponent>;

  let mockIndependentPrescriberService, MockApplication: IndependentPrescriberForm;
  mockIndependentPrescriberService = jasmine.createSpyObj('IndependentPrescriberService', ['getApplication', 'getProof']);


  beforeEach(() => {

    const application = {
               courseProvider: 'ABC',
               dateAwarded: new Date('08-30-2020'),
               clinicalSpecialities: '',
                  isPrescriberRegistered: null,
                 prescriberMentorName: '',
                registrationNumber: '',
               UKregulatoryBody: '',
                documents: [],
                activeForm: {
                step: 1,
                   declaration: {
                        isQ1Confirmed: false,
                         isQ2Confirmed: false,
                       isQ3Confirmed: false,
                       isQ4Confirmed: false,
                       isQ5Confirmed: false
                      },
                  formStatus: 1
                 },
                 mentorDetails: [
                    {
                       'tutorGPhCId': 'b1875ac5-7aaf-e411-80e6-005056851bfe',
                        'name': 'Mr Test Tutor 1',
                      'registrationNumber': '2044541',
                       'startDate': '2019-09-19T00:00:00',
                     'endDate': '2020-09-16T00:00:00'
                    }
                ],
               forms: [
                   {
                        'countersignatures': [],
                       'id': 'xyz',
                       'formStatus': 4,
                    'step': 1,
                        'declaration': {
                      'isQ1Confirmed': false,
                        'isQ2Confirmed': false,
                         'isQ3Confirmed': false,
                        'isQ4Confirmed': false,
                        'isQ5Confirmed': false
                    }
                     }
                ],
                 equalityDiversity: {
                  ethnicity: 1,
                      ethnicityOther: 'asd',
                      nationality: 2,
                      religion: 1,
                      religionOther: 'dfg',
                      disabled: 1,
                     disabilityDetails: 'str',
                     gender: 3,
                    sexualOrientation: 2
                 },
                registrant: {
                    title: 'mr',
                    forenames: 'str',
                    surname: 'ing'
                  },
                applicationFee: 250
              };
    TestBed.configureTestingModule({
      declarations: [
        IndependentPrescriberFinalReviewComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: IndependentPrescriberService, useValue: mockIndependentPrescriberService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(IndependentPrescriberFinalReviewComponent);
    component = fixture.componentInstance;
    component = Object.assign(component, { application });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit independent prescriber application', () => {
    component.application.activeForm.formStatus = ApplicationStatus.Submitted;
    expect(component.submitted).toBeTrue();
});
   it('Expecting application to be called', () => {
    mockIndependentPrescriberService.getApplication.and.returnValue(of(MockApplication));
        component.ngOnInit();
        expect(component.application).toBeTruthy();
  });

  it('returns icon based on file extension', () => {
    const file = {   status: 1,
        error: '',
        invalidType: false,
        tooBig: false,
        type: 7,
        fileId: '98397923',
        filename: 'prescribermentor_idproof.pdf',
        filesize: 120
    };

    expect(component.getIcon(file)).toBe('fa fa-file-pdf-o');

    file.filename = 'prescribermentor_idproof.png';
    expect(component.getIcon(file)).toBe('fa fa-file-image-o');

    file.filename = 'prescribermentor_idproof.doc';
    expect(component.getIcon(file)).toBe('fa fa-file-word-o');

    file.filename = 'prescribermentor_idproof.zip';
    expect(component.getIcon(file)).toBe('fa fa-file-archive-o');

    file.filename = 'prescribermentor_idproof';
    expect(component.getIcon(file)).toBe('fa fa-file-o');
});


  it('should create download blob for attachment', () => {
    const file = {   status: 1,
        error: '',
        invalidType: false,
        tooBig: false,
        type: 55994233,
        fileId: '30392010153092',
        filename: 'prescribermentor_idproof.pdf',
        filesize:  18004250018
    };
    const url = '/assets/images/idproof.pdf';

    const MockAttachment = mockIndependentPrescriberService.getProof.and.returnValue(of());
    component.download(file);
    expect(MockAttachment).toHaveBeenCalled();
});

});