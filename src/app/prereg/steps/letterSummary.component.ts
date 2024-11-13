import { Input, Component, OnInit } from '@angular/core';
import { LetterOfGoodStanding } from '../model/LetterOfGoodStanding';
import { RegApplication } from '../model/RegApplication';

@Component({
    selector: 'app-letterstep-summary',
    templateUrl: './letterSummary.component.html',
}) export class LetterSummaryComponent implements OnInit {

    @Input() application: RegApplication;
    letterAnswers: LetterOfGoodStanding;

    ngOnInit() {
        this.letterAnswers = this.application.activeForm.letterOfGoodStanding;
    }

}



