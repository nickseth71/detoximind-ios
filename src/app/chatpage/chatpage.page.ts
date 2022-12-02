import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './../services/authentication.service';
import { CustomloaderService } from '../services/customloader.service';
import { ActivatedRoute } from '@angular/router';
import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  NgZone,
  EventEmitter,
  Output
} from "@angular/core";
import { GestureController } from "@ionic/angular";
import { element } from 'protractor';
@Directive({
  selector: "[long-press]"
})
@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.page.html',
  styleUrls: ['./chatpage.page.scss'],
})
export class ChatpagePage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content: IonContent;
  message = '';
  currentUser = '';
  messages: any;
  selected = [];
  private itemDoc: AngularFirestoreCollection<any>;
  item: Observable<any[]>;
  user_Data: any;
  group_collection_id: any;
  selected_data: any;
  selected_event: any;
  selcted_dynamic: boolean = false;
  data_rep: any;
  @Output() press = new EventEmitter();
  @Input("delay") delay = 1000;
  action: any; //not stacking actions
  private longPressActive = false;
  constructor(
    private toast: ToastController,
    private db: AngularFirestore,
    private authService: AuthenticationService,
    public loadingController: CustomloaderService,
    public route: ActivatedRoute,
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private zone: NgZone,
    public alertController: AlertController
  ) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.group_collection_id = params['id'];
    });
    this.itemDoc = this.db.collection<any>(`${this.group_collection_id}`, ref => ref.orderBy('createdAt'));
    this.authService.getUserData().then(item => {
      this.user_Data = JSON.parse(item.value);
      this.currentUser = this.user_Data.displayName;
    })
    this.getMessage();
  }
  ngAfterViewInit() {
    this.loadLongPressOnElement();
  }
  sendMessage() {
    let myDate = new Date();
    let myDateTemp = new Date(myDate);
    if (this.currentUser != '') {
      let data = { user: this.currentUser, msg: this.message, msg_status: true, createdAt: myDateTemp, };
      this.itemDoc.add(data).then(itm => {
        // this.getMessage();
        this.message = '';
      })
    } else {
      console.log("login first")
    }
  }
  async getMessage() {
    const loading = await this.loadingController.showLoader();
    this.item = await this.itemDoc.valueChanges();
    // this.item.subscribe(async item => {
    //   this.messages = await item;
    //   setTimeout(() => { this.content.scrollToBottom() }, 0)
    //   await this.loadingController.hideLoader(loading);
    // }, async error => {
    //   await this.loadingController.hideLoader(loading);
    // })
    this.itemDoc.snapshotChanges().subscribe(async items => {
      this.messages = items.map(item => {
        return { doc_id: item.payload.doc.ref.id, data: item.payload.doc.data() }
      });
      setTimeout(() => { this.content.scrollToBottom() }, 0)
      await this.loadingController.hideLoader(loading);
    }, async error => {
      await this.loadingController.hideLoader(loading);
    })
  }
  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        this.longPressActive = true;
        this.longPressAction();
      },
      onEnd: ev => {
        this.longPressActive = false;
      }
    });
    gesture.enable(true);
  }
  private longPressAction() {
    if (this.action) {
      clearInterval(this.action);
    }
    this.action = setTimeout(() => {
      this.zone.run(() => {
        this.selcted_dynamic = !this.selcted_dynamic;
        if (this.longPressActive === true) {
          this.longPressActive = false;
          if (this.selected_data != undefined) {
            document.querySelectorAll(".other-message").forEach(element => {
              element.classList.remove("active_select");
            })
            if (this.selected_event.target.classList.contains("other-message")) {
              this.selected_event.target.classList.add("active_select");
              this.presentAlert(this.selected_data);
            }
          }
          this.press.emit();
        }
      });
    }, this.delay);
  }
  tapEvent(item: any, event: any) {
    this.selected_data = '';
    this.selected_data = item;
    this.selected_event = event;
  }
  async presentAlert(doc_data_all: any) {
    let i = 0;
    let j = 0;
    if (i == 0) {
      let report_coll = this.db.collection<any>(`report_collection`, ref => ref.orderBy('createdAt'));
      report_coll.valueChanges().subscribe(async item => {
        let find_data = item.some(itm => {
          if (itm.user === doc_data_all.data.user && itm.msg_doc_id === doc_data_all.doc_id) {
            return item;
          }
        })
        if (!find_data) {
          const alert = await this.alertController.create({
            header: 'Report ' + doc_data_all.data.user + '?',
            message: 'This message will be forwarded to Detoximind.This contact will not be notified.',
            cssClass: 'custom-alert',
            inputs: [
              {
                label: 'Block Contact',
                id: 'checkbox',
                name: 'checked_value',
                type: 'checkbox',
                checked: false,
                value: "true"
              }
            ],
            buttons: [
              {
                text: 'cancel',
                role: "cancel",
                handler: () => {
                  this.selected_data = '';
                  this.selected_event = '';
                  console.log("cancel");
                  document.querySelectorAll(".other-message").forEach(element => {
                    element.classList.remove("active_select");
                  })
                }
              },
              {
                text: 'Block',
                role: "save",
                handler: data => {
                  if (data.length > 0 && data[0] == 'true') {
                    let myDate = new Date();
                    let myDateTemp = new Date(myDate);
                    let data = { user: doc_data_all.data.user, msg_doc_id: doc_data_all.doc_id, group_id: this.group_collection_id, createdAt: myDateTemp, };
                    report_coll.add(data);
                  }
                  this.selected_data = '';
                  this.selected_event = '';
                  document.querySelectorAll(".other-message").forEach(element => {
                    element.classList.remove("active_select");
                  })
                }
              }
            ],
            backdropDismiss: false
          })
          alert.present();
          i++;
        } else {
          if (j == 0) {
            j++;
            this.secondAlert();
          }
        }
      })
    }
  }
  async secondAlert() {
    const alert = await this.alertController.create({
      header: 'Report Alert',
      message: 'Your Report have already been submitted.',
      buttons: [
        'ok'
      ]
    });
    alert.present();
    document.querySelectorAll(".other-message").forEach(element => {
      element.classList.remove("active_select");
    });
  }
}