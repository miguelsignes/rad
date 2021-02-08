import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavPageRoutingModule } from './nav-routing.module';

import { NavPage } from './nav.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavPageRoutingModule,
    PipesModule
  ],
  declarations: [NavPage]
})
export class NavPageModule {}
