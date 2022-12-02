import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserupdateServiceService } from '../services/userupdate-service.service';
import { MustMatch } from '../helper/must-match.validator';
import { CustomloaderService } from '../services/customloader.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  images: any;
  updateForm: FormGroup;
  changeData: FormGroup;
  user_Data: any;
  edit_form: boolean = false;
  change_form: boolean = false;
  profile_view: boolean = true;

  email: string;
  firstname: string;
  lastname: string;
  imageData: any;
  adminToke: any;
  cust_id: any;
  constructor(
    public router: Router,
    private authService: AuthenticationService,
    private userupdateService: UserupdateServiceService,
    public toastController: ToastController,
    public loader_cust: CustomloaderService,
    private fb: FormBuilder,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.updateForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      first_name: [''],
      last_name: ['']
    });

    this.changeData = this.fb.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: MustMatch('new_password', 'confirm_password')
    }
    );
    this.authService.getUserData().then(item => {
      this.user_Data = JSON.parse(item.value);
      // console.log(item.value)
      // this.userupdateService.getUserData(this.user_Data.id).subscribe(item => {
      this.email = this.user_Data.email;
      this.firstname = this.user_Data.firstName;
      this.lastname = this.user_Data.lastName;
      this.cust_id = this.user_Data.id;
      // });
    });

  }


  editForm() {
    this.change_form = false;
    this.profile_view = false;
    this.edit_form = true;
  }

  changeForm() {
    this.edit_form = false;
    this.profile_view = false;
    this.change_form = true;
  }
  async chengePassword() {
    const loading = await this.loader_cust.showLoader();
    this.authService.jounalLogin({ username: this.email, password: this.changeData.value.old_password }).subscribe(item => {
      let userData = { password: this.changeData.value.new_password };
      console.log(this.changeData.value.old_password);
      this.userupdateService.updateUserProfile(this.user_Data.id, userData).subscribe(async item => {
        console.log("item=====>", item);
        await this.loader_cust.hideLoader(loading);
        this.changeData.reset();
        this.presentToast("Change User password Successfully.");
        this.closeEditor();
      }, async error => {
        await this.loader_cust.hideLoader(loading);
        console.log(error)
      });

    }, async error => {
      await this.loader_cust.hideLoader(loading);
      this.presentToast("old password is not correct.");
    })
  }

  async UpadateUser() {
    const loading = await this.loader_cust.showLoader()
    this.userupdateService.updateUserProfile(this.user_Data.id, this.updateForm.value).subscribe(async item => {
      console.log("item=====>", item);
      await this.loader_cust.hideLoader(loading);
      this.presentToast("User Successfully Updated.");
      this.user_Data.email = item.email;
      this.user_Data.firstName = item.first_name;
      this.user_Data.lastName = item.last_name;
      this.authService.updateUserData(this.user_Data);
      this.closeEditor();
    }, async error => {
      await this.loader_cust.hideLoader(loading);
      console.log(error);
    })
  }

  closeEditor() {
    this.edit_form = false;
    this.profile_view = true;
    this.change_form = false;
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }


  get old_password() {
    return this.changeData.get('old_password');
  }
  get new_password() {
    return this.changeData.get('new_password');
  }
  get confirm_password() {
    return this.changeData.get('confirm_password');
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Are you sure?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'No',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'Yes',
          cssClass: 'alert-button-confirm',
          handler: (value: any) => {
            this.removeAccount(this.cust_id);
          }
        },
      ],
    });
    await alert.present();
  }

  removeAccount(id: any) {
    this.userupdateService.getAdminToken().subscribe(async token => {
      this.adminToke = token;
      this.userupdateService.deleteAccount({email:this.email,id:this.user_Data.id}, this.adminToke.data.token).subscribe(async item => {
        console.log(item);
        this.logout();
      })
    })
  }

}
