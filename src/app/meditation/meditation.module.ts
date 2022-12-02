import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeditationPageRoutingModule } from './meditation-routing.module';

import { MeditationPage } from './meditation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeditationPageRoutingModule
  ],
  declarations: [MeditationPage]
})
export class MeditationPageModule {}
