import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './../services/authentication.service';
import { CustomloaderService } from '../services/customloader.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  private itemDoc: AngularFirestoreCollection<any>;
  item: Observable<any[]>;
  user_Data: any;
  currentUser: any;
  group_data: any;
  user_group_arr: any = [];
  constructor(
    private toast: ToastController,
    private db: AngularFirestore,
    private authService: AuthenticationService,
    public loadingController: CustomloaderService,
    public alertController: AlertController,
    public router: Router,
    public act_route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.act_route.params.subscribe(itm => {
      this.authService.getUserData().then(item => {
        this.user_Data = JSON.parse(item.value);
        this.currentUser = this.user_Data.displayName;
      })
      this.getMessage();
    });
  }
  async getMessage() {
    const loading = await this.loadingController.showLoader();
    this.itemDoc = await this.db.collection<any>('chat_group_list');
    let i = 0;
    this.itemDoc.snapshotChanges().subscribe(async (items) => {
      if (i == 0) {
        this.group_data = items.map(item => {
          return { doc_id: item.payload.doc.ref.id, data: item.payload.doc.data() }
        });
        await this.loadingController.hideLoader(loading);
        i++;
      }
    }
      , async error => {
        await this.loadingController.hideLoader(loading);
      })
  }
  async presentAlert(doc_data_all: any) {
    if (doc_data_all.data.joined_use != undefined && doc_data_all.data.joined_use.length > 0) {
      const result = doc_data_all.data.joined_use.filter(item => item.user == this.currentUser);
      if (!result[0].status) {
        const alert22 = await this.alertController.create({
          header: 'Notice',
          message: 'Sorry you are not eligible to enter this chat group.',
          cssClass: 'custom-alert',
          buttons: [
            'Ok'
          ]
        })
        alert22.present();
        return;
      }
    }
    if (this.user_Data != null) {
      if (doc_data_all.data.group_id != 'detoxi_chat_group_1') {
        this.user_group_arr = doc_data_all.data.joined_use;
        const alert = await this.alertController.create({
          header: 'Group Join',
          cssClass: 'custom-alert',
          inputs: [
            {
              type: 'text',
              placeholder: 'Enter Group Join Code',
              name: 'join_code'
            }
          ],
          buttons: [
            'cancel',
            {
              text: 'Join',
              handler: async data => {
                let loading = await this.loadingController.showLoader();
                if (data.join_code == '') {
                  await this.loadingController.hideLoader(loading);
                  this.presentAlertMessage("Please Enter Group Joining Code");
                } else {
                  if (data.join_code === doc_data_all.data.group_code) {
                    let gp_id = doc_data_all.data.group_id;
                    if (doc_data_all.data.joined_use != undefined && doc_data_all.data.joined_use.length > 0) {
                      this.user_group_arr = doc_data_all.data.joined_use;
                      const found = this.user_group_arr.some(el => el.user === this.currentUser);
                      if (found) {
                        this.router.navigate([`/chatpage`, gp_id]);
                      } else {
                        let data_set = {
                          user: this.currentUser,
                          status: true
                        }
                        this.user_group_arr.push(data_set);
                        this.db.doc('chat_group_list' + '/' + doc_data_all.doc_id).update({ joined_use: this.user_group_arr })
                        await this.loadingController.hideLoader(loading);
                        this.router.navigate([`/chatpage`, gp_id]);
                      }
                    } else {
                      let data_set = {
                        user: this.currentUser,
                        status: true
                      }
                      this.user_group_arr = [];
                      this.user_group_arr.push(data_set);
                      this.db.doc('chat_group_list' + '/' + doc_data_all.doc_id).update({ joined_use: this.user_group_arr })
                      await this.loadingController.hideLoader(loading);
                      this.router.navigate([`/chatpage`, gp_id]);
                    }
                  } else {
                    await this.loadingController.hideLoader(loading);
                    this.presentAlertMessage("Please Enter Valid Joining Code");
                  }
                }
              }
            }
          ]
        });
        if (this.user_group_arr != undefined && this.user_group_arr.length > 0) {
          const found = this.user_group_arr.some(el => el.user === this.currentUser);
          if (found) {
            let gp_id = doc_data_all.data.group_id;
            this.router.navigate([`/chatpage`, gp_id]);
          } else {
            alert.present();
          }
        } else {
          alert.present();
        }
      } else {
        let gp_id = doc_data_all.data.group_id;
        if (doc_data_all.data.joined_use != undefined && doc_data_all.data.joined_use.length > 0) {
          this.user_group_arr = doc_data_all.data.joined_use;
          const found = this.user_group_arr.some(el => el.user === this.currentUser);
          if (found) {
            this.router.navigate([`/chatpage`, gp_id]);
          } else {
            let data_set = {
              user: this.currentUser,
              status: true
            }
            this.user_group_arr.push(data_set);
            this.db.doc('chat_group_list' + '/' + doc_data_all.doc_id).update({ joined_use: this.user_group_arr })
            this.router.navigate([`/chatpage`, gp_id]);
          }
        } else {
          let data_set = {
            user: this.currentUser,
            status: true
          }
          this.user_group_arr.push(data_set);
          this.db.doc('chat_group_list' + '/' + doc_data_all.doc_id).update({ joined_use: this.user_group_arr })
          this.router.navigate([`/chatpage`, gp_id]);
        }
      }
    }
  }
  async presentAlertMessage(meg) {
    const alert = await this.alertController.create({
      header: 'Error Message :-',
      message: meg,
      buttons: ['Ok']
    });
    await alert.present();
  }
}