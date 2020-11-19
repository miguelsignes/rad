import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OmappenPage } from './omappen.page';

const routes: Routes = [
  {
    path: '',
    component: OmappenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OmappenPageRoutingModule {}
