import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProgressIndicatorComponent } from './progressIndicator.component';
import { RoundProgressModule } from './round-progress/round-progress.module';
import { KeysPipe } from './pipe/Keys.pipe';
import { ReversePipe } from './pipe/Reverse.pipe';
import { CaseSplitPipe } from './pipe/CaseSplit.pipe';
import { RevalidationItemTypePipe } from './pipe/ItemTypeFilter.pipe';
import { FriendlyBooleanPipe } from './pipe/FriendlyBoolean.pipe';
import { SubmissionPipe } from './pipe/Submission.pipe';
import { TimePipe } from './pipe/Time.pipe';
import { WizardStepsComponent } from './wizardSteps.component';
import { StickyComponent } from './sticky.component';
import { FormLayoutComponent } from './formLayout.component';
import { FormSectionComponent } from './formSection.component';
import { FormReviewComponent } from './formReview.component';
import { BannerComponent } from './banner.component';
import { GphcIconComponent } from './gphc-icon.component';
import { TextEditorComponent } from './textEditor.component';
import { SpinnerComponent } from './spinner.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ConfirmDialogComponent } from './confirmDialog.component';
import { FileUploadComponent } from './fileUpload.component';
import { CollapsibleComponent } from './collapsible.component';
import { CarouselComponent } from './carousel.component';
import { CarouselNavComponent } from './carousel-nav.component';
import { ToolbarComponent } from './toolbar.component';
import { CustomErrorHandler } from '../core/service/CustomErrorHandler';
import { RenewalMessageComponent } from './renewal/renewalMessage.component';
import { CpdEntryComponent } from './revalidation/cpdEntry.component';
import { CpdEntryAnnotationsComponent } from './revalidation/cpdEntryAnnotations.component';
import { CpdEntryAnswersComponent } from './revalidation/cpdEntryAnswers.component';
import { TooltipModule } from '../core/tooltip/tooltip.module';
import { FaqDirective } from './faq.directive';
import { FaqLinkDirective } from './faqLink.directive';
import { FaqComponent } from './faq.component';
import { AutocompleteComponent } from './autocomplete.component';
import { OverlayComponent } from './overlay.component';
import { FullscreenSpinnerComponent } from './fullscreenSpinner.component';
import { ValidationErrorsComponent } from './validationErrors.component';
import { LowercaseDirective } from './lowercase.directive';
import { UtcDatePipe } from './pipe/UtcDate.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UtcDatePickerComponent } from './utcDatePicker.component';
import { FormStepperComponent } from './formStepper/formStepper.component';
import { FormStepperMenuComponent } from './formStepper/formStepperMenu.component';
import { DaterangeComponent } from './daterange.component';
import { SupportingDocumentsItemComponent } from './supportingDocuments/supportingDocumentsItem.component';

import { SupportingDocumentsSummaryComponent } from './supportingDocuments/supportingDocumentsSummary.component';
import { Banner2Component } from './banner2.component';
import { StripHtmlPipe } from './pipe/StripHtml.pipe';
import { DobDatePipe } from './pipe/DobDate.pipe';

import { InputValidator } from './inputValidator.directive';
import { PaymentFailureComponent } from './worldpay/paymentFailure.component';
import { PaymentSuccessComponent } from './worldpay/paymentSuccess.component';
import { PaymentCancelledComponent } from './worldpay/paymentCancelled.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RoundProgressModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatRadioModule,
    TooltipModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  declarations: [
    ProgressIndicatorComponent,
    WizardStepsComponent,
    KeysPipe,
    CaseSplitPipe,
    ReversePipe,
    UtcDatePipe,
    RevalidationItemTypePipe,
    UtcDatePipe,
    SubmissionPipe,
    FriendlyBooleanPipe,
    TimePipe,
    StickyComponent,
    FormLayoutComponent,
    FormReviewComponent,
    FormSectionComponent,
    BannerComponent,
    GphcIconComponent,
    TextEditorComponent,
    SpinnerComponent,
    ConfirmDialogComponent,
    FileUploadComponent,
    CollapsibleComponent,
    CarouselComponent,
    CarouselNavComponent,
    ToolbarComponent,
    RenewalMessageComponent,
    CpdEntryComponent,
    CpdEntryAnnotationsComponent,
    CpdEntryAnswersComponent,
    FaqDirective,
    FaqLinkDirective,
    FaqComponent,
    OverlayComponent,
    FullscreenSpinnerComponent,
    AutocompleteComponent,
    ValidationErrorsComponent,
    LowercaseDirective,
    UtcDatePickerComponent,
    FormStepperComponent,
    FormStepperMenuComponent,
    DaterangeComponent,
    SupportingDocumentsItemComponent,
    SupportingDocumentsSummaryComponent,
    Banner2Component,
    StripHtmlPipe,
    DobDatePipe,
    InputValidator,
    PaymentFailureComponent,
    PaymentSuccessComponent,
    PaymentCancelledComponent
  ],
  exports: [
    ProgressIndicatorComponent,
    WizardStepsComponent,
    KeysPipe,
    CaseSplitPipe,
    UtcDatePipe,
    ReversePipe,
    RevalidationItemTypePipe,
    SubmissionPipe,
    FriendlyBooleanPipe,
    UtcDatePipe,
    TimePipe,
    StickyComponent,
    FormLayoutComponent,
    FormReviewComponent,
    FormSectionComponent,
    BannerComponent,
    GphcIconComponent,
    TextEditorComponent,
    SpinnerComponent,
    MatProgressSpinnerModule,
    ConfirmDialogComponent,
    FileUploadComponent,
    CollapsibleComponent,
    CarouselComponent,
    CarouselNavComponent,
    ToolbarComponent,
    RenewalMessageComponent,
    CpdEntryComponent,
    CpdEntryAnnotationsComponent,
    CpdEntryAnswersComponent,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    OverlayComponent,
    FullscreenSpinnerComponent,
    AutocompleteComponent,
    TooltipModule,
    FaqDirective,
    FaqLinkDirective,
    FaqComponent,
    ValidationErrorsComponent,
    LowercaseDirective,
    UtcDatePickerComponent,
    FormStepperComponent,
    FormStepperMenuComponent,
    DaterangeComponent,
    RoundProgressModule,
    SupportingDocumentsItemComponent,
    SupportingDocumentsSummaryComponent,
    Banner2Component,
    StripHtmlPipe,
    DobDatePipe,
    InputValidator,
    PaymentFailureComponent,
    PaymentSuccessComponent,
    PaymentCancelledComponent

  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    CaseSplitPipe, StripHtmlPipe,
    DatePipe
  ]
})
export class SharedModule { }
