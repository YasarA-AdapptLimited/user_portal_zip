import { Component, Input, Output, EventEmitter, Inject,
  ViewChildren, ContentChildren, AfterContentInit, ElementRef, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutService } from '../core/service/layout.service';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';

@Component({
  selector: 'app-form-section',
  moduleId: module.id,
  templateUrl: './formSection.component.html',
  styleUrls: ['./formSection.scss']
})
export class FormSectionComponent   {

  loading = false;
  editing = false;
  foreground = false;
  private focusTrap: FocusTrap;
    /** Element that was focused before the dialog was opened. Save this to restore upon close. */
  private elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  @Input() invalid = false;
  @Input() primary = false;
  @Input() editable = false;
  @Input() allowSave = true;
  @Input() autoToggle = true;
  @Input() saving = false;
  @Input() loaderFill = false;
  @HostBinding('class.clickable') @Input() link;
  @Input() badge = false;
  @Output() onCancel = new EventEmitter();
  @Output() onSave = new EventEmitter();
  @Output() onEdit = new EventEmitter();


  @Input('editing') set setEditing(value) {

    this.layout.setOverlay(value);
    this.editing = value;
    if (value) {
      this.foreground = true;
    }
    if (!value) {
      setTimeout(() => {
        this.foreground = false;
      }, 400);
    }

    if (!this.editing) {
      setTimeout(() => {
        if (this.editButtonRef.first && this.editButtonRef.first.nativeElement) {
          this.editButtonRef.first.nativeElement.focus();
        }
      }, 100);
    }
  }

  @ViewChildren('editButton') editButtonRef;

  constructor(private router: Router, private layout: LayoutService,
    private elementRef: ElementRef,
    private focusTrapFactory: FocusTrapFactory,
    @Inject(DOCUMENT) private document: any) { }

  @Input('loading') set setLoading(loading: boolean) {
    this.loading = loading;
  }



  toggleEdit() {
    if (this.editing) {
      this.onCancel.emit();
      this.restoreFocus();
    } else {
      this.onEdit.emit();
      this.trapFocus();
    }
    if (this.autoToggle) {
      this.editing = !this.editing;
    }

  }

  save() {
    if (!this.invalid) {
      this.onSave.emit();
    }
  }

  cancelEdit() {
    if (this.editing) {
      this.toggleEdit();
    }
  }

  onClick($event) {
    if (this.link && !this.editing) {
      this.router.navigate([this.link]);
      return;
    }
    /*
    if (this.editable && !this.editing) {
        this.toggleEdit();
    }*/
  }

  onKeyPressEnter ($event) {

    if (this.link && !this.editing) {
      this.router.navigate([this.link]);
      return;
    }
    if (this.editable && !this.editing) {
      this.toggleEdit();
      return;
    }
    /*
    if (this.editing && !this.invalid) {
      this.onSave.emit();
      return;
    }
    */
  }

  private trapFocus() {
    this.savePreviouslyFocusedElement();
    if (!this.focusTrap) {
      this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
    }

    // If were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
   /* this.focusTrap.focusInitialElementWhenReady();
    then(hasMovedFocus => {
      // If we didn't find any focusable elements inside the dialog, focus the
      // container so the user can't tab into other elements behind it.
      if (!hasMovedFocus) {
        this.elementRef.nativeElement.focus();
      }
    });*/
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  private restoreFocus() {
  //  const toFocus = this.elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
   // if (toFocus && typeof toFocus.focus === 'function') {
   //   toFocus.focus();
   // }

    if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = undefined;
    }
  }

  /** Saves a reference to the element that was focused before the dialog was opened. */
  private savePreviouslyFocusedElement() {
    if (this.document) {
      this.elementFocusedBeforeDialogWasOpened = this.document.activeElement as HTMLElement;
    }
  }


}
