import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/service/auth.service';
import { User } from './account/model/User';

@Component({
  moduleId: module.id,
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  user: User;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.user = this.authService.user;
  }
}
