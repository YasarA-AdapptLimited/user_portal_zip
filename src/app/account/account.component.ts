import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { User } from './model/User';

@Component({
  selector: 'app-account',
  moduleId: module.id,
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit  {

  loading = false;
  user: User;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.user = this.authService.user;
  }

}
