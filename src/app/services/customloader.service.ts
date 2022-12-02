import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CustomloaderService {

  constructor(
    public loadingController: LoadingController
  ) { }

  // Show the loader for infinite time
  async showLoader() {
    const loading = await this.loadingController.create({
      spinner: 'dots',
      cssClass: 'custom-all-loading',
      message: `<div class="loading-img">
      <img src="../assets/Logo-wp.png" />
      </div>`
    });
    await loading.present();
    return loading;

  }

  // Hide the loader if already created otherwise return error
  async hideLoader(loading) {
    return await loading.dismiss();
  }
}
