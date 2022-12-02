import { Component, OnInit, ViewChild } from '@angular/core';
import { AskmebuddyService } from '../services/askmebuddy.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { CustomloaderService } from '../services/customloader.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-askmebuddy',
  templateUrl: './askmebuddy.page.html',
  styleUrls: ['./askmebuddy.page.scss'],
})
export class AskmebuddyPage implements OnInit {
  @ViewChild('content', { static: false }) content: IonContent;

  ionicForm: FormGroup;
  email: String;
  adminToken: any;
  questionMsg: any;
  loader: any = false;
  all_data_rec: any;
  constructor(
    private fb: FormBuilder,
    private askbuddyService: AskmebuddyService,
    private authenticationService: AuthenticationService,
    public loadingController: CustomloaderService
  ) {
    this.fetchAnswerData();
    this.authenticationService.getUserData().then(item => {
      this.email = JSON.parse(item['value']).email;
    })

    this.authenticationService.getAdminToken().subscribe(item => {
      this.adminToken = item['data']['token'];
    })
    // this.adminToken = environment.admin_token;
    this.ionicForm = this.fb.group({
      questionInput: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit() {

  }

  getContent() {
    return document.querySelector('ion-content');
  }

  scrollToBottom() {
    this.getContent().scrollToBottom();
  }


  async fetchAnswerData() {
    const loading = await this.loadingController.showLoader()
    this.askbuddyService.askQuestionAnswer(this.email).subscribe(async item => {
      this.all_data_rec = await item;
      setTimeout(() => {
        this.scrollToBottom();
      }, 1000)
      await this.loadingController.hideLoader(loading);
    }, async error => {
      console.log(error);
      await this.loadingController.hideLoader(loading);
    })
  }


  submitForm() {
    let data = { email: this.email, user_message: this.ionicForm.value.questionInput };
    this.loader = true;
    this.askbuddyService.askQuestion(data, this.adminToken).subscribe(item => {
      this.questionMsg = '';
      this.loader = false;
      setTimeout(() => {
        this.fetchAnswerData();
      }, 1000)
    })
  }
  doRefresh(event) {
    this.askbuddyService.askQuestionAnswer(this.email).subscribe(async item => {
      this.all_data_rec = item;
      event.target.complete();
    }, async error => {
      console.log(error);
      event.target.complete();
    })


  }

}
