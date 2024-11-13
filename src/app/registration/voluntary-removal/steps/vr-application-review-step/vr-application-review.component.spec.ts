import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UtcDatePipe } from "../../../../shared/pipe/UtcDate.pipe";
import { VrApplicationReviewComponent } from "./vr-application-review.component";

describe('VR Application Review Component', () => {
    let component: VrApplicationReviewComponent;
    let fixture: ComponentFixture<VrApplicationReviewComponent>;

    const application = {
        activeForm: {
          voluntaryRemovalDetails: {
              dateOfRegistryRemoval: '2022-12-31T00:00:00',
              reasonForRemoval: 'Other',
              reasonForRemovalDetails: 'reason',
              superintendentName: null,
              superintendentNumber: null
          },
          appDeclaration: {
              isQ1Confirmed: null,
              isQ2Confirmed: null
          },
          equalityDiversity: {
              ethnicity: 717750017,
              ethnicityOther: null,
              nationality: null,
              religion: null,
              religionOther: null,
              disabled: null,
              disabilityDetails: null,
              gender: null,
              sexualOrientation: null
          },
          isOverallDeclarationAcknowledged: false,
          ftpDeclarations: [],
          id: 123,
          formStatus: 2,
          step: 1,
          scope: 7,
          attachments: [],
          countersignatures: [],
          createdAt: '2022-04-01T11:54:00.38',
          dateApplicationSubmitted: null,
          minStep: 1
        },
        outstandingPayments: null
      }
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ VrApplicationReviewComponent, UtcDatePipe ],
            providers: []
        }).compileComponents();
        fixture = TestBed.createComponent(VrApplicationReviewComponent);
        component = fixture.componentInstance;    
        component = Object.assign(component, { application });         
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
    it('set title and voluntary details on init', () => {
        component.ngOnInit();
        expect(component.voluntaryRemovalDetails).toBeDefined();
    });

    it('navigate to a paticular step', () => {
        const emitSpy: jasmine.Spy = spyOn(component.navigate,'emit');    
        component.goToStep(1);
        expect(emitSpy).toHaveBeenCalledWith(1);
    });
})