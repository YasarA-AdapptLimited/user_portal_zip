import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/service/auth.service';
import { Student } from '../shared/model/student/Student';
import { StudentService } from '../core/service/student.service';
import { User } from '../account/model/User';

@Component({
  moduleId: module.id,
  templateUrl: './student.component.html'
})
export class StudentComponent implements OnInit  {

  student;
  user: User;
  loading;

  constructor(private auth: AuthService, private service: StudentService) {
  }

  ngOnInit() {
    this.loading = true;
    this.service.getApplication(this.auth.user.registrationStatus).subscribe(application => {
      this.student = application.trainee;
      this.loading = false;
    });
    this.user = this.auth.user;
  }
}
