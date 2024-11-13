import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { RevalidationService } from '../core/service/revalidation.service';
import { LayoutService } from '../core/service/layout.service';
import { RevalidationItemType } from '../shared/model/revalidation/RevalidationItemType';
import { revalidationItemTypes } from '../shared/model/revalidation/revalidationItemTypes';
import { RevalidationItemTypeConfig } from '../shared/model/revalidation/RevalidationItemTypeConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerType } from '../dynamic/model/AnswerType';
import { RevalidationItemValidator } from './service/revalidationItemValidator.service';
import { FormValidator } from '../dynamic/service/FormValidator';
import { Observable } from 'rxjs/internal/Observable';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirmDialog.component';
import { HandledError } from '../core/model/HandledError';
import { ValidationError } from '../core/model/ValidationError';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-revalidation-item',
  moduleId: module.id,
  templateUrl: './revalidationItem.component.html',
  styleUrls: ['./revalidationItem.scss'],
  providers: [
    RevalidationItemValidator,
    { provide: FormValidator, useExisting: RevalidationItemValidator }
  ]
})
export class RevalidationItemComponent implements OnInit, AfterViewInit {
  itemType: RevalidationItemTypeConfig;
  id: string;
  revalidationId: string;
  loading = false;
  saving = false;
  wordCounts = {};
  totalWordCount = 0;
  AnswerType = AnswerType;
  started = false;
  validationErrors: Array<ValidationError>;
  isCurrentSubmission: boolean;

  progressTooltip = {
    id: 'item-progress',
    contextId: 'item',
    content: `This entry is in progress.<br/>If you are happy with what you\'ve written,
    click to mark it as complete to make it ready to submit.`,
    width: 320,
    placement: 'bottom',
    order: 1
  };
  completedTooltip = {
    id: 'item-completed',
    contextId: 'item',
    content: 'This entry is marked as complete.<br/>If you want to amend it, click to change it to "In progress".',
    width: 300,
    placement: 'bottom',
    order: 2
  };
  notStartedTooltip = {
    id: 'item-not-started',
    contextId: 'item',
    content: 'This entry hasn\'t been started yet, so you can\'t mark it as completed.',
    width: 300,
    placement: 'bottom',
    order: 3
  };

  @ViewChildren('focus') vc;

  constructor(private service: RevalidationService, private layout: LayoutService,
    private validator: RevalidationItemValidator,
    private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.id = this.route.snapshot.params['itemId'];
    this.revalidationId = this.route.snapshot.params['id'];
    this.isCurrentSubmission = this.route.snapshot.queryParams['current'] === 'true';
    const itemType: RevalidationItemType = +this.route.snapshot.params['itemType'];
    this.itemType = revalidationItemTypes
      .filter(item => item.type === itemType)[0];
  }

  ngOnInit() {
    if (this.id) {
      this.load();
    } else {
      this.create();
    }
  }


  ngAfterViewInit() {
    if (!this.id && this.vc.first) {
      this.vc.first.nativeElement.focus();
    }
  }

  warnForDirty(): Observable<any> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Unsaved changes`,
        message: `Are you sure you want to exit without saving ?`
      }
    });
    return dialogRef.afterClosed().pipe(map( confirmed => {
      if(confirmed) return true;
      else return false;
    }));
  }

  getProgressTooltip() {
    if (this.form.completed) { return this.completedTooltip; }
    if (!this.form.progress) { return this.notStartedTooltip; }
    return this.progressTooltip;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.form || !this.form.dirty) { return true; }
    return this.warnForDirty();
  }

  get form() {
    return this.validator.forms[0];
  }

  get progressLabel() {
    if (this.form.progress && !this.form.completed) {
      return 'Mark completed';
    } else {
      return '';
    }
  }

  create() {
    this.loading = true;
    this.service.getFormTemplateByType(this.itemType.type)
      .subscribe(formTemplate => {
        this.validator.setForm(formTemplate);
        this.validator.setNew(this.itemType.type);
        this.loading = false;
        this.started = true;
        this.setFocus();
      });
  }

  setFocus() {
    setTimeout(function () {
      if (this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }.bind(this), 100);
  }

  load() {
    this.loading = true;
    this.service.getEntry(this.id, this.revalidationId)
      .subscribe(item => {
        this.service.getFormTemplateById(item.dynamicFormId)
          .subscribe(formTemplate => {
            this.validator.setForm(formTemplate);
            this.validator.load(item);
            this.loading = false;
            this.started = true;
            this.setFocus();
          });
      }, error => { this.loading = false; });
  }

  exit() {
    if (this.isCurrentSubmission) {
      this.router.navigate(['/revalidation']);
    } else {
      this.router.navigate([`/revalidation/${this.revalidationId}`]);
    }
  }

  save() {
    if (this.saving) {
      return;
    }
    if (this.validator.validate()) {
      this.saving = true;
      this.validationErrors = [];
      this.service.save(this.validator.getPayload(), this.revalidationId).subscribe(result => {
        this.saving = false;
        this.form.dirty = false;
        this.exit();
      }, (error: HandledError) => {
        this.saving = false;
        if (error.validationErrors) {
          this.validationErrors = error.validationErrors;
        }
      });
    }
  }
}
