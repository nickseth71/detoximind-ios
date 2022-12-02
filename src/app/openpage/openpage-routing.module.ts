import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenpagePage } from './openpage.page';

const routes: Routes = [
  {
    path: '',
    component: OpenpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenpagePageRoutingModule {}
