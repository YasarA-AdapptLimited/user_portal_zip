import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FaqService } from '../shared/faq.service';

@Component({
  selector: 'app-renewal-faq',
  moduleId: module.id,
  templateUrl: './renewalFaq.component.html',
  styleUrls: ['./renewalFaq.scss'],
  providers: [ FaqService ]
})
export class RenewalFaqComponent {
   
  // Using a map to keep track of the expanded state for each button by its id
   expandedStates = new Map<string, boolean>();

   toggleAccordion(id: string) {
     const isExpanded = this.expandedStates.get(id) || false;
     this.expandedStates.set(id, !isExpanded);
   }
 
   isButtonExpanded(id: string): boolean {
     return this.expandedStates.get(id) || false;
   }

}
