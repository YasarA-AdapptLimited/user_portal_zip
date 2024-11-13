import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/service/auth.service';
import { LogService } from '../..//core/service/log.service';
import { StudentService } from '../../core/service/student.service';
import { AccountService } from '../service/account.service';
import { PreregActivationComponent } from './preregActivation.component';
import { of, throwError } from 'rxjs';

describe('Prereg activation component', () => {
    let fixture, component: PreregActivationComponent;
    let MockAccountService, MockStudentService, MockAuthService, MockDialog, MockLogService;
    
    MockStudentService = jasmine.createSpyObj('StudentService' , ['getQualifications']);
    MockAccountService = jasmine.createSpyObj('AccountService', ['verifyPrereg', 'activatePrereg']);
    MockAuthService = {
        logout() {}
    }

    MockDialog = {
        open(comp, data) { return { beforeClosed: () => of({ action: true }) } }
    }
    ;
    let courses: [{
        id: 'id',
        courseType: 717750001,
        courseName: 'name'
      },{
        id: 'id1',
        courseType: 717750001,
        courseName: 'name1'
      }]

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports:[],
            declarations: [ PreregActivationComponent ],
            providers: [ 
                { provide: AccountService, useValue: MockAccountService }, 
                { provide: StudentService, useValue: MockStudentService  },
                { provide: AuthService, useValue: MockAuthService  } , 
                { provide: MatDialog, useValue: MockDialog  }, 
                { provide: LogService, useValue: MockLogService  }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(PreregActivationComponent);
        component = fixture.componentInstance;
        MockStudentService.getQualifications.and.returnValue(of(courses));
        fixture.detectChanges();
        component.activation = {
            lastname: 'XXX',
            dob: '01-01-1990',
            qualificationId: 123
        }
    });

    it('should init correctly', () => {
        expect(component).toBeTruthy();
    });

    it('populateCourses updates qualifications list', () => {
        component.qualifications = [{
            id: 'id',
            courseType: 717750001,
            courseName: 'name'
          },{
            id: 'id1',
            courseType: 717750001,
            courseName: 'name1'
          }];        
        component.selectedCourseType = {key : 717750001};
        console.log(component.qualifications);
        component.populateCourses();
    });

    it('stepChange is triggered on call of activate method', fakeAsync(() => {
        const stepChangeSpy: jasmine.Spy = spyOn(component.stepChange,'emit')
        MockAccountService.verifyPrereg.and.returnValue(of('successful'));
        MockAccountService.activatePrereg.and.returnValue(of('test'));
        component.activate();
        tick();
        expect(stepChangeSpy).toHaveBeenCalledWith(2);
    }));
    
    it('display error messages if activate method fails', fakeAsync(() => {
        const mockError = {
            status: 400,
            validationErrors:  ['You have a massive error on your hands']
        };        
        MockAccountService.verifyPrereg.and.returnValue(throwError(mockError));        
        component.activate();
        tick();
        expect(component.serverErrors).toBeDefined();
    }));

    it('user is logged out on call of logout method', () => {
        const logoutSpy: jasmine.Spy = spyOn(MockAuthService, 'logout');
        component.logout();
        expect(logoutSpy).toHaveBeenCalled();
    });

    it('on call of dobSelected, define dob', () => {
        let dob = '01-01-1980';
        component.dobSelected(dob);
        expect(component.activation.dob).toEqual(dob);
    });

    it('prev loads one previous step', () => {
        const stepChangeSpy: jasmine.Spy = spyOn(component.stepChange, 'emit');
        component.prev();
        expect(stepChangeSpy).toHaveBeenCalled();
    });
});