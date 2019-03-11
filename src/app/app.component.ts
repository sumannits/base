import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, AlertController } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { AppRate } from '@ionic-native/app-rate';
import { FirstRunPage } from '../pages';
import { Broadcaster } from '../providers/eventEmitter';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Api, ResponseMessage } from '../providers';
import { Facebook } from '@ionic-native/facebook';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { loadavg } from 'os';
import { concat } from 'rxjs/observable/concat';
import * as _ from 'lodash';
//import { FCM } from '@ionic-native/fcm';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  //tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
  // template: `<ion-menu [content]="content">
  //   <ion-header>
  //     <ion-toolbar>
  //       <ion-title>Pages</ion-title>
  //     </ion-toolbar>
  //   </ion-header>

  //   <ion-content>
  //     <ion-list>
  //       <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
  //         {{p.title}}
  //       </button>
  //     </ion-list>
  //   </ion-content>

  // </ion-menu>
  // <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;
  public username: string = '';
  public profile_image: string = '';
  public isloggedin: boolean = false;
  public loguser: any;
  public loguserDet: any;
  public istype: any;
  public firstname: any;
  public lastname: any;
  public chatCntlist = [];
  token: any;
  intervalVar: any;


  @ViewChild(Nav) nav: Nav;

  withoutLoginPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: 'HomePage', index: 0, icon: 'home' },
    /*{ title: 'Tutorial', name: 'TutorialPage', component: 'TutorialPage', index: 1, icon: 'hammer' },
    { title: 'Welcome', name: 'WelcomePage', component: 'WelcomePage', index: 2, icon: 'information-circle' },*/
    { title: 'Login', name: 'LoginPage', component: 'LoginPage', index: 3, icon: 'log-in' },
    { title: 'Login With Phone', name: 'LoginPhonePage', component: 'LoginPhonePage', index: 4, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: 'SignupPage', index: 5, icon: 'person-add' },
    //{ title: 'Support', name: 'TutorialPage', component: 'TutorialPage', index: 6, icon: 'help' }

  ];

  withLoginPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: 'HomePage', index: 0, icon: 'home' },
    { title: 'Edit Profile', name: 'Edit Profile', component: 'EditProfilePage', index: 1, icon: 'person' },
    { title: 'Settings', name: 'SettingsPage', component: 'SettingsPage', index: 2, icon: 'settings' },
    { title: 'Order List', name: 'OrderListPage', component: 'OrderListPage', index: 3, icon: 'reorder' },
    //{ title: 'Notification', name: 'Notification', component: 'NotificationPage', index: 4, icon: 'notifications' },    
    //{ title: 'Share', name: 'Share', component: SpeakerListPage, index: 5, icon: 'share-alt' },
    { title: 'Mobile Verification', name: 'MobileVerificationPage', component: 'MobileVerificationPage', index: 8, icon: 'checkmark-circle' },
    { title: 'Chat', name: 'ChatlistPage', component: 'ChatlistPage', index: 9, icon: 'chatbubbles' },
    { title: 'Logout', name: 'LogoutPage', component: 'HomePage', index: 6, icon: 'log-out' }

  ];

  withLoginPagestype: PageInterface[] = [
    { title: 'Edit Profile', name: 'Edit Profile', component: 'EditProfilePage', index: 1, icon: 'person' },
    { title: 'Master List', name: 'Master List', component: 'MasterlistPage', index: 10, icon: 'reorder' },
    { title: 'My Assign Order', name: 'My Assign Order', component: 'MyOrderPage', index: 2, icon: 'reorder' },
    { title: 'My Progress Order', name: 'My Progress Order', component: 'RiderPackedorderPage', index: 3, icon: 'reorder' },
    { title: 'My Complete Order', name: 'My Complete Order', component: 'RiderComorderPage', index: 4, icon: 'reorder' },
    { title: 'Chat', name: 'ChatlistPage', component: 'ChatlistPage', index: 9, icon: 'chatbubbles' },
    { title: 'Logout', name: 'LogoutPage', component: 'HomePage', index: 6, icon: 'log-out' }
  ];

  // pages: PageInterface[] = [
  //   { title: 'Tutorial', component: 'TutorialPage' },
  //   { title: 'Welcome', component: 'WelcomePage' },
  //   //{ title: 'Tabs', component: 'TabsPage' },
  //   //{ title: 'Cards', component: 'CardsPage' },
  //   //{ title: 'Content', component: 'ContentPage' },
  //   { title: 'Login', component: 'LoginPage' },
  //   { title: 'Signup', component: 'SignupPage' },
  //   { title: 'Master Detail', component: 'ListMasterPage' },
  //   { title: 'Menu', component: 'MenuPage' },
  //   { title: 'Settings', component: 'SettingsPage' },
  //   { title: 'Search', component: 'SearchPage' }
  // ]

  public constructor(
    public translate: TranslateService,
    public platform: Platform,
    public config: Config,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    public serviceApi: Api,
    public push: Push,
    public fb: Facebook,
    public broadCaster: Broadcaster,
    public loadingCtrl: LoadingController,
    //public fcm: FCM,
  ) {

    //console.log('navParam', this.navParam);
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      this.isloggedin = true;
      this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      if (this.loguserDet.first_name && this.loguserDet.user_type == 1) {
        this.istype = 1;
        this.username = this.loguserDet.first_name;
        this.rootPage = "HomePage";
      }
      else if (this.loguserDet.first_name && this.loguserDet.user_type == 0) {
        this.istype = 0;
        this.username = this.loguserDet.first_name;
        this.rootPage = "MyOrderPage";

      }
    } else {
      //this.profile_image = 'assets/img/default.jpeg';
      this.username = '';
      this.isloggedin = false;
    }
    platform.ready().then(() => {

      //this.initFCMPushNotifcation();

      this.initPushNotification();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (localStorage.getItem('userPrfDet')) {
        this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
        //this.nav.setRoot('WelcomePage');
        if (this.loguserDet.user_type == 0) {
          this.rootPage = "MyOrderPage";
        }
        // localStorage.clear();
      }
      else {
        this.rootPage = "HomePage";
      }

    });
    this.initTranslate();

    if (this.token == "" || this.token == null || !this.token) {
      this.intervalVar = setInterval(() => {
        //this.initPushNotification();
        // console.log('token in c1',this.token)
      }, 1000);
    }
    else{
      clearInterval(this.intervalVar);
    }

  }


  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  // initFCMPushNotifcation() {
  //   this.fcm.getToken().then(token => {
  //     localStorage.setItem('DEVICETOKEN', token);
  //     this.token = localStorage.getItem('DEVICETOKEN');
  //     console.log('token', this.token);
  //   });

  //   this.fcm.onNotification().subscribe(data => {
  //     if (data.wasTapped) {
  //       console.log('data', data)
  //       console.log('background')
  //             //if user NOT using app and push notification comes
  //             //TODO: Your logic on click of push notification directly
  //             if (data.additionalData.type == 'complete_delivery') {
  //               this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
  //             } else if (data.additionalData.type == 'start_journey') {
  //               this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
  //             } else if (data.additionalData.type == 'assign_order') {
  //               this.nav.setRoot("MyOrderPage");
  //             } else if (data.additionalData.type == 'chat_notification') {
  //               this.nav.setRoot("ChatlistPage");
  //             } else {
      
  //             }
  //       //Notification was received on device tray and tapped by the user.
  //     } else {
  //       console.log('data1', data)
  //       //Notification was received in foreground. Maybe the user needs to be notified.
  //       let confirmAlert = this.alertCtrl.create({
  //                 title: data.title,
  //                 message: data.message,
  //                 buttons: [{
  //                   text: 'Ignore',
  //                   role: 'cancel'
  //                 }, {
  //                   text: 'View',
  //                   handler: () => {
  //                     //TODO: Your logic here
  //                     if (data.additionalData.type == 'complete_delivery') {
  //                       this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
  //                     } else if (data.additionalData.type == 'start_journey') {
  //                       this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
  //                     } else if (data.additionalData.type == 'assign_order') {
  //                       this.nav.setRoot("MyOrderPage");
  //                     } else if (data.additionalData.type == 'chat_notification') {
  //                       this.nav.setRoot("ChatlistPage");
  //                     }
  //                   }
  //                 }]
  //               });
  //               confirmAlert.present();
  //             }
  //   });

  // }

  
  initPushNotification() {
    console.log('initPushNotification')
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    // to check if we have permission
    this.push.hasPermission().then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
    });

    const options: PushOptions = {
      android: {
        senderID: '350229533440',
        //icon: "assets/img/appicon.png",
        "icon": "drawable-ldpi-icon",
        iconColor: "#00465a"

      },

      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    console.log('initPushNotification2',pushObject)
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('initPushNotification3')
      console.log('Device registered', registration.registrationId);
      //localStorage.setItem('DEVICETOKEN', JSON.stringify(registration.registrationId));
      localStorage.setItem('DEVICETOKEN', registration.registrationId);
      this.token = localStorage.getItem('DEVICETOKEN');
      console.log('token',this.token);
    });

    pushObject.on('notification').subscribe((data: any) => {

      let activeVC: any = localStorage.getItem('currentActivePage');
      //console.log('message -> ' + data);
      //console.log('message -> ' + data);notification
      //if user using app and push notification comes
      let pushJsonObj = JSON.stringify(data);
      if (data.additionalData.foreground) {
        console.log('foreground');

        if ((activeVC != 'ChatdetailsPage' && activeVC != 'ChatlistPage'))
        {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: data.title,
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              //TODO: Your logic here
              if (data.additionalData.type == 'complete_delivery') {
                this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
              } else if (data.additionalData.type == 'start_journey') {
                this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
              } else if (data.additionalData.type == 'assign_order') {
                this.nav.setRoot("MyOrderPage");
              } else if (data.additionalData.type == 'chat_notification') {
                this.nav.setRoot("ChatlistPage");
              }
            }
          }]
        });
        confirmAlert.present();
      }
      }
      else {
        console.log('background')
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        if (data.additionalData.type == 'complete_delivery') {
          this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
        } else if (data.additionalData.type == 'start_journey') {
          this.nav.setRoot("OrderDetailPage", { 'order_id': data.order_id });
        } else if (data.additionalData.type == 'assign_order') {
          this.nav.setRoot("MyOrderPage");
        } else if (data.additionalData.type == 'chat_notification') {
          this.nav.setRoot("ChatlistPage");
        } else {

        }

      }

    });


  }

  menuOpened() {
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      this.isloggedin = true;
      this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      if (this.loguserDet.user_type == 1) {
        this.istype = 1;
      } else if (this.loguserDet.user_type == 0) {
        this.istype = 0;
      }
      // if(this.loguserDet.image){
      //   this.profile_image = this.loguserDet.image;
      // }else{
      //   this.profile_image = 'assets/img/default.jpeg';
      // }
      //this.profile_image = 'assets/img/default.jpeg';
      if (this.loguserDet.first_name) {
        this.username = this.loguserDet.first_name;
      }
      // console.log('getMyUnreadChat function');
      // this.getMyUnreadChat();
    } else {
      //this.profile_image = 'assets/img/default.jpeg';
      this.username = '';
      this.isloggedin = false;
    }
    //console.log(this.isloggedin);
  }
  logintype() {
    this.loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    if (this.loguser) {
      this.firstname = this.loguser.first_name;
      this.lastname = this.loguser.last_name;

      //console.log("USERINFOOOOO",this.loguser.type);
      if (this.loguser.user_type == 1) {
        this.istype = 1;
      } else if (this.loguser.user_type == 0) {
        this.istype = 0;
      }
    }

  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //console.log(page);
    if (page.name == 'LogoutPage') {
      // localStorage.clear();
      this.isloggedin = false;
      this.fb.logout();
      localStorage.removeItem("isUserLogedin");
      localStorage.removeItem("userPrfDet");
      localStorage.removeItem("phoneLoginUserId");
      this.nav.setRoot(page.component);
    } else {
      this.nav.setRoot(page.component);
    }

  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];
    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  // getMyUnreadChat() {
  //   // console.log('this.loguserDet.user_type',this.loguserDet.user_type)
  //   this.serviceApi.postData({ "user_id": this.loguserDet.id, "type": this.loguserDet.user_type }, 'users/get_mychat_list').then((result: any) => {
  //     if (result.Ack == 1) {

  //       if (result.room_list.length > 0) {
  //         result.room_list.forEach(element => {
  //           if (element.id > 0) {
  //             this.getUnreadMsgCnt(element.id, element);

  //             //this.myRoomIdlist.push(element.id);
  //           }
  //         });
  //         let activeVC: any = localStorage.getItem('currentActivePage');
  //         setTimeout(() => {
  //           // somecode
  //           let chatCntlistUnique = _.uniqBy(this.chatCntlist, 'id');
  //           this.chatCntlist = chatCntlistUnique;
  //           //console.log('this.chatCntlist',this.chatCntlist);
  //           if (this.chatCntlist.length > 0) {
  //             this.chatCntlist.forEach(element => {
  //               if ((activeVC != 'ChatdetailsPage' && activeVC != 'ChatlistPage') && !element.is_push_send && element.message.text != '') {
  //                 // chat push notification
  //                 this.serviceApi.postData({ "to_user_id": element.to_user_id, "from_user_id": element.from_user_id, "message": element.message.text }, 'users/chat_push_notification').then((result: any) => {
  //                   if (result.Ack == 1) {
  //                     this.db.collection('livechat').doc(element.id).update({ is_push_send: true }).then(res => {

  //                     }).catch(err => {

  //                     });
  //                   }
  //                 }, (err) => {

  //                 });
  //               }
  //             });
  //           }
  //         }, 5000);

  //       }
  //     }
  //   }, (err) => {

  //   });
  // }

  public getUnreadMsgCnt(nRoomId: any, userData: any) {
    //let activeVC = this.nav.getActive().component.name;
    let activeVC: any = localStorage.getItem('currentActivePage');
    //let childNav = this.nav.getActiveChildNavs()[0];
    console.log('activeVC', activeVC);
    // console.log('nRoomId',nRoomId)
    this.chatCntlist = [];
    const messages11 = this.db.collection('livechat', ref => {
      return ref.where('room_id', '==', nRoomId).where("to_is_read", "==", false).where("to_user_id", "==", this.loguserDet.id).orderBy('cdate', 'desc').limit(1);
    }).snapshotChanges().map(actions => {
      return actions.map(action => {
        const data1 = action.payload.doc.data();
        const id = action.payload.doc.id;
        //console.log(data1);
        return { id, ...data1 };
      });
    });

    messages11.subscribe(data => {
      if (data.length > 0) {
        let msgData: any = data[0];
        this.chatCntlist.push(msgData);

        //console.log('data',msgData)
        // console.log('chatCntlist',this.chatCntlist.length);
      }
    });

  }
}
