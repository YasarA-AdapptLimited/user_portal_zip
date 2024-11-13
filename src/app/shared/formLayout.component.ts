import { Component, Input, OnInit, AfterContentInit, ViewChild, ElementRef} from '@angular/core';
import { LogService } from '../core/service/log.service';

@Component({
  selector: 'app-form-layout',
  moduleId: module.id,
  templateUrl: './formLayout.component.html'
})
export class FormLayoutComponent implements OnInit, AfterContentInit  {
  @Input() bodyWidth = 8;
  @Input() spread = false;
  @ViewChild('formHeader', { static: true }) formHeader: ElementRef;
  buttonsWidth = 5;
  showHeader = false;

  ngOnInit() {
    this.buttonsWidth = 12 - this.bodyWidth;
  }

  ngAfterContentInit() {
    this.showHeader = this.formHeader.nativeElement.children.length > 0;
}

}
