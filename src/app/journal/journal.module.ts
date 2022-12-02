import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JournalPageRoutingModule } from './journal-routing.module';

import { JournalPage } from './journal.page';
import { CanvaspageComponent } from '../components/canvaspage/canvaspage.component';
import { CreatenoteComponent } from '../components/createnote/createnote.component';
import { ImageviewerComponent } from '../components/imageviewer/imageviewer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JournalPageRoutingModule
  ],
  declarations: [JournalPage, CanvaspageComponent, CreatenoteComponent, ImageviewerComponent]
})
export class JournalPageModule { }
