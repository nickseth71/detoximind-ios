import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AskmebuddyPage } from './askmebuddy.page';

const routes: Routes = [
  {
    path: '',
    component: AskmebuddyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AskmebuddyPageRoutingModule {}
