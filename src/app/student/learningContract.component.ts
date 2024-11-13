import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { User } from '../account/model/User';

@Component({
  selector: 'app-learning-contract',
  moduleId: module.id,
  templateUrl: './learningContract.component.html',
  styleUrls: ['./learningContract.scss']
})
export class LearningContractComponent implements OnInit {
  @Output() selected = new EventEmitter();
  @Input() agreed;
  @Input() touched;
  username: string;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.username = this.auth.user.toJson().name;
  }


}
