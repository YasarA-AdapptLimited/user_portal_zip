import { Component, OnInit, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { LayoutState } from '../core/model/LayoutState';
import { BannerState } from '../core/model/BannerState';
import { LayoutService } from '../core/service/layout.service';

@Component({
  selector: 'app-banner',
  moduleId: module.id,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.scss']
})
export class BannerComponent implements OnInit, AfterViewInit {

  @ViewChild('focusMain') focusMain: ElementRef;

  @Input() loading = false;
  @Input() leftColWidth = 7;
  @Input() info = false;
  @Input() application = false;
  @Input() error = false;
  @Input() important = false;
  @Input() progressDark = false;
  @Input() noButtons = false;
  rightColWidth = 5;
  /*
  layoutState: LayoutState;
  layoutStateSub;
  */
  constructor(public layout: LayoutService) { }

  ngOnInit() {
    let state = BannerState.default;
    if (this.info) {
      state = BannerState.info;
    }
    if (this.important) {
      state = BannerState.important;
    }
    if (this.application) {
      state = BannerState.application;
    }
    this.rightColWidth = 12 - this.leftColWidth;
    this.layout.setBannerState(state);
    /*
    this.layoutState = this.layout.state;
    this.layoutStateSub = this.layout.onChange.subscribe(state => {
      this.layoutState = state;
    });
    */
  }

  ngAfterViewInit() {
    // focus the main page title for screen reader UX
      let childElement = this.focusMain.nativeElement?.children[0].children[0];
      if (childElement) {
        childElement.setAttribute("tabindex", 0);
        childElement.focus();
        childElement.setAttribute("class", "focus-outline-hide");
      }  
  }

  // ngOnDestroy() {
  //   // this.layoutStateSub.unsubscribe();
  // }
}
