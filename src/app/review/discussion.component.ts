import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, HostBinding } from '@angular/core';
import { Review } from './model/Review';
import { Message } from './model/Message';
import { ReviewStage } from './model/ReviewStage';
import { Observable } from 'rxjs/internal/Observable';
import { ReviewService } from '../core/service/review.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ReviewManagerService } from './reviewManager.service';


function mapMessage(message) {
  if (message.dateParsed) {
    if (message.date) { return message; }
    message.ticks = message.dateParsed.getTime();
    message.date = new Date(message.ticks).setHours(0, 0, 0, 0);
    message.time = message.dateParsed.getHours() + ':' + message.dateParsed.getMinutes();
    return message;
  }
  const date = message.dateTime.split(' ')[0];
  const time = message.dateTime.split(' ')[1];
  const hour = parseInt(time.split(':')[0], 10);
  const min = parseInt(time.split(':')[1], 10);
  const sec = parseInt(time.split(':')[2], 10);
  const day = parseInt(date.split('/')[0], 10);
  const month = parseInt(date.split('/')[1], 10) - 1;
  const year = parseInt(date.split('/')[2], 10);
  const dateParsed = new Date(year, month, day, hour, min, sec || 0, 0);
  message.ticks = dateParsed.getTime();
  message.dateParsed = new Date(message.ticks);
  message.date = dateParsed.setHours(0, 0, 0, 0);
  message.time = time.split(':').slice(0, 2).join(':');

  return message;
}

@Component({
  selector: 'app-discussion',
  moduleId: module.id,
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.scss']
})
export class DiscussionComponent implements AfterViewInit, OnInit, OnDestroy {

  helpVisible = false;
  scrolling = false;
  @HostBinding('class.shadow-deep-heavy') open = false;
  hasFocus = false;
  @ViewChild('messageRef') messagesRef: ElementRef;
  @ViewChild('sendboxRef') sendboxRef: ElementRef;
  messages: Message[] = [];
  groupedByDate = [];
  sending = false;
  refreshIntervalSeconds = 5;
  refreshTimer;
  lastMessageLoad: Date;

  subscriptions = [];

  constructor(private service: ReviewService, private manager: ReviewManagerService) { }

  get review() {
    return this.manager.review;
  }

  ngOnInit() {
    this.concatMessages(this.review.messages);
    // .sort((a,b) => {
    //  return a.dateTime > b.dateTime ? -1 : 1;
    // });
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(this.scroll.bind(this));

    this.lastMessageLoad = new Date();
    this.refreshTimer = setTimeout(this.refreshMessages.bind(this), this.refreshIntervalSeconds * 1000);

    this.subscriptions.push(this.manager.chatVisible$.subscribe(visible => {

      this.open = visible;
      if (visible) {
        setTimeout(() => {
          this.sendboxRef.nativeElement.focus();
        }, 250);
      }
    }));
  }

  close() {
    this.manager.closeChat();
  }

  concatMessages(newMessages) {
    this.messages = this.messages.concat(newMessages.map(mapMessage));
    this.makeDateGrouping();
  }

  makeDateGrouping() {
    const distinctDates = this.messages.reduce((acc, message) => {
      if (acc.indexOf(message.date) === -1) {
        acc.push(message.date);
      }
      return acc;
    }, []);

    this.groupedByDate = distinctDates.reduce((acc, date) => {
      acc.push({ date, messages: this.messages.filter(message => message.date === date) });
      return acc;
    }, []);
  }

  ngAfterViewInit() {
    setTimeout(this.scroll.bind(this));
  }

  ngOnDestroy() {
    clearTimeout(this.refreshTimer);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  scroll() {
    this.messagesRef.nativeElement.scrollTop = this.messagesRef.nativeElement.scrollHeight;
  }

  scrollAnimate() {
    // if (this.scrolling) { return; }
    this.scrollTo(this.messagesRef.nativeElement, this.messagesRef.nativeElement.scrollHeight, 500);
  }

  refreshMessages() {
    this.service.getDiscussionMessages(this.review.id).subscribe(messages => {
      /*
      const lastLoad = this.lastMessageLoad.getTime();
      this.lastMessageLoad = new Date();
      const newMessages = messages
        .map(mapMessage)
        .filter(message => {
          return message.dateParsed.getTime() > lastLoad;
        });
        */
      if (!messages || !messages.length) { return; }

      messages = messages.map(mapMessage);

      const existingPeerMessages = this.messages.filter(message => !message.currentUsersMessage);
      const newPeerMessages = messages.filter(message => !message.currentUsersMessage);

      if (newPeerMessages.length) {

        if (!existingPeerMessages.length ||
          newPeerMessages[newPeerMessages.length - 1].dateParsed > existingPeerMessages[existingPeerMessages.length - 1].dateParsed) {
          this.messages = messages;
          this.makeDateGrouping();
          setTimeout(this.scrollAnimate.bind(this));
        }

      }

      this.refreshTimer = setTimeout(this.refreshMessages.bind(this), this.refreshIntervalSeconds * 1000);
    }, error => {
      this.refreshTimer = setTimeout(this.refreshMessages.bind(this), this.refreshIntervalSeconds * 1000);
    });
  }

  send() {
    const message = this.sendboxRef.nativeElement.innerText;
    if (message.trim() === '') { return; }
    this.sending = true;
    this.service.sendDiscussionMessage(this.review.id, message).subscribe(result => {
      // if (result.success) {
      this.sendboxRef.nativeElement.innerText = '';
      const newMessage = {
        text: message,
        currentUsersMessage: true,
        dateParsed: new Date()
      };

      this.concatMessages([newMessage]);
      setTimeout(this.scrollAnimate.bind(this));
      // }
      this.sending = false;

    });
  }

  onKeyDown(event) {
    if (event.keyCode === 13) {
      this.send();
      event.preventDefault();
    }
  }

  // https://gist.github.com/andjosh/6764939
  scrollTo(element, to, duration) {
    this.scrolling = true;
    const start = element.scrollTop,
      change = to - start,
      increment = 2;

    let currentTime = 0;

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    const easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) { return c / 2 * t * t + b };
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };
    const easeOut = function (t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (4.257575757575761 * tc * ts + -7.9545454545454595 * ts * ts +
        0.6818181818181834 * tc + 4.46969696969697 * ts + -0.4545454545454546 * t);
    }

    const animateScroll = function () {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      } else {
        this.scrolling = false;
      }
    };
    animateScroll();
  }

}
