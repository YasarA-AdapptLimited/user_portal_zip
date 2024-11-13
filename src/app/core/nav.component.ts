import { Component, Input, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { LayoutService } from './service/layout.service';
import { BannerState } from './model/BannerState';
import { AccountService } from '../account/service/account.service';
import { LoggedInState } from '../account/model/LoggedInState';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Subject } from 'rxjs';
import { FormScope } from '../registration/model/FormScope';
import { CurrentApplicationService } from './service/prereg/currentApplication.service';
import { RegistrantStatus } from '../registration/model/RegistrantStatus';
import { ReturnToRegisterApplication } from '../registration/return-to-register/model/ReturnToRegister';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.scss'],
  animations: [
    trigger('openState', [
      state('open', style({
        height: '*'
      })),
      state('closed', style({
        height: '0'
      })),
      transition('closed <=> open', animate('500ms cubic-bezier(.25,.8,.25,1)'))
    ])
  ]
})
export class NavComponent implements OnInit, OnDestroy {

  openState = 'closed';
  BannerState = BannerState;
  LoggedInState = LoggedInState;
  @Input() direction = 'horizontal';
  currentApplicationLink: string;
  IPApplicationLink: string;
  noApplication: string;
  selectedItem = "none";
  @Input('isOpen') set setIsOpen(isOpen) {
    if (this.direction === 'vertical') {
      this.openState = isOpen ? 'open' : 'closed';
    }
  }
  isLoggedIn$ = new Subject<Boolean>();
  navigationCount = 0;
  activeItem: any;

  navMenu: any;
  navItems: [] = [];
  navLabel = "Navigation menu";

  constructor(public authService: AuthService,
    public layout: LayoutService,
    private accountService: AccountService,
    private currentApplicationService: CurrentApplicationService,
    private render: Renderer2,
    private router: Router) { }

  userSub;

  ngOnInit() {
    if (this.direction === 'horizontal') {
      this.openState = 'open';
    }

    this.authService.loggedInState$.subscribe(loggedInState => {
      this.isLoggedIn$.next(loggedInState === LoggedInState.loggedIn);

      this
        .currentApplicationService
        .availableForm
        .subscribe(formscope => {
          switch (formscope) {
            case FormScope.AssessmentRegistration:
              this.currentApplicationLink = 'prereg/assessment-registration';
              break;
            case FormScope.ProgressReport:
              this.currentApplicationLink = 'prereg/assessment-report';
              break;
            case FormScope.Trainee:
              this.currentApplicationLink = 'prereg/application';
              break;
            case FormScope.FinalDeclaration:
              this.currentApplicationLink = 'prereg/final-declaration';
              break;
            default:
              break;
          }
        });

      if (this.authService.user && this.authService.user.isRegistrant) {
        this.currentApplicationService.registrant
          .subscribe(() => {
            this.IPApplicationLink = 'application';
          });
      }
    });

    setTimeout(() => { // navigation is not rendered for a while after view initialization   
      try {
        this.navMenu = this.render.selectRootElement("#navMenu", true);

        if (this.navMenu !== undefined) {
          this.navItems = this.navMenu?.children;
          
          if (this.navItems !== undefined) {
            this.navigationCount = this.navItems.length - 2;  // remove two non-navigation items
            this.setNavLabel();
          }
        }
      } catch (error) {
        console.error(error);
      } 
    }, 10000);
  }
  
  setNavLabel() {
    this.navLabel = "Navigation menu, list of " + this.navigationCount + " items.";
  }

  get showIneligibleToRegister() {
    return this.authService.user?.registrationStatus === RegistrantStatus.IneligibleToRegister;
  }

  get showRevalidation() {
    return this.authService.user &&
      this.authService.user.isRegistrant && !this.authService.user.registrant.exemptFromRevalidationSubmissions;
  }

  get notificationCount() {
    return this.accountService.notificationCount$.value;
  }

  get paymentLink() {
    return this.router.url === '/paymentSuccess' ? this.router.url === '/paymentSuccess' : this.router.url === '/paymentFailure';
  }

  // get showPrescriberApplication() {
  //   return this.authService.user &&
  //     this.authService.user.isRegistrant && this.authService.user.registrant.isIndyPrescAppAvailable;
  // }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  log(val) {
    console.log(val);
  }

  public signout() {
    this.authService.logout();
  }
}
