import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RoundProgressComponent} from './round-progress.component';
import {RoundProgressService} from './round-progress.service';
import {RoundProgressEase} from './round-progress.ease';
import {RoundProgressConfig} from './round-progress.config';

@NgModule({
  imports: [CommonModule],
  declarations: [RoundProgressComponent],
  exports: [RoundProgressComponent],
  providers: [RoundProgressService, RoundProgressEase, RoundProgressConfig]
})
export class RoundProgressModule {}
