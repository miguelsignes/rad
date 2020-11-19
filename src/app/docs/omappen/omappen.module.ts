import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OmappenPageRoutingModule } from './omappen-routing.module';

import { OmappenPage } from './omappen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OmappenPageRoutingModule
  ],
  declarations: [OmappenPage]
})
export class OmappenPageModule {}
