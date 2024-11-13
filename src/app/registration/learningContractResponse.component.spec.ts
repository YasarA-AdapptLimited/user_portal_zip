import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StudentService } from "../core/service/student.service";
import { CountersignatureOutcome } from "../prereg/model/CountersignatureOutcome";
import { LearningContractResponseComponent } from "./learningContractResponse.component";

describe('(Learning Contract) =>  countersignin response', () => {
  let fixture: ComponentFixture<LearningContractResponseComponent>;
  let component: LearningContractResponseComponent;
  let app: any;
  let MockAuthService: jasmine.Spy;
  let mockStudentService = jasmine.createSpyObj('StudentService',['submitCountersignatureOutcome','formatAddress','focusOnInvalidInputs']);    
  let routerSpy =  { navigate: jasmine.createSpy('navigate')};
  let form;
  let formDefaultValue = {
   
    'response': CountersignatureOutcome.Rejected

  };
  MockAuthService = jasmine.createSpyObj(['logout']);
  
  
  
    beforeEach(async() => {
      TestBed.configureTestingModule({
        declarations: [
          LearningContractResponseComponent
        ],
        imports: [
          FormsModule
        ],
        providers: [
          { provide: StudentService, useValue: mockStudentService },
          { provide: ActivatedRoute, useValue:  {
            snapshot: 
            {
              params: {
                id: '24fkzrw3487943uf358lovd',
                date: '13-04-2021',
                role: 'student'
              }
            }
          }},
          { provide: Router, useValue: routerSpy}
        ]
      }).compileComponents();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
  });