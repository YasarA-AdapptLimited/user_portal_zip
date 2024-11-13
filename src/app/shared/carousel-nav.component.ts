import { Component, Input, Output, EventEmitter, OnChanges, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-carousel-nav',
  templateUrl: './carousel-nav.component.html'
})

export class CarouselNavComponent {
  @Input() items = [];
  @Input() selectedIndex;
  @Input() label = 'items';
  @Output() onIndexSelected = new EventEmitter<any>();

  select(index) {
    this.onIndexSelected.emit({ index });
  }

  next() {
    if (this.selectedIndex < this.items.length - 1) {
      this.selectedIndex++;
      this.select(this.selectedIndex);
    }
  }

  prev() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.select(this.selectedIndex);
    }
  }

}
