import { Component, Input, HostListener, Inject, ElementRef, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-sticky',
  moduleId: module.id,
  templateUrl: 'sticky.component.html',
  styleUrls: ['./sticky.scss']
})
export class StickyComponent implements OnInit {

  public isFixed = false;
  el: any;
  container: any;
  containerTop: number;
  width: number;

  constructor( @Inject(DOCUMENT) private document: Document, private elRef: ElementRef) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {

    let scrollTop;
    if (this.document.documentElement) {
      scrollTop = this.document.documentElement.scrollTop;
    } else {
      scrollTop = this.document.body.scrollTop;
    }

    if (scrollTop > this.containerTop) {
      this.isFixed = true;
    } else if (this.isFixed && scrollTop < this.containerTop) {
      this.isFixed = false;
    }
  }

  ngOnInit() {
    this.el = this.elRef.nativeElement;
    this.container = this.el.parentNode;
    this.containerTop = this.container.offsetTop; // this.getBoundingClientRectValue(this.container, 'top');
    this.width = this.getBoundingClientRectValue(this.container, 'width');
  }


   private getBoundingClientRectValue(element: any, property: string): number {
        let result = 0;
        if (element.getBoundingClientRect) {
            const rect = element.getBoundingClientRect();
            result = (typeof rect[property] !== 'undefined') ? rect[property] : 0;
        }
        return result;
    }

}
