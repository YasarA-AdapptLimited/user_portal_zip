import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevalidationComponent } from './revalidation.component';
import { RevalidationItemComponent } from './revalidationItem.component';
import { ExtenuatingCircumstancesComponent } from './extenuatingCircumstances.component';
import { ExtenuatingCircumstancesFaqComponent } from './extenuatingCircumstancesFaq.component';
import { PastSubmissionComponent } from './pastSubmission.component';
import { CanDeactivateGuard } from '../guard/CanDeactivate.guard';
import { SubmittedExtenuatingCircumstancesComponent } from './submittedExtenuatingCircumstances.component';
import { SubmittedExtCircAdviceComponent } from './submittedExtCircAdviceComponent.component';
import { ExtenuatingCircumstancesHelpComponent } from './extenuatingCircumstancesHelp.component';
import { PastSubmission2Component } from './pastSubmission2.component';

const routes: Routes = [
  {
    path: '', component: RevalidationComponent,
    data: { title: 'Revalidation' }
  },
  {
    path: 'exceptional-circumstances',
    component: ExtenuatingCircumstancesComponent,
    data: {
      title: 'Exceptional circumstances'
    }
  },
  {
    path: 'exceptional-circumstances/help',
    component: ExtenuatingCircumstancesHelpComponent,
    data: {
      title: 'Exceptional circumstances help'
    }
  },
  {
    path: 'exceptional-circumstances/:id/advice/:type',
    component: SubmittedExtCircAdviceComponent,
    data: {
      title: 'Exceptional circumstances - notice of decision'
    }
  },
  {
    path: 'exceptional-circumstances/:id',
    component: SubmittedExtenuatingCircumstancesComponent,
    data: {
      title: 'Exceptional circumstances'
    }
  },

{
  path: 'exceptional-circumstances/faq',
    component: ExtenuatingCircumstancesFaqComponent,
      data: {
    title: 'Telling us about extenuating circumstances'
  }
},
{
  path: ':id', component: RevalidationComponent,
  data: { title: 'Revalidation' }
},
{
  path: ':id/item/:itemType',
    component: RevalidationItemComponent,
      canDeactivate: [CanDeactivateGuard],
        data: {
    title: 'New revalidation entry'
  }
},
{
  path: ':id/item/:itemType/:itemId',
    component: RevalidationItemComponent,
      canDeactivate: [CanDeactivateGuard],
        data: {
    title: 'Edit revalidation entry'
  }
},
{ path: 'past/:id', component: PastSubmission2Component, data: { title: 'View past and overdue submissions' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevalidationRoutingModule { }
