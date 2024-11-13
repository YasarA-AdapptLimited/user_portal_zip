/*import { FormStepperService } from './../../../../shared/formStepper/formStepper.service';
import { UtcDatePipe } from './../../../../shared/pipe/UtcDate.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from './../../../../core/tooltip/tooltip.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CollapsibleComponent } from './../../../../shared/collapsible.component';
import { ApplicantComponent } from './../../../../account/applicant.component';
import { GphcIconComponent } from './../../../../shared/gphc-icon.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssessmentReportPersonalDetailsStepComponent } from './assessmentReportPersonalDetailsStep.component';
import { AssessmentReportService } from '../../../../core/service/assessmentReport.service';
import { AssessmentReportStep } from '../../models/AssessmentReportStep';

xdescribe('( Assessment report ) => Personal details ', () => {
    let component: AssessmentReportPersonalDetailsStepComponent;
    let fixture: ComponentFixture<AssessmentReportPersonalDetailsStepComponent>;
    let MockFormStepper, MockAssessmentReportService;

    beforeEach(() => {
        MockFormStepper = jasmine.createSpyObj(['goToStep']);
        const application = [
            {
                trainee: {
                    title: { name: 'srimani', id: 1234 },
                    forenames: 'soni',
                    middleName: 'sri',
                    surname: 'mani',
                    address: {

                    },
                    dateOfBirth: '1/02/1998',
                    preEntryNumber: '4212136'
                }
            }
        ];
        TestBed.configureTestingModule({
            declarations: [
                AssessmentReportPersonalDetailsStepComponent,
                GphcIconComponent,
                ApplicantComponent,
                CollapsibleComponent,
                UtcDatePipe
            ],
            imports: [
                MatAutocompleteModule,
                TooltipModule,
                FormsModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: FormStepperService, useValue: MockFormStepper },
                { provide: AssessmentReportService, useValue: MockAssessmentReportService }
            ]

        }).compileComponents();
        fixture = TestBed.createComponent(AssessmentReportPersonalDetailsStepComponent);
        component = fixture.componentInstance;
        component = Object.assign(component, { application });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });



    it('should call makedirty and validate if update is called', () => {
        // arrange
        const makeDirtySpy = spyOn(component, 'makeDirty');
        const validateSpy = spyOn(component, 'validate');
        // act
        component.update();
        // assert
        expect(makeDirtySpy).toHaveBeenCalled();
        expect(validateSpy).toHaveBeenCalled();
    });

    it('should initialize trainee', () => {
        const trainee = [{
            trainee: {
                title: { name: 'srimani', id: 1234 },
                forenames: 'soni',
                middleName: 'sri',
                surname: 'mani',
                address: {

                },
                dateOfBirth: '1/02/1998',
                preEntryNumber: '4212136'
            }
        }
        ]
        component.application = Object.assign(component.application, { trainee });
        component.ngOnInit();
        expect(component.application).toEqual(component.application, { trainee });
    });


    it('if the view is ready, set pass true into ready$', () => {
        // arrange
        const ready$Spy: jasmine.Spy = spyOn(component.ready$, 'next');
        component.viewReady = true;
        // act
        component.load();
        // assert
        expect(ready$Spy).toHaveBeenCalledWith(true);
    });

    it('should confirmed personal details ', () => {

        const validity$Spy: jasmine.Spy = spyOn(component.validity$, 'next');
        // act
        fixture.detectChanges();

        component.validate();
        // assert
        expect(validity$Spy).toHaveBeenCalledWith({
            valid: true,
            messages: [],
            touched: this.touched
        });
    });

    it('should be able to check step Id', async () => {
        //arrange
        const stepChange: jasmine.Spy = spyOn(component.navigate, 'emit');
        // act
        component.goToStep(1);
        // assert
        expect(stepChange).toHaveBeenCalledWith(AssessmentReportStep.PersonalDetails);
    })


});*/
