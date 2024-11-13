import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { LogService } from "./service/log.service";
import { StudentService } from "./service/student.service";
import { UpdaterService } from "./service/updater.service";
import { ReviewService } from "./service/review.service";
import { LayoutService } from "./service/layout.service";
import { AuthService } from "./service/auth.service";
import { BrandingComponent } from "./branding.component";
import { NavComponent } from "./nav.component";
import { SharedModule } from "../shared/shared.module";
import { CustomErrorHandler } from "./service/CustomErrorHandler";
import { RenewalService } from "./service/renewal.service";
import { UploadService } from "./service/upload.service";
import { RevalidationService } from "./service/revalidation.service";
import { PublicService } from "./service/public.service";
import { PreregService } from "./service/prereg.service";
import { PaymentService } from "../payment/service/payment.service";
import { EdiService } from "../account/service/edi.service";
import { AccountService } from "../account/service/account.service";
import { DevService } from "./service/dev.service";
import { ReceiptsComponent } from "../payment/receipts.component";
import { ReceiptComponent } from "../payment/receipt.component";
import { DiagnosticsComponent } from "./diagnostics.component";
import { NotFoundComponent } from "./notFound.component";
import { DynamicModule } from "../dynamic/dynamic.module";
import { TooltipModule } from "./tooltip/tooltip.module";
import { TooltipService } from "./tooltip/tooltip.service";
import { TrackingService } from "./service/tracking.service";
import { CommonModule } from "@angular/common";
import { PrivacyPolicyComponent } from "./privacyPolicy.component";
import { RegistrationService } from "./service/registration.service";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { NgxPageScrollModule } from "ngx-page-scroll";
import { NgxPageScrollCoreModule } from "ngx-page-scroll-core";
import { MaintenanceMessageService } from "./service/maintenanceMessage.service";
import { ReviewerDashboardComponent } from "./reviewerDashboard.component";
import { AccountModule } from "../account/account.module";
import { AssessmentReportService } from "./service/assessmentReport.service";
import { AssessmentRegistrationService } from "./service/assessmentRegistration.service";
import { CurrentApplicationService } from './service/prereg/currentApplication.service';
import { FinalDeclarationService } from "./service/finalDeclaration.service";
import { IndependentPrescriberService } from "./service/independentPrescriber.service";
import { VoluntaryRemovalService } from "./service/voluntaryRemoval.service";
import { CCPSService } from "./service/ccps.service";
import { ReturnToRegisterService } from "./service/returnToRegister.service";
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    DynamicModule,
    TooltipModule,
    NgxPageScrollCoreModule,
    NgxPageScrollModule,
    AccountModule
  ],
  declarations: [
    BrandingComponent,
    ReceiptsComponent,
    ReceiptComponent,
    NavComponent,
    DiagnosticsComponent,
    NotFoundComponent,
    PrivacyPolicyComponent,
    ReviewerDashboardComponent
  ],
  exports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    DynamicModule,
    TooltipModule,
    BrandingComponent,
    ReceiptsComponent,
    ReceiptComponent,
    NavComponent,
    DiagnosticsComponent,
    NotFoundComponent,
    PrivacyPolicyComponent,
    ReviewerDashboardComponent
  ],
  providers: [
    DevService,
    LogService,
    UploadService,
    UpdaterService,
    LayoutService,
    AuthService,
    PublicService,
    RenewalService,
    PreregService,
    RevalidationService,
    PaymentService,
    ReviewService,
    StudentService,
    TooltipService,
    CustomErrorHandler,
    TrackingService,
    EdiService,
    AccountService,
    RegistrationService,
    MaintenanceMessageService,
    AssessmentReportService,
    CurrentApplicationService,
    AssessmentRegistrationService,
    FinalDeclarationService,
    IndependentPrescriberService,
    VoluntaryRemovalService,
    CCPSService,
    ReturnToRegisterService,
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" }
  ]
})
export class CoreModule { }
