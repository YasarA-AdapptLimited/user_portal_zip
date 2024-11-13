import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AddressComponent } from './address.component';
import { AddressEditableComponent } from './addressEditable.component';
import { AddressEditComponent } from './addressEdit.component';
import { AddressSearchComponent } from './addressSearch.component';
import { ContactEditableComponent } from './contactEditable.component';
import { ContactEditComponent } from './contactEdit.component';
import { ContactComponent } from './contact.component';
import { PreferenceEditableComponent } from './preferenceEditable.component';
import { AccountComponent } from './account.component';
import { EmailConfirmationComponent } from './emailConfirmation.component';
import { AccountActivationComponent } from './activation/accountActivation.component';
import { RegistrantActivationComponent } from './activation/registrantActivation.component';
import { StudentActivationComponent } from './activation/studentActivation.component';
import { PreferenceDialogComponent } from './preferenceDialog.component';
import { LoginComponent } from './login.component';
import { SigninFaqComponent } from './signinFaq.component';
import { AccountService } from './service/account.service';
import { MatStepperModule } from '@angular/material/stepper';
import { DobComponent } from './activation/dob.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserBadgeComponent } from './userBadge.component';
import { EdiComponent } from './edi.component';
import { EdiSummaryComponent } from './ediSummary.component';
import { ApplicantComponent } from './applicant.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationContentComponent } from './notifications/notificationContent.component';
import { CommsPreferencesComponent } from './commsPreferences.component';
import { HasCheckedRegistrationDialogComponent } from './hasCheckedRegistrationDialog.component';
import { PreregActivationComponent } from './activation/preregActivation.component';
import { TechnicianActivationComponent } from './activation/technicianActivation.component';
import { TechnicianConfirmationComponent } from './activation/technician-confirmation.component';
import { BrowserDialogComponent } from './browser-dialog/browser-dialog.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        RouterModule
    ],
    declarations: [
        LoginComponent,
        AccountComponent,
        EmailConfirmationComponent,
        AccountActivationComponent,
        RegistrantActivationComponent,
        StudentActivationComponent,
        PreregActivationComponent,
        TechnicianActivationComponent,
        AddressEditableComponent,
        AddressEditComponent,
        AddressSearchComponent,
        ContactEditableComponent,
        ContactEditComponent,
        ContactComponent,
        PreferenceEditableComponent,
        PreferenceDialogComponent,
        AddressComponent,
        DobComponent,
        UserBadgeComponent,
        SigninFaqComponent,
        CommsPreferencesComponent,
        HasCheckedRegistrationDialogComponent,
        EdiComponent,
        ApplicantComponent,
        NotificationsComponent,
        NotificationContentComponent,
        EdiSummaryComponent,
        TechnicianConfirmationComponent,
        BrowserDialogComponent,
    ],
    exports: [
        AddressEditableComponent,
        AddressEditComponent,
        AddressSearchComponent,
        AddressComponent,
        CommsPreferencesComponent,
        HasCheckedRegistrationDialogComponent,
        ContactEditableComponent,
        ContactEditComponent,
        ContactComponent,
        UserBadgeComponent,
        EdiComponent,
        ApplicantComponent,
        SigninFaqComponent,
        CommsPreferencesComponent,
        NotificationsComponent,
        EdiSummaryComponent
    ]
})

export class AccountModule { }
