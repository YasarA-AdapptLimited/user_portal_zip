import {
    Component, Input, Output, EventEmitter, Inject,
    ViewChildren, ContentChildren, AfterContentInit, ElementRef
} from '@angular/core';
import { Registrant } from '../model/Registrant';


@Component({
    selector: 'app-letter-footer',
    templateUrl: './letterFooter.component.html',
    styleUrls: ['./letterFooter.scss']
})
export class LetterFooterComponent {
    @Input() signature;
    constructor() {
    }
}
