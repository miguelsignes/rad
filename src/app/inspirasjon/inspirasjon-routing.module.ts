import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspirasjonPage } from './inspirasjon.page';

const routes: Routes = [
  {
    path: '',
    component: InspirasjonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspirasjonPageRoutingModule {}
