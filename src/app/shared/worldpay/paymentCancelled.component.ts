import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-cancelled',
  templateUrl: './paymentCancelled.component.html',
  styleUrls: ['./payment.scss']
}) export class PaymentCancelledComponent implements OnInit {

  constructor(private router: Router) { }
  urlRedirect = `${environment.webRoot}`;
  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/home']);
     }, 10000);
  }

}
