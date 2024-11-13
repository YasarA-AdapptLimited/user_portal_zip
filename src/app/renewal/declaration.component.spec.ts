import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of } from "rxjs";
import { AuthService } from "../core/service/auth.service";
import { FormQuestion } from "../dynamic/model/FormQuestion";
import { FormValidationService } from "../dynamic/service/formValidationService";
import { DeclarationComponent } from "./declaration.component";

describe('Declaration renewal component', () => {

    let fixture: ComponentFixture<DeclarationComponent>, component: DeclarationComponent;
    let mockFormValidationService, mockAuthService;

    mockAuthService = jasmine.createSpyObj('AuthService', ['updateCachedHasCheckedRegistrationDetails']);
    mockAuthService.user = {
            registrant: {
                renewalDate: '2018-12-31'
            },
            isRegistrant: true
    }

    mockFormValidationService = jasmine.createSpyObj('FormValidationService', ['getQuestionByShortname']);

    beforeEach(() =>{
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ DeclarationComponent ],
            providers: [
                { provide: FormValidationService, useValue: mockFormValidationService },
                { provide: AuthService, useValue: mockAuthService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DeclarationComponent);
        component = fixture.componentInstance;
    });

    it('init correctly', () => {        
        expect(component).toBeTruthy();
    });

    it('checkForRevalidationQuestion validates revalidation question ', () => {
        let revalQuestion;
        let alternativeSelected = {
            id: 'id123',
            name: 'abc',
            text: 'text',
            order: 1,
            questions: [revalQuestion],
            isRequired: false,
            showAdditionalInfo: true
        }

        revalQuestion = new FormQuestion({
            id: '123',
            shortName: 'name',
            title: 'title',
            body: null,
            tooltip: 'tooltip text',
            type: 4,
            min: 0,
            max: 10,
            isRequired: true,
            isHidden: false,
            answer: 0,
            defaultAnswer: 5,
            time: null,
            alternatives: [],
            requiredAlternative: null,
            isValid: true,
            wrongAlternative: false,
            hasWrongAlternative: false,
            errors: [],
            alternativeSelected: of(alternativeSelected)
        });

        mockFormValidationService.getQuestionByShortname.and.returnValue(revalQuestion);
        component.checkForRevalidationQuestion();
        expect(component.showRevalidationWarning).toBeDefined();
    });
});