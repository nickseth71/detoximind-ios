import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MustMatch } from '../helper/must-match.validator';
import { AuthenticationService } from '../services/authentication.service';
import { CustomloaderService } from '../services/customloader.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

export class SignupPage implements OnInit {
  credentials: FormGroup;
  showPassword: any = true;
  inputType: String = "password";
  token: any;
  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private loadingController: CustomloaderService,
    private authService: AuthenticationService,
    public httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: MustMatch('password', 'confirm_password')
    }

    );

    this.authService.getAdminToken().subscribe(item => {
      this.token = item['data']['token'];
    })

  }

  async signup() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
    const loading = await this.loadingController.showLoader();
    this.httpClient.post(environment.wordpress.api_url + "wp-json/wp/v2/users", JSON.stringify(this.credentials.value), httpOptions).subscribe(async item => {
      await this.loadingController.hideLoader(loading);
      this.presentDataAlert("User Resistered Successfully.");
    }, async error => {
      if (error.error.message) {
        await this.loadingController.hideLoader(loading);
        this.presentDataAlert(error.error.message);
      }
    })
  }
  async presentDataAlert(errorMessage) {
    const alert = await this.alertController.create({
      header: 'Sign Up ',
      message: errorMessage,
      buttons: ['OK'],
    });
    await alert.present();
  }

  get email() {
    return this.credentials.get('email');
  }

  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }
  get confirm_password() {
    return this.credentials.get('confirm_password');
  }
  hidePassword() {
    // event.stopPropagation();
    this.showPassword = true;
    this.inputType = "password";
  }
  showinputPassword() {
    this.showPassword = false;
    this.inputType = "text";
  }
}
