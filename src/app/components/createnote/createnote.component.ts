import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { JournalService } from 'src/app/services/journal.service';
import { CustomloaderService } from 'src/app/services/customloader.service';
@Component({
  selector: 'app-createnote',
  templateUrl: './createnote.component.html',
  styleUrls: ['./createnote.component.scss'],
})
export class CreatenoteComponent implements OnInit {
  @Input() item = '';
  @Output() changeCompoents: EventEmitter<any> = new EventEmitter();
  content: any = "";
  title: any = "";
  email: any = "";
  id: any = "";
  type: boolean = true;
  constructor(
    private auth: AuthenticationService,
    private journal: JournalService,
    public toastController: ToastController,
    public loadingCtrl: CustomloaderService
  ) {
    this.auth.getUserData().then((data) => {
      this.email = JSON.parse(data['value']).email;
    })

  }

  ngOnInit() {
    if (this.item) {
      this.type = false;
      this.id = this.item['id'];
      this.title = this.item['title'];
      this.content = this.item['content'];
    }
  }

  async addNewNotes() {
    const loading = await this.loadingCtrl.showLoader();
    let data = {
      email: this.email,
      title: this.title,
      content: this.content
    }
    this.journal.createNewNotes(data).subscribe(async item => {
      this.presentToast(item);
      this.title = "";
      this.content = "";
      await this.loadingCtrl.hideLoader(loading);
    }, async error => {
      console.log(error);
      await this.loadingCtrl.hideLoader(loading);
    })
  }

  async editNotes(data_id) {
    let data = {
      id: data_id,
      email: this.email,
      title: this.title,
      content: this.content
    };
    const loading = await this.loadingCtrl.showLoader();
    this.journal.updateNotes(data).subscribe(async item => {
      this.presentToast(item);
      this.title = "";
      this.content = "";
      await this.loadingCtrl.hideLoader(loading);
    }, async error => {
      console.log(error);
      await this.loadingCtrl.hideLoader(loading);
    })
  }

  async deleteNotes(data_id) {
    let data = {
      id: data_id,
      email: this.email,
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


  closeModel() {
    this.changeCompoents.emit({ type: 'notes' });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
