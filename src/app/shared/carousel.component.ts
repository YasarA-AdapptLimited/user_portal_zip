import { Component, Input, Output, EventEmitter, Inject, QueryList,
  OnChanges, OnInit, AfterViewInit, ElementRef, NgZone, ViewChildren, TemplateRef } from '@angular/core';
import { LogService } from '../core/service/log.service';
import { Observable } from 'rxjs/internal/Observable';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import isEqual from 'lodash.isequal';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['carousel.component.scss']
})
/*
  *
  * @param() items - List of items to belong in carousel
  * @param() width - Size of window(view) to show
  * @param() $prev - Template for previous button
  * @param() $next - Template for next button
  * @param() $item - Template for the item
*/
export class CarouselComponent implements OnChanges, AfterViewInit {
  @Input() items = [];
  @Input() margin = 1;
  @Input() $prev;
  @Input() $next;
  @Input() $item;
  @ViewChildren('template') templates: QueryList<TemplateRef<any>>;
  @Output() selectedItem: EventEmitter<any> = new EventEmitter();
  @Output() scrollStart: EventEmitter<any> = new EventEmitter();
  @Output() scrollEnd: EventEmitter<any> = new EventEmitter();

  private focusTrap: FocusTrap;
  private previouslyFocussedElement: HTMLElement | null = null;


  @Input() set selectedIndex(value) {

    if (value === this.childIndex) { return; }
    const diff = value - this.childIndex;
    for (let i = 0; i < Math.abs(diff); i++) {
      this.scroll(diff > 0);
    }
    if (this.templates) {
      this.trapFocus(this.templates.toArray()[this.childIndex]);
    }
  }
  @Input() set layoutChange(value) {
    // this.setWidth();
  }

  childIndex = 0;
  amount = 0;
  startPress = 0;
  lastX = 0;
  container: any;
  @Input() width;

  slideEnabled = false;
  hasMargin = false;
  constructor(private zone: NgZone, private elementRef: ElementRef, private log: LogService, private focusTrapFactory: FocusTrapFactory,
    @Inject(DOCUMENT) private document: any) { }

  ngAfterViewInit() {

    const element = this.elementRef.nativeElement;
    this.container = element.parentNode;
    this.setWidth();
    this.trapFocus(this.templates.toArray()[0]);

    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(this.setWidth.bind(this));

  }





  setWidth() {
   // if (this.width) { return; }
    if (!this.container) { return; }
    setTimeout(() => {
      const width = this.getBoundingClientRectValue(this.container, 'width');
      this.hasMargin = width > 800;
      if (this.hasMargin) {
        this.width = width - 50;
      } else {
        this.width = width;
      }
      this.startPress = 1;
      setTimeout(() => {
        this.amount = -(this.calcScroll());
        this.startPress = 0;
      }, 100);
    }, 10);
  }

  private getBoundingClientRectValue(element: any, property: string): number {
    let result = 0;
    if (element.getBoundingClientRect) {
      const rect = element.getBoundingClientRect();
      result = (typeof rect[property] !== 'undefined') ? rect[property] : 0;
    }
    return result;
  }

  onMousedown(e: MouseEvent) {
    if (!this.slideEnabled) { return; }
    if (e.which === 1) {
      this.startPress = e.clientX;
      this.lastX = this.amount;
    }
  }
  onTouchdown(e: TouchEvent) {
    if (!this.slideEnabled) { return; }
    if (navigator.userAgent.indexOf('Android') >= 0) { e.preventDefault(); }
    this.startPress = e.targetTouches[0].clientX;
    this.lastX = this.amount;
  }

  onMousemove(e: MouseEvent, maxWidth: number) {
    if (!this.slideEnabled) { return; }
    if (e.which === 1) {
      const amount = this.lastX - (this.startPress - e.clientX);
      if (amount > 0 || amount < -(maxWidth - this.width)) { return; }
      this.amount = amount;
    }
  }
  onTouchmove(e: TouchEvent, maxWidth: number) {
    if (!this.slideEnabled) { return; }
    if (navigator.userAgent.indexOf('Android') >= 0) { e.preventDefault(); }
    const amount = this.lastX - (this.startPress - e.targetTouches[0].clientX);
    if (amount > 0 || amount < -(maxWidth - this.width)) { return; }
    this.amount = amount;
  }

  onMouseup(e: MouseEvent, elem) {
    if (!this.slideEnabled) { return; }
    if (e.which === 1) {
      this.startPress = 0;
      this.snap();
    }
  }

  onTouchup(e: TouchEvent, elem) {
    if (!this.slideEnabled) { return; }
    if (navigator.userAgent.indexOf('Android') >= 0) { e.preventDefault(); }
    this.startPress = 0;
    this.snap();
  }

  snap() {

    let counter = 0;
    let lastVal = 0;
    for (let i = 0; i < this.items.length; i++) {
      counter += this.width;
      if (this.amount <= lastVal && this.amount >= -counter) {
        this.amount = -lastVal;
        this.childIndex = i;
        this.selectedItem.emit({ item: this.items[this.childIndex], index: this.childIndex });
        return;
      }
      lastVal = counter;
    }
    return counter;
  }

  scroll(forward) {
    this.scrollStart.emit();
    setTimeout(() => {
      this.scrollEnd.emit();
    }, 1000);
    this.childIndex += forward ? 1 : -1;
    this.selectedItem.emit({
      item: this.items[this.childIndex],
      index: this.childIndex
    });
    this.amount = -(this.calcScroll());
  }

  calcScroll() {
    return this.width * this.childIndex;
  }

  ngOnChanges(changes) {
    if (changes.items && !isEqual(changes.items.previousValue, changes.items.currentValue)) {
      this.amount = 0;
    }
  }

  private trapFocus(element) {
    if (!element) { return; }
    setTimeout(() => {
    if (this.focusTrap) {
      this.focusTrap.destroy();
      this.focusTrap = undefined;
    }
    this.focusTrap = this.focusTrapFactory.create(element.nativeElement);
    }, 10);
  //  this.focusTrap.focusInitialElement();
  }

}
