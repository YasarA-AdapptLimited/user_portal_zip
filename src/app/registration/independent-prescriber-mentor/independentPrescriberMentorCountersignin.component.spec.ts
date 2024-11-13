import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { CollapsibleComponent } from '../../shared/collapsible.component';
import { CountersignatureOutcome } from '../../prereg/model/CountersignatureOutcome';
import { of } from 'rxjs';
import { IndependentPrescriberMentorCountersigninComponent } from './independentPrescriberMentorCountersignin.component';
import { IndependentPrescriberService } from '../../core/service/independentPrescriber.service';
import { string } from 'yargs';

describe('Independent Prescriber Mentor Counter Sign Response Component', () => {
    let fixture: ComponentFixture<IndependentPrescriberMentorCountersigninComponent>;
    let component: IndependentPrescriberMentorCountersigninComponent;
    let app: any;
    let MockAuthService;
    const mockIndependentPrescriberService = jasmine.createSpyObj('IndependentPrescriberService', ['submitCountersignatureOutcome', 'focusOnInvalidInputs']);
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let form;
    const formDefaultValue = {
        'response': CountersignatureOutcome.Rejected

    };
    MockAuthService = jasmine.createSpyObj(['logout']);

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [IndependentPrescriberMentorCountersigninComponent,
                CollapsibleComponent
            ],
            imports: [FormsModule, MatRadioModule, BrowserAnimationsModule],
            providers: [{ provide: AuthService, useValue: MockAuthService },
            { provide: IndependentPrescriberService, useValue: mockIndependentPrescriberService },
            {
                provide: ActivatedRoute, useValue: {
                    snapshot:
                    {
                        params: {
                            id: '24fkzrw3487943uf358lovd',
                            date: '13-04-2021',
                            role: 'prescriber'
                        }
                    }
                }
            },
            { provide: Router, useValue: routerSpy }]
        }).compileComponents();
    });

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(IndependentPrescriberMentorCountersigninComponent);
        component = fixture.componentInstance;
        MockAuthService.user = {
            registrationStatus: '09809808',
            forenames: 'xxx',
            showNoticeOfEntry: true
        };
        mockIndependentPrescriberService.applicantName = {
            applicantName: 'sone'
        };
    }));

    it('should create component', () => {
        expect(component).toBeTruthy();
    });
    it('should navigate to registration page on submit', () => {
        component.exit();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/registration']);
    });
    describe('should get on ngoninit', () => {
        beforeEach(() => {
            component.ngOnInit();
        });
        it('onInit define user value', () => {
            component.ngOnInit();
            expect(component.user).toBe(MockAuthService.user);
        });
        it('onInit define user value', () => {
            component.ngOnInit();
            expect(component.application.applicantName).toBe(mockIndependentPrescriberService.applicantName);
        });
    });
    it('should print', () => {
        const windowOpenSpy = spyOn(window, 'print');
        component.print();
        expect(windowOpenSpy).toHaveBeenCalled();
    });

    it('should call submitOutcome method on button click', fakeAsync(() => {
        fixture.detectChanges();
        spyOn(component, 'submitOutcome');
        const button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();
        expect(component.submitOutcome).toHaveBeenCalled();
      }));


});
