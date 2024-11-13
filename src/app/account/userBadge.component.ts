

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-badge',
  moduleId: module.id,
  templateUrl: './userBadge.component.html',
  styleUrls: ['./userBadge.scss']
})
export class UserBadgeComponent {

  @Input() title = 'User';
  @Input() link;

}
