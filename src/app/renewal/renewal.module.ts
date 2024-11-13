import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from '../dynamic/dynamic.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
// import { HttpModule } from '@angular/http';
import { RenewalComponent } from './renewal.component';
import { RenewalOldComponent } from './renewalPaymentOldFlow/renewal.component';
import { PaymentComponent } from './payment.component';
import { PaymentOldComponent } from './renewalPaymentOldFlow/payment.component';
import { RenewalSplashComponent } from './renewalSplash.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { RenewalFaqComponent } from './renewalFaq.component';
import { DeclarationComponent } from './declaration.component';
import { DeclarationQuestionComponent } from './declarationQuestion.component';

@NgModule({
  imports: [
    // HttpModule,
    FormsModule,
    CommonModule,
    DynamicModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    RenewalComponent,
    RenewalFaqComponent,
    DeclarationComponent,
    DeclarationQuestionComponent,
    RenewalOldComponent,
    PaymentComponent,
    PaymentOldComponent,
    RenewalSplashComponent,
    RenewalFaqComponent
  ],
  exports: [
    DeclarationComponent,
    DeclarationQuestionComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
})
export class RenewalModule { }
