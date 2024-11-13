import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Payment } from './model/Payment';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from './service/payment.service';
import { User } from '../account/model/User';
import { AuthService } from '../core/service/auth.service';

@Component({
  moduleId: module.id,
  templateUrl: './receipt.component.html',
  styleUrls: ['receipt.scss']
})
export class ReceiptComponent implements OnInit {

  user: User;
  constructor(private router: Router, private service: PaymentService,
    private route: ActivatedRoute, private auth: AuthService) {
    this.id = this.route.snapshot.params['id'];
  }

  id: string;
  loading = false;
  failed = false;
  receipt;

  ngOnInit() {
    this.load();
  }

  load() {
    this.user = this.auth.user;
    this.loading = true;
    this.failed = false;
    this.service.getPayments().subscribe(payments => {
      this.receipt = payments.find(payment => payment.paymentNumber === this.id);
      this.loading = false;
    }, error => {
      this.failed = true;
      this.loading = false;
    });
  }

  print() {
    (<any>window).print();
  }

  exit() {
    this.router.navigate(['/receipts']);
  }

}
