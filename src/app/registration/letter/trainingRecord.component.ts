import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../model/Registrant';
import { AuthService } from '../../core/service/auth.service';
import {  RegistrationService } from '../../core/service/registration.service';
import { LetterType } from '../model/LetterType';
import { TrainingRecordLetterData } from '../model/TraningRecordLetterData';
import { Mock } from 'protractor/built/driverProviders';


@Component({
    selector: 'app-training-record-letter',
    moduleId: module.id,
    templateUrl: './trainingRecord.component.html',
    styleUrls: ['letter.scss', './trainingRecord.scss']
})
export class TrainingRecordComponent implements OnInit {
    registrantStartDate: any;
    registrant: Registrant = new Registrant(null);
    registrantAddress: any;
    registrantEmail : string;
    registrantType;

    loading = false;
    failed = false;
  
    isRegistrant;
    trainingRecordLetterData: TrainingRecordLetterData; 
    trainingSites; 
    preEntryNumber;
    letterDate;
    id: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthService,
        private service: RegistrationService
    ) { this.id = this.route.snapshot.params['id']; }

    ngOnInit() {
        this.registrant.title = this.auth.user.title;
        this.registrant.forenames = this.auth.user.forenames + ' ' + (this.auth.user.middleName ? this.auth.user.middleName : '');
        this.registrant.surname = this.auth.user.surname;
        //this.registrantType = this.registrant.type === 1 ? 'pharmacist' : 'pharmacy technician';
        this.isRegistrant = this.auth.user.isRegistrant;
        this.registrantAddress = this.auth.user.address;
        this.registrantEmail = this.auth.user.contact.email;
        this.service.getLetters().subscribe(
            letters => {
                const letter = letters.find(l => l.letterType === LetterType.TrainingRecord);
                letter.data.TrainingSites.sort((site1, site2) => {
                    return new Date(site1.StartDate).getTime() - new Date(site2.StartDate).getTime();
                });
                this.trainingSites = letter.data.TrainingSites;
                this.preEntryNumber = letter.data.PreEntryNumber;
                this.letterDate = letter.data.Date;
            }
        );
    }


    print() {
        (<any>window).print();
    }

    exit() {        
            this.router.navigate(['/account/notifications']);
    }

}
