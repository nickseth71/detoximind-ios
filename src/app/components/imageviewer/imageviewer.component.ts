import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CustomloaderService } from 'src/app/services/customloader.service';
import { JournalService } from 'src/app/services/journal.service';

@Component({
  selector: 'app-imageviewer',
  templateUrl: './imageviewer.component.html',
  styleUrls: ['./imageviewer.component.scss'],
})
export class ImageviewerComponent implements OnInit {
  @Input() item = '';
  @Output() changeCompoents: EventEmitter<any> = new EventEmitter();
  constructor(
    public loadingCtrl: CustomloaderService,
    private journal: JournalService,
    public toastController: ToastController
  ) { }

  ngOnInit() {

  }
  closeModel() {
    this.changeCompoents.emit({ type: 'image-viewer' });
  }

  async deleteNotes(data_id) {
    let data = {
      id: data_id,
      email: this.item['email'],
    }
    const loading = await this.loadingCtrl.showLoader();
    this.journal.deleteNotes(data).subscribe(async item => {
  
      this.presentToast(item);
      this.closeModel();
      await this.loadingCtrl.hideLoader(loading);
    }, async error => {
      console.log(error);
      await this.loadingCtrl.hideLoader(loading);
    })
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
