import {
    Component, Input, Output, EventEmitter, Inject,
    ViewChildren, ContentChildren, AfterContentInit, ElementRef
} from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { Registrant } from '../model/Registrant';


@Component({
    selector: 'app-letter-header',
    templateUrl: './letterHeader.component.html',
    styleUrls: ['./letterHeader.scss']
})
export class LetterHeaderComponent {
    @Input() registrant;
    @Input() registrantAddress;
    @Input() letterDate;
    @Input() assessmentApproveTraineeAddress;
    @Input() isAssessmentApprove = false;
    registrantName: string;
    constructor(public auth: AuthService) {
        this.registrantName = this.auth.user.forenames + ' ' + (this.auth.user.middleName ? this.auth.user.middleName : '') + ' ' + this.auth.user.surname;
    }
}
