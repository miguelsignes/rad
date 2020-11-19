import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspirasjonPageRoutingModule } from './inspirasjon-routing.module';

import { InspirasjonPage } from './inspirasjon.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspirasjonPageRoutingModule,
    PipesModule
  ],
  declarations: [InspirasjonPage]
})
export class InspirasjonPageModule {}
