import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreregApplicationComponent } from './preregApplication.component';
import { LoggedInOnlyGuard } from '../guard/LoggedInOnly.guard';
import { UserLoadedGuard } from '../guard/UserLoaded.guard';
import { StudentsOnlyGuard } from '../guard/StudentsOnly.guard';
import { CanDeactivateGuard } from '../guard/CanDeactivate.guard';
import { PastApplicationComponent } from './pastApplication.component';
import { StudentComponent } from './student.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ UserLoadedGuard, LoggedInOnlyGuard, StudentsOnlyGuard ],
    component: StudentComponent,
    data: { title: 'Student details' }
  },
  {
    path: 'application', 
    canActivate: [ UserLoadedGuard, LoggedInOnlyGuard, StudentsOnlyGuard ],
    component: PreregApplicationComponent, 
    data: { title: 'Prereg Application' , classname : 'application' } 
  },
  {
    path: 'pastApplication/:id',
    component: PastApplicationComponent,
    canActivate: [UserLoadedGuard, LoggedInOnlyGuard, StudentsOnlyGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    UserLoadedGuard,
    LoggedInOnlyGuard,
    StudentsOnlyGuard,
    CanDeactivateGuard
  ]
})
export class StudentRoutingModule { }
