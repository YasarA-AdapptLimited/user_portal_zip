import { Component, ViewChildren, AfterViewInit, ChangeDetectorRef, QueryList } from '@angular/core';
import { FaqService } from '../shared/faq.service';

@Component({
  selector: 'app-signin-faq',
  moduleId: module.id,
  templateUrl: './signinFaq.component.html',
  styleUrls: ['./signinFaq.scss'],
  providers: [ FaqService ]
})
export class SigninFaqComponent {

}
