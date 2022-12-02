import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Network } from '@capacitor/network';
import { AuthenticationService } from './services/authentication.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  networkStatus: boolean = false;
  alert: any;
  constructor(
    public alertController: AlertController,
    public router: Router,
    private platform: Platform,
    private _location: Location,
    private auth: AuthenticationService
  ) {
    this.platform.ready().then(async () => {
      await SplashScreen.hide();
    });
    Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        this.networkStatus = true;
        this.presentAlert("Network problem");

      } else {
        this.networkStatus = false;
        this.presentAlert("Network connected...");
      }
    });
    this.logCurrentNetworkStatus();
    this.backButtonEvent();


  }



  async logCurrentNetworkStatus() {
    const status = await Network.getStatus();
    if (!status.connected) {
      this.networkStatus = true;
      this.presentAlert('Network status:');
    } else {
      this.networkStatus = false;
    }

  };

  async presentAlert(message) {
    if (!this.networkStatus) {
      if (this.alert != undefined) {
        await this.alert.dismiss();
        this.router.navigate(['/home']);
      }
    } else {
      this.alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Warnning',
        backdropDismiss: false,
        // subHeader: 'Subtitle',
        message: message
      });
      await this.alert.present();
    }
  }


  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const path = window.location.pathname;
      if (path === '/home') {
        this.auth.remove_journalAuth();
        navigator['app'].exitApp();
      } else {
        this._location.back();
      }
    });
  }
}
