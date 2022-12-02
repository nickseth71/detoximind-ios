import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CustomloaderService } from '../services/customloader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  showPassword: any = true;
  inputType: String = "password";

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: CustomloaderService
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.showLoader();
    let all_data_login = {
      username: this.credentials.value.email,
      password: this.credentials.value.password
    }
    this.authenticationService.login(all_data_login).subscribe(
      async (res) => {
        await this.loadingController.hideLoader(loading);
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      async (err) => {
        await this.loadingController.hideLoader(loading);
        if (err.error.code === "invalid_username") {
          this.presentDataAlert("User Name is not correct.");
        } else if (err.error.code === "incorrect_password") {
          this.presentDataAlert("Password is not correct.");
        } else {
          this.presentDataAlert(err.error.message);
        }
      }
    );
  }

  async presentDataAlert(errorMessage) {
    const alert = await this.alertController.create({
      header: 'Login failed',
      message: errorMessage,
      buttons: ['OK'],
    });

    await alert.present();
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
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

  // ngAfterContentInit()  {
  //   this.menuCtrl.enable(false);
  //   this.menuCtrl.swipeGesture(false);
  // }
  // ngAfterViewInit() {
  //   this.menuCtrl.enable(false);
  //   this.menuCtrl.swipeGesture(false);
  // }
  // ngOnDestroy() {
  //   this.menuCtrl.enable(true);
  //   this.menuCtrl.swipeGesture(true);
  // }

}