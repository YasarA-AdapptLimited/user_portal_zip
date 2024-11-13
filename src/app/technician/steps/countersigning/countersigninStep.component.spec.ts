import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TooltipModule } from '../../../core/tooltip/tooltip.module';
import { CollapsibleComponent } from '../../../shared/collapsible.component';
import { GphcIconComponent } from '../../../shared/gphc-icon.component';
import { ConfirmDialogComponent } from '../../../shared/confirmDialog.component';
import { CountersigningStepComponent } from './countersigningStep.component';
import { FormStepperService } from '../../../shared/formStepper/formStepper.service';
import { TechnicianService } from '../../../core/service/technician.service';
import { LogService } from '../../../core/service/log.service';
import { of } from 'rxjs';
import { ApplicationStatus } from '../../model/ApplicationStatus';
import { TechnicianApplicationStep } from '../../model/TechnicianApplicationStep';

 xdescribe('( Technician Application ) => Countersigning step', () => {
    let component: CountersigningStepComponent;
    let fixture: ComponentFixture<CountersigningStepComponent>;
    let MockFormStepper, MockTechnicianService;

    @NgModule({
    declarations: [
        ConfirmDialogComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule
    ]
})
     class testingModule { }
     beforeEach(() => {
         MockFormStepper = jasmine.createSpyObj(['disableAllStepsExcept', 'setStepRange']);
         MockTechnicianService = jasmine.createSpyObj(['sendToCountersigner', 'recallFromCountersigner']);
         const MockLogger = jasmine.createSpyObj(['info']);
         const application = {
   trainee: {
      title:
     { name: 'Mrs',
     id: 717750002
 },
     forenames: 'Emani',
      surname: 'Srimani',
     middleName: 'technician',
      dateOfBirth: '1990-01-31T00:00:00',
      preEntryNumber: '6305208',
      address:
      {
          line1: '54A High Street',
         line2: 'Cosham',
          line3: '',
          town: 'Portsmouth',
          county: 'Hampshire',
          postcode: 'PO6 3AG',
          country: 'United Kingdom',
          homeNation: 717750000,
          latitude: null,
          longitude: null,
          countryCode: null
         },
          contact:
          { email: 'gphc7@adappt.co.in',
           telephone1: null,
           mobilePhone: '078224242'
         },
        equalityDiversity:
         { ethnicity: 717750017,
          ethnicityOther: '',
          nationality: 717750031,
          religion: 981360000,
          religionOther: '',
          disabled: 981360000,
          disabilityDetails: '',
          gender: 2,
          sexualOrientation: 981360005 }
         },
         forms: [
         {
             countersignatures:
             [{
                 registrationNumber: '2042526',
                 forenames: 'MiH1007603',
                 surname: 'JaH1007603',
                 town: 'NeH1007603',
                 decisionMadeAt: null,
                decision: 1,
                feedback: null
           }],
           applicationType: 981360001,
            isSupportingDocumentsForwardedConfirmed: true,
             educationDetails:
           {
            knowledge:
             {
                id: '332a3adf-9d4f-49d8-b04e-0cd2892238e9',
                qualificationId: 'bbabdaa0-77af-e411-80d8-00505685383b',
                dateCommenced: '2017-01-01',
               dateAwarded: '2018-03-01',
                qualificationType: 0
            },
            competency:
            {
                id: '81d5ef7d-d95e-4699-a9e4-cf34017d6b3a',
                qualificationId: 'b5abdaa0-77af-e411-80d8-00505685383b',
                 dateCommenced: '2018-06-05',
                 dateAwarded: '2022-02-01',
                qualificationType: 1 },
                combined:
                {
                    id: '959a5b35-7670-40f3-b69c-f7a376de10c2',
                    qualificationId: 'a15bc14c-d484-ec11-9471-0050568500fa',
                    dateCommenced: '2017-01-01',
                    dateAwarded: '2022-02-01',
                     qualificationType: 2 } },
                     workExperiences:
                    [{
                        id: 'b4327633-0ebd-41a7-9896-df6df65224d4',
                        startDate: '2017-11-01',
                        endDate: '2022-02-01',
                        workedHoursPerWeek: 40,
                        jobTitle: 'tech',
                       supervisingPharmacist:
                         {
                            id: '76702711-7aaf-e411-80e6-005056851bfe',
                            registrationNumber: '2049091',
                           forenames: 'AsH1000116',
                            surname: 'BaH1000116' },
                     premise:
                    { id: '5dd68bc4-44b0-e411-80d8-00505685383b',
                        registrationNumber: '1031799',
                        name: 'H.J. Everett (Chemist) Ltd.',
                         address:
                           { line1: '58-60 High Street', line2: 'Cosham', line3: null,
    town: 'PORTSMOUTH', county: 'Hampshire', postcode: 'PO6 3AG', country: 'UK',
                              homeNation: null, latitude: null,
                              longitude: null, countryCode: null } } }],
                              previousApplicationsAndRegistrations: {
                                   applications: {
                                       registration: {
                                           applied: false,
                                           registrationNumber: null,
                                           type: null, applicationDate: null },
                                         preRegistrationTraining: {
                                             undertaken: false,
                                             preRegistrationNumber: null,
                                             startDate: null } },
                     ukRegistration: {
                         registered: false,
                         registrationNumber: null,
                         wasCertificateRequested: null,
                         nameOfBody: null },
             outsideUKRegistration: {
                 registered: false,
                 registrationNumber: null,
                 wasCertificateRequested: null,
                 nameOfBody: null } },
                 id: 'c7a14a3e-b963-4fa9-82ed-0587dd7de860',
                 formStatus: 5,
                 step: 12,
                 createdAt: '2022-02-18T10:17:37.727',
                 isOverallDeclarationConfirmed: true,
                 scope: 2,
                 declarations:[],
 attachments: [{
     fileId: '47e4d2f3-8fb0-4913-9272-00074fb9bfb8', expiryDate: null, type: 1, filename: 'image001 (2).png',
     filesize: 155910, deleteUrl: 'v1.0/registrationform/attachment/47e4d2f3-8fb0-4913-9272-00074fb9bfb8', downloadUrl: null,
     title: 'Passport or EEA ID card', certifier: { name: 'certifiername', companyName: 'certifiername1234567', type: 'Barrister',
     number: '1234567', date: '2022-02-01T00:00:00' }, isDuplicateCopy: false  }],
    registrationFees: { applicationFee: 106.00, registrationFee: 121.00 }, 
    isFirstYearPaymentAvailable: false}
         ]};

     TestBed.configureTestingModule({
         declarations: [
             CountersigningStepComponent,
             GphcIconComponent,
             CollapsibleComponent,
         ],
         imports: [
             FormsModule,
             MatSelectModule,
             TooltipModule,
             MatDialogModule,
             testingModule
         ],
         providers: [
             { provide: FormStepperService, useValue: MockFormStepper },
             { provide: TechnicianService, useValue: MockTechnicianService },
             { provide: LogService, useValue: MockLogger },
         ]
     }).compileComponents();
     fixture = TestBed.createComponent(CountersigningStepComponent);
     component = fixture.componentInstance;
     component = Object.assign(component, { application });
 });

 it('should create', () => {
     expect(component).toBeTruthy();
 });
 describe('User', () => {

    it('Can send to countersigning pharmacist', () => {
      const dialog = {
        open(comp, data) { return { afterClosed: () => of({ action: true }) } }
      };
      (MockTechnicianService.sendToCountersigner as jasmine.Spy)
        .and.returnValue(of(true));
      component = Object.assign(component, { dialog });
      // act
      component.sendForCountersigning();
      // assert
      expect(component.application.activeForm.formStatus).toBe(ApplicationStatus.ReadyForCountersigning);
    });

    it('Can recall application from specified Pharmacy professional', () => {
      // arrange
      const formStepSpy = (MockFormStepper.setStepRange as jasmine.Spy).and.callThrough();
      (MockTechnicianService.recallFromCountersigner as jasmine.Spy)
        .and.returnValue(of(true));
      // act
      component.recall();
      // assert
      expect(component.application.activeForm.formStatus).toBe(ApplicationStatus.InProgress);
      expect(formStepSpy).toHaveBeenCalledWith(1, TechnicianApplicationStep.Countersigning);

    });


  });

  describe('( Populate form )', () => {

    it('should set selected tutor if countersigning is pending', () => {
      // arrange
      // act
      component.populateForm();
      // assert
      expect(component.application.activeForm.countersignatures[0].registrationNumber).toBe('2042526');
    });

    it('should set selected tutor if countersigning is completed', () => {
      // arrange
      const countersignatures = [
        {
          registrationNumber: '111111',
          forenames: 'GrH1012236',
          surname: 'RiH1012236',
          town: 'CHH1012236',
          countersignerGPhCId: '607ece33-7caf-e411-80e6-005056851bfe',
          id: 'a2bd4091-f399-4d82-8cca-b4bbf8ea802e',
          decisionMadeAt: null,
          decision: 2,
          feedback: null,
          isCertifiedPhoto: null,
          countersignerCommentId: null,
          countersignerComment: 'testing script'
        }
      ]
      component.application.activeForm = Object.assign(component.application.activeForm, { countersignatures });
      console.log({ app: component.application });
      // act
      component.populateForm();
      // assert
      expect(component.application.activeForm.countersignatures[0].registrationNumber).toBe(countersignatures[0].registrationNumber);
    });


  });


 });
