import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  moduleId: module.id,
  templateUrl: './extenuatingCircumstancesHelp.component.html',
  styleUrls: ['extenuatingCircumstancesHelp.scss']
})
export class ExtenuatingCircumstancesHelpComponent {

  constructor(
    private router: Router
  ) {}

  exit() {
    this.router.navigate(['/revalidation/exceptional-circumstances']);
  }


}
