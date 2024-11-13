import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from './service/payment.service';
import { Payment } from './model/Payment';
import { PaymentChannel } from './model/PaymentChannel';
import { PaymentStatus } from './model/PaymentStatus';
import { AuthService } from '../core/service/auth.service';
import { User } from '../account/model/User';

@Component({
  selector: 'app-receipts',
  moduleId: module.id,
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.scss']
})
export class ReceiptsComponent implements OnInit {
  user: User;
  loading = false;
  failed = false;
  receipts: Array<Payment>;
  public PaymentStatus = PaymentStatus;
  public PaymentChannel = PaymentChannel;
  constructor(private router: Router, private service: PaymentService, private auth: AuthService) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.user = this.auth.user;
    this.loading = true;
    this.failed = false;
    this.service.getPayments().subscribe(payments => {
      this.receipts = payments.filter(payment => payment.status === PaymentStatus.Paid && payment.paymentNumber);
      this.loading = false;
    }, error => {
      this.failed = true;
      this.loading = false;
    });
  }

  showReceipt(receipt: Payment) {
    this.router.navigate(['/receipts', receipt.paymentNumber]);
  }

}
