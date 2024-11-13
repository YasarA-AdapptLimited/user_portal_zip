import { Component, OnInit, Input, AfterViewInit, OnDestroy, HostBinding } from '@angular/core';
import { LayoutState } from '../core/model/LayoutState';
import { BannerState } from '../core/model/BannerState';
import { LayoutService } from '../core/service/layout.service';

@Component({
  selector: 'app-banner2',
  moduleId: module.id,
  templateUrl: './banner2.component.html',
  styleUrls: ['./banner2.scss']
})
export class Banner2Component implements OnInit  {


  @Input() loading = false;
  @Input() updating = false;
  @Input() leftColWidth = 7;
  @Input() info = false;
  @Input() error = false;
  @Input() important = false;
  @Input() heading = 'loading...';
  @Input() subHeading: string;

  // if heading is dependant on async data, it will slide down when ready if this is set to true
  @Input() dynamicHeading: boolean;
  @Input() @HostBinding('class.toolbar') toolbar: boolean;
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
    this.rightColWidth = 12 - this.leftColWidth;
    this.layout.setBannerState(state);
    /*
    this.layoutState = this.layout.state;
    this.layoutStateSub = this.layout.onChange.subscribe(state => {
      this.layoutState = state;
    });
    */
  }
/*
  ngOnDestroy() {
    this.layoutStateSub.unsubscribe();
  }
*/

}
