import { Component, Input, OnInit } from '@angular/core';
import { NotificationType } from '../model/NotificationType';
import { Notification } from '../model/Notification';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-notification-content',
  moduleId: module.id,
  templateUrl: './notificationContent.component.html'
})
export class NotificationContentComponent implements OnInit {

  NotificationType = NotificationType;

  @Input() item: Notification;
    
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  get type() {
    return this.item.type;
  }

}
