import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  moduleId: module.id,
  template: `<mat-spinner [color]="color" [diameter]="diameter" [strokeWidth]="5"></mat-spinner>
  <div class="text-overlay"><ng-content></ng-content></div>
  `,
  styleUrls: ['./spinner.scss']
})
export class SpinnerComponent implements OnInit {

   @Input() light = false;
   @Input() large = false;
   @Input() small = false;
   @Input() tiny = false;
   @Input() diameter = 100;
   color = 'accent';

   ngOnInit() {
     if (this.light) {
       this.color = 'primary';
     }
     if (this.small) {
       this.diameter = 50;
     }
     if (this.tiny) {
      this.diameter = 30;
    }
    if (this.large) {
      this.diameter = 120;
    }
   }


}
