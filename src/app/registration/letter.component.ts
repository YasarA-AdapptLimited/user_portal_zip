

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LetterType } from './model/LetterType';

@Component({
  moduleId: module.id,
  templateUrl: './letter.component.html'
})
export class LetterComponent {

  LetterType = LetterType;
  letterType;
  constructor(private route: ActivatedRoute) {
    this.letterType = parseInt(route.snapshot.params['letterType'], 10);
  }



}
