import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CustomloaderService } from '../services/customloader.service';
import { JournalService } from '../services/journal.service';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  segmentModel: any = 'note';
  email: any;
  data: any;
  openDraw: boolean = false;
  openNote: boolean = false;
  openDrawViewer: any = false;
  selected_data: any;
  constructor(
    private journalService: JournalService,
    private auth: AuthenticationService,
    public loader_cust: CustomloaderService,
  ) {
    this.auth.getUserData().then(itm => {
      this.email = JSON.parse(itm['value']).email;
      this.getDataAll(this.email);
    })
  }

  ngOnInit() {

  }
  segmentChanged(evt: any) {
    this.segmentModel = evt.detail.value;
  }

  async getDataAll(email) {
    const loading = await this.loader_cust.showLoader();
    this.journalService.getTextNotes(email).subscribe(async item => {
      this.data = item;
      await this.loader_cust.hideLoader(loading);
    }, async error => {
      await this.loader_cust.hideLoader(loading);
    });
  }
  openNotes(item) {
    this.selected_data = item;
    this.openNote = true;
  }
  changeNotes(evt: any) {
    if (evt.type === "notes") {
      this.openNote = false;
    }
    if (evt.type === "noteDraw") {
      this.openDraw = false;
    }
    if (evt.type === "image-viewer") {
      this.openDrawViewer = false;
    }
    this.getDataAll(this.email);
  }
  openFab(item) {
    this.selected_data = "";
    if (item == 'note') {
      this.openDraw = false;
      this.openNote = true;
    } else {
      this.openDraw = true;
      this.openNote = false;
    }
  }
  openDrawPanal(item) {
    this.selected_data = item;
    this.openDrawViewer = true;
  }

}
