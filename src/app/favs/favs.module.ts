import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavsPageRoutingModule } from './favs-routing.module';

import { FavsPage } from './favs.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    FavsPageRoutingModule
  ],
  declarations: [FavsPage]
})
export class FavsPageModule {}
