import { Component, Input } from '@angular/core';
import { CpdEntry } from '../model/review/CpdEntry';
@Component({
  selector: 'app-cpd-entry-annotations',
  moduleId: module.id,
  templateUrl: './cpdEntryAnnotations.component.html'
})
export class CpdEntryAnnotationsComponent {

  @Input() cpdEntry: CpdEntry;

}
