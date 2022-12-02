import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenpagePageRoutingModule } from './openpage-routing.module';

import { OpenpagePage } from './openpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenpagePageRoutingModule
  ],
  declarations: [OpenpagePage]
})
export class OpenpagePageModule {}
