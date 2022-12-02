import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskmebuddyPageRoutingModule } from './askmebuddy-routing.module';

import { AskmebuddyPage } from './askmebuddy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AskmebuddyPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AskmebuddyPage]
})
export class AskmebuddyPageModule { }
