import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { LayoutService } from './service/layout.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.scss']
})
export class BrandingComponent implements OnInit  {

  @Input() showRings = true;
  @Input() appVersion;
  showVersion: boolean;

  constructor(private router: Router, private authService: AuthService, private layout: LayoutService) { }

  ngOnInit() {
    this.showVersion = environment.target !== 'PROD';
  }

  goHome() {
    if (this.authService.user) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    if (!this.authService.user) {
      this.authService.login();
    }
  }
}
