import { Component, Input } from '@angular/core';
import { RenewalStatus } from '../../renewal/model/RenewalStatus';
import { Renewal } from '../../renewal/model/Renewal';

@Component({
  selector: 'app-renewal-message',
  moduleId: module.id,
  templateUrl: './renewalMessage.component.html'
})
export class RenewalMessageComponent  {

  @Input() renewal: Renewal;
  RenewalStatus = RenewalStatus;

}
