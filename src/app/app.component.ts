import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { AppRate } from '@ionic-native/app-rate';
import { FirstRunPage } from '../pages';
import { Broadcaster } from '../providers/eventEmitter';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Api, ResponseMessage } from '../providers';


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
  public istype:any;
  public firstname:any;
  public lastname:any;
  public chatCntlist = [];

  @ViewChild(Nav) nav: Nav;

  withoutLoginPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: 'HomePage', index: 0, icon: 'home' },
    { title: 'Tutorial', name: 'TutorialPage', component: 'TutorialPage', index: 1, icon: 'hammer' },
    { title: 'Welcome', name: 'WelcomePage', component: 'WelcomePage', index: 2, icon: 'information-circle' },
    { title: 'Login', name: 'LoginPage', component: 'LoginPage', index: 3, icon: 'log-in' },
    { title: 'Login With Phone', name: 'LoginPhonePage', component: 'LoginPhonePage', index: 4, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: 'SignupPage', index: 5, icon: 'person-add' },
    { title: 'Support', name: 'TutorialPage', component: 'TutorialPage', index: 6, icon: 'help' }
   
  ];

  withLoginPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: 'HomePage', index: 0, icon: 'home' },
    { title: 'Edit Profile', name: 'Edit Profile', component: 'EditProfilePage', index: 1, icon: 'person' },
    { title: 'Settings', name: 'SettingsPage', component: 'SettingsPage', index: 2, icon: 'settings' },
    { title: 'Order List', name: 'OrderListPage', component: 'OrderListPage', index: 3, icon: 'reorder' },
    //{ title: 'Notification', name: 'Notification', component: 'NotificationPage', index: 4, icon: 'notifications' },    
    { title: 'Share', name: 'Share', component: SpeakerListPage, index: 5, icon: 'share-alt' },
    { title: 'Mobile Verification', name: 'MobileVerificationPage', component: 'MobileVerificationPage', index: 8, icon: 'checkmark-circle' },
    { title: 'Chat', name: 'ChatlistPage', component: 'ChatlistPage', index: 9, icon: 'chatbubbles' },
    { title: 'Logout', name: 'LogoutPage', component: 'LoginPage', index: 6, icon: 'log-out' }

  ];

  withLoginPagestype: PageInterface[] = [
    { title: 'Edit Profile', name: 'Edit Profile', component: 'EditProfilePage', index: 1, icon: 'person' },
    { title: 'My Assign Order', name: 'My Assign Order', component: 'MyOrderPage', index: 2, icon: 'reorder' },
    { title: 'My Progress Order', name: 'My Progress Order', component: 'RiderPackedorderPage', index: 3, icon: 'reorder' },
    { title: 'My Complete Order', name: 'My Complete Order', component: 'RiderComorderPage', index: 4, icon: 'reorder' },
    { title: 'Chat', name: 'ChatlistPage', component: 'ChatlistPage', index: 9, icon: 'chatbubbles' },
    { title: 'Logout', name: 'LogoutPage', component: 'LoginPage', index: 6, icon: 'log-out' }
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

  constructor(private translate: TranslateService, platform: Platform, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen,public db: AngularFirestore,public serviceApi: Api,
  private broadCaster:Broadcaster) {
     let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      this.isloggedin = true;
      this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      if (this.loguserDet.first_name && this.loguserDet.user_type==1) {
        this.istype=1;
        this.username = this.loguserDet.first_name;
        this.rootPage="HomePage";
      }
      else if(this.loguserDet.first_name && this.loguserDet.user_type==0){
        this.istype=0;
        this.username = this.loguserDet.first_name;
        this.rootPage="MyOrderPage";

      }
    } else {
      //this.profile_image = 'assets/img/default.jpeg';
      this.username = '';
      this.isloggedin = false;
    }
    platform.ready().then(() => {
    // console.log = function(){};
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(localStorage.getItem('userPrfDet')){
        this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      //this.nav.setRoot('WelcomePage');
      if(this.loguserDet.user_type==0){
      this.rootPage="MyOrderPage";
      }
    }
      else{
        this.rootPage="HomePage";
      }
    
    });
    this.initTranslate(); 
    //firebase.initializeApp(configFirebase);
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

  menuOpened() {
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      this.isloggedin = true;
      this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      if(this.loguserDet.user_type==1){
        this.istype=1;
      }else if(this.loguserDet.user_type==0){
        this.istype=0;
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
      this.getMyUnreadChat();
    } else {
      //this.profile_image = 'assets/img/default.jpeg';
      this.username = '';
      this.isloggedin = false;
    }
    //console.log(this.isloggedin);
  }
  logintype(){
     this.loguser =  JSON.parse(localStorage.getItem('userPrfDet'));   
     if(this.loguser){
       this.firstname=this.loguser.first_name;
       this.lastname=this.loguser.last_name;
       
       //console.log("USERINFOOOOO",this.loguser.type);
     if(this.loguser.user_type==1){
       this.istype=1;
     }else if(this.loguser.user_type==0){
       this.istype=0;
     }
     }
   
   }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    //console.log(page);
    if (page.name == 'LogoutPage') {
      localStorage.clear();
      this.isloggedin = false;
      // this.nav.setRoot('LoginPage');
      localStorage.removeItem("isUserLogedin");
      localStorage.removeItem("userPrfDet");
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

  getMyUnreadChat(){
    this.serviceApi.postData({"user_id":this.loguserDet.id, "type":this.loguserDet.user_type},'users/get_mychat_list').then((result:any) => {
      if(result.Ack == 1){
        //console.log(result.room_list);
        if(result.room_list.length >0){
          result.room_list.forEach(element => {
            if(element.id >0){
              this.getUnreadMsgCnt(element.id, element);
              //this.myRoomIdlist.push(element.id);
            }
          });
        }
      }
    }, (err) => {
    
    }); 
  }

  public getUnreadMsgCnt(nRoomId:any, userData:any){
    //console.log(nRoomId);
    this.chatCntlist = [];
    const messages1 = this.db.collection('livechat', ref => { 
      return ref.where('room_id', '==', nRoomId).where("to_is_read", "==", false).where("to_user_id", "==", this.loguserDet.id);
    }).snapshotChanges().map(actions => { 
      return actions.map(action => { 
        const data1 = action.payload.doc.data();
        const id = action.payload.doc.id;
        //console.log(data1);
        return { id, ...data1 };
      });
    });

    messages1.subscribe(data => {  
      if(data.length>0){
        let msgData:any = data[0];
        this.chatCntlist.push(msgData); 
        //console.log(msgData);
      } 
    });
  }
}
