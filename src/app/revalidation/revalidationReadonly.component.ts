import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RevalidationService } from '../core/service/revalidation.service';
import { RevalidationItem } from '../shared/model/revalidation/RevalidationItem';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { RevalidationItemTypeConfig } from '../shared/model/revalidation/RevalidationItemTypeConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { FormTemplate } from '../dynamic/model/FormTemplate';
import { Form } from '../dynamic/model/Form';
import { FormQuestion } from '../dynamic/model/FormQuestion';
import { FormAnswer } from '../dynamic/model/FormAnswer';
import { AnswerType } from '../dynamic/model/AnswerType';
import { RevalidationItemValidator } from './service/revalidationItemValidator.service';
import { FormValidator } from '../dynamic/service/FormValidator';

@Component({
  selector: 'app-revalidation-readonly',
  moduleId: module.id,
  templateUrl: './revalidationReadonly.component.html',
  styleUrls: ['./revalidationReadonly.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevalidationReadonlyComponent  {
  @Input() form: Form;

  constructor(private router: Router) {
  }

  exit() {
    this.router.navigate(['revalidation']);
  }
}
