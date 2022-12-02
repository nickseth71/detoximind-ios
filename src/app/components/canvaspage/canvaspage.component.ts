import { Component, AfterViewInit, ViewChild, Output, EventEmitter, } from '@angular/core';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomloaderService } from 'src/app/services/customloader.service';
import { JournalService } from 'src/app/services/journal.service';

@Component({
  selector: 'app-canvaspage',
  templateUrl: './canvaspage.component.html',
  styleUrls: ['./canvaspage.component.scss'],
})
export class CanvaspageComponent implements AfterViewInit {
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  @Output() changeCompoents: EventEmitter<any> = new EventEmitter();
  canvasElement: any;
  saveX: number;
  saveY: number;
  rangeFlag: boolean = false;
  colorFlag: boolean = false;
  selectedColor = '#9e2956';
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3', '#FF5733', '#52FF33', '#FF9C33', '#FF33FF', '#581845', '#DAF7A6', '#C70039', '#250825', '#28CDB6', '#2F952A', '#2F952A'];
  errager = "#fff";
  drawing: any = false;
  lineWidth = 5;
  image_url: any;
  title: any;
  email: any;
  constructor(
    private plt: Platform,
    private toastCtrl: ToastController,
    private journal: JournalService,
    private auth: AuthenticationService,
    private loadingController: CustomloaderService,
    private alertController: AlertController
  ) {
    this.auth.getUserData().then((data) => {
      this.email = JSON.parse(data['value']).email;
    })
  }

  ngAfterViewInit() {
    // Set the Canvas Element and its size
    this.canvasElement = this.canvas.nativeElement;
    // this.canvasElement.width = this.plt.width() + '';
    // this.canvasElement.height = 200;
    this.canvasElement.width = 350;
    this.canvasElement.height = 400;
    document.querySelectorAll(".color-block")[0].classList.add('active')
  }

  startDrawing(ev) {
    this.drawing = true;
    var canvasPosition = this.canvasElement.getBoundingClientRect();
    if (ev.pageX != undefined) {
      this.saveX = ev.pageX - this.canvasElement.getBoundingClientRect().x;
      this.saveY = ev.pageY - this.canvasElement.getBoundingClientRect().y;
    }
    if (ev.changedTouches != undefined) {
      this.saveX = ev.changedTouches[0].pageX - this.canvasElement.getBoundingClientRect().x;
      this.saveY = ev.changedTouches[0].pageY - this.canvasElement.getBoundingClientRect().y;
    }
  }

  endDrawing() {
    this.drawing = false;
  }

  selectColor(evt, color) {
    document.querySelectorAll(".color-block").forEach(item => {
      item.classList.remove("active");
      this.colorFlag = false;
    })
    if (evt.target.classList.contains('icon')) {
      evt.target.parentNode.classList.add('active');
    } else {
      evt.target.classList.add('active');
    }
    this.selectedColor = color;

  }

  setBackground() {
    var background = new Image();
    background.src = './assets/code.png';
    let ctx = this.canvasElement.getContext('2d');

    background.onload = () => {
      ctx.drawImage(background, 0, 0, this.canvasElement.width, this.canvasElement.height);
    }
  }

  moved(ev) {

    if (this.drawing) {
      var currentX;
      var currentY;
      var canvasPosition = this.canvasElement.getBoundingClientRect();
      let ctx = this.canvasElement.getContext('2d');

      if (ev.pageX != undefined) {
        currentX = ev.pageX - this.canvasElement.getBoundingClientRect().x;
        currentY = ev.pageY - this.canvasElement.getBoundingClientRect().y;
      }

      if (ev.changedTouches != undefined) {
        currentX = ev.changedTouches[0].pageX - this.canvasElement.getBoundingClientRect().x;
        currentY = ev.changedTouches[0].pageY - this.canvasElement.getBoundingClientRect().y;
      }

      ctx.lineJoin = 'round';
      ctx.strokeStyle = this.selectedColor;
      ctx.lineWidth = this.lineWidth;
      ctx.beginPath();
      ctx.moveTo(this.saveX, this.saveY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();
      ctx.stroke();
      this.saveX = currentX;
      this.saveY = currentY;
    }
  }

  // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  async saveImage() {

    const loading = await this.loadingController.showLoader();
    var dataURL = this.canvasElement.toDataURL("image/png");
    this.image_url = dataURL.split(',')[1];
    let data = {
      email: this.email,
      title: this.title,
      image_url: this.image_url
    }

    this.journal.createNewNotes(data).subscribe(async item => {
      this.presentToast(item);
      await this.loadingController.hideLoader(loading);
    }, async error => {
      console.log(error);
      await this.loadingController.hideLoader(loading);
    })
  }


  closeModel() {
    this.changeCompoents.emit({ type: 'noteDraw' });
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Please Enter Title',
      buttons: [{
        text: 'Submit',
        role: 'confirm',
        handler: (alertData) => {
          this.title = alertData.title;
          this.saveImage();
        }
      }],
      inputs: [
        {
          placeholder: 'Title',
          name: 'title',
          type: 'text'
        }
      ]
    });
    await alert.present();
  }

  rangeFunChange() {
    this.colorFlag = false;
    this.rangeFlag = true;
  }
  colorFunChange() {
    this.colorFlag = true;
    this.rangeFlag = false;
  }

  closeButtons(type: any) {
    if (type == "colorFlag") {
      this.colorFlag = false;
    } else {
      this.rangeFlag = false;
    }
  }


}
