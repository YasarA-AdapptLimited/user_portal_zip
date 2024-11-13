import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { AccountService } from '../service/account.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../core/service/layout.service';
import { Notification } from '../model/Notification';
import { AuthService } from '../../core/service/auth.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { NotificationType } from '../model/NotificationType';
import { Observable } from 'rxjs/internal/Observable';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          transform: 'translateY(5px)',
          opacity: 0.3
        }),
        animate('400ms cubic-bezier(0, 0, 0.2, 1)',
          style({
            transform: 'translateY(0)',
            opacity: 1
          }))
      ])
    ])
  ]
})
export class NotificationsComponent implements OnInit, AfterViewInit {

  constructor(private service: AccountService, private router: Router,
    public layout: LayoutService, public authService: AuthService, private cd: ChangeDetectorRef) { }

  loading = false;
  failed = false;
  selectedItem: Notification;
  pageNum = 0;
  pageSize = 5;
  totalCount;
  notifications;
  NotificationType = NotificationType;
  @ViewChildren("messageContentSkip") messageContentSkip: QueryList<ElementRef>;
  @ViewChild("messageContent") messageContent: ElementRef;

  ngOnInit() {
    this.load();
    this.updateCount();
  }

  load() {
    this.loading = true;
    this.failed = false;
    const props: any = {};

    this.service
      .getNotifications(this.pageNum * this.pageSize, this.pageSize, props)
      .subscribe(result => {
        this.notifications = result;
        this.totalCount = props.totalCount;
        this.loading = false;
        this.open(result[0]);
      }, error => {
        this.loading = false;
        this.failed = true;
      });
  }

  ngAfterViewInit() {
    this.setCustomFocusOrder();
  }

  setCustomFocusOrder() {
    setTimeout(() => {
      try {
        let arr = this.messageContentSkip.toArray();

        if (arr && arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            arr[i].nativeElement.addEventListener('focus', () => {
              this.messageContent.nativeElement.focus();
            }, true);
          }
        } 
      } catch (error) {
        console.log(error);
      }
    }, 5000);
  }

  updateCount() {
    this.service.updateNotificationCount().subscribe();
  }

  get pageTo() {
    const pageTo = (this.pageNum + 1) * this.pageSize;
    return pageTo > this.totalCount ? this.totalCount : pageTo;
  }
  get pageFrom() {
    return (this.pageNum * this.pageSize) + 1;
  }

  nextPage() {
    this.pageNum++;
    this.load();
  }

  prevPage() {
    this.pageNum--;
    this.load();
  }

  open(item: Notification) {
    if (!this.layout.state.xs) {
      this.selectedItem = undefined;
    }

    setTimeout(() => {
      this.selectedItem = item;
    });

    setTimeout(() => {
      if (item && this.selectedItem && item === this.selectedItem &&
        item.deactivateManually && !item.deactivatedAt) {
        this.service.markNotificationHandled(item.id).subscribe(() => {
          item.deactivatedAt = new Date().toJSON();
          this.updateCount();
          /*
          const props: any = {};
          this.service.getNotifications(this.pageNum, this.pageSize, props)
            .subscribe(result => {
              if (this.selectedItem) {
                this.selectedItem = result.find(n => n.id === this.selectedItem.id);
              }
              this.totalCount = props.totalCount;
              this.notifications = result;

            });
            */
        });
      }
    }, 2000);
  }

  createTestNotification() {
    this.service.createTestNotification().subscribe(() => {
      this.load();
    });
  }

  navigate(item) {
    this.router.navigate([item.url]);
  }

}
