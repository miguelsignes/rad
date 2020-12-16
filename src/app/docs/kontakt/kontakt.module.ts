import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KontaktPageRoutingModule } from './kontakt-routing.module';

import { KontaktPage } from './kontakt.page';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KontaktPageRoutingModule,
    PipesModule
  ],
  declarations: [KontaktPage]
})
export class KontaktPageModule {}
