import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ForgetService } from '../services/forget.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../helper/must-match.validator';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CustomloaderService } from '../services/customloader.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.page.html',
  styleUrls: ['./forgetpassword.page.scss'],
})
export class ForgetpasswordPage implements OnInit {
  sendEmail: boolean = true;
  email: any = '';
  token: any;
  credentials: FormGroup;
  credentialsEmail: FormGroup;
  showPassword: any = true;
  resetcode: any = '';
  inputType: any = "password";
  showlockPassword: any = true;

  constructor(
    private forgetApi: ForgetService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    public loadingController: CustomloaderService,
    public router: Router,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.credentialsEmail = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
    this.credentials = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],

      confirmPassword: ['', [Validators.required]],
      restCode: ['', [Validators.required, Validators.minLength(4)]]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.authService.getAdminToken().subscribe(item => {
      this.token = item['data']['token'];
    })

  }
  async sendEmailVerification() {
    const loading = await this.loadingController.showLoader();
    this.email = this.credentialsEmail.value.email;
    this.forgetApi.sendEmailCode({ email: this.credentialsEmail.value.email }, this.token).subscribe(async item => {
      this.presentToast(item['message'])
      this.sendEmail = false;
      await this.loadingController.hideLoader(loading);
    }, async error => {
      await this.loadingController.hideLoader(loading);
      if (error.error.message) {
        this.presentToast(error.error.message)
      }
    })
  }
  async forgetPassword() {
    const loading = await this.loadingController.showLoader();
    let data = { email: this.email, password: this.credentials.value.password, code: this.credentials.value.restCode }
    this.forgetApi.forgetPasswordCode(data, this.token).subscribe(async item => {
      this.presentToast(item['message'])
      await this.loadingController.hideLoader(loading);
      this.sendEmail = true;
      this.router.navigate(['/login']);
    }, async error => {
      await this.loadingController.hideLoader(loading);
      if (error.error.message) {
        this.presentToast(error.error.message);
      }
    })
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }
  hidePassword() {
    this.showPassword = true;
    this.inputType = "password";
  }
  showinputPassword() {
    this.showPassword = false;
    this.inputType = "text";
  }
  reset() {
    this.resetcode = '';
  }

  hidelockPassword() {
    this.showlockPassword = true;
    this.inputType = "password";
  }
}
