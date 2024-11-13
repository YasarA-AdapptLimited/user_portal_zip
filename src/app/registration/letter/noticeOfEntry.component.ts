import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Registrant } from '../../registration/model/Registrant';
import { AuthService } from '../../core/service/auth.service';
import { DatePipe } from '@angular/common';
import { Technician } from '../../technician/model/Technician';
import { RegistrantType } from '../model/RegistrantType';
@Component({
  selector: 'app-noe-letter',
  moduleId: module.id,
  templateUrl: './noticeOfEntry.component.html',
  styleUrls: ['letter.scss']
})
export class NoticeOfEntryComponent implements OnInit {
  registrantStartDate: any;
  registrant: Registrant | Technician;
  registrantAddress: any;
  isPharmacist: boolean;
  isPharmacyTechnician: boolean;
  loading = false;
  failed = false;
  receipt;
  user;


  @Input() isRegistrant = false;
  // @Input() isTechnician = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    private date: DatePipe
  ) { }

  ngOnInit() {
    if(this.auth.user.registrant.type){
      this.isPharmacist=this.auth.user.registrant.type === RegistrantType.Pharmacist;
    }
   
    this.registrantAddress = this.auth.user.address;
    if (this.auth.user.isPrereg) {
      this.registrant = this.auth.user.registrant;
    } else {
      // we know its a technician if not a pharmacist
      console.log({usr: this.auth.user});
      this.registrant = this.auth.user.registrant;

    }
  }

  print() {
    (<any>window).print();
  }

  exit() {
    if (this.auth.user.isRegistrant) {
      this.router.navigate(['/registration']);
    } else {
      this.router.navigate(['/home']);
    }

  }

}
