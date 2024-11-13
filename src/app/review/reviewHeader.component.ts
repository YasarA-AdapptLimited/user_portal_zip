import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from '../core/service/layout.service';
import { ReviewManagerService } from './reviewManager.service';
import { RegistrantType } from '../registration/model/RegistrantType';


@Component({
  selector: 'app-review-header',
  moduleId: module.id,
  templateUrl: './reviewHeader.component.html',
  styleUrls: ['./reviewHeader.scss']
})
export class ReviewHeaderComponent {

  RegistrantType = RegistrantType;
  constructor(private route: ActivatedRoute,
    private router: Router, public manager: ReviewManagerService, private layout: LayoutService) {



  }

  get review() {
    return this.manager.review;
  }

  exit() {
    this.manager.exiting$.next();
    setTimeout(() => {
      history.back();
      //this.router.navigate(['./review']);
    });
 }

  get loading() {
    return !this.manager.review;
  }

}
