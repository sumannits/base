import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { FirstRunPage } from '../pages';
import { Broadcaster } from '../providers/eventEmitter';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';

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

  @ViewChild(Nav) nav: Nav;

  withoutLoginPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: 'HomePage', index: 0, icon: 'home' },
    { title: 'Tutorial', name: 'TutorialPage', component: 'TutorialPage', index: 1, icon: 'hammer' },
    { title: 'Welcome', name: 'WelcomePage', component: 'WelcomePage', index: 2, icon: 'information-circle' },
    { title: 'Login', name: 'LoginPage', component: 'LoginPage', index: 3, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: 'SignupPage', index: 4, icon: 'person-add' },
    { title: 'Support', name: 'TutorialPage', component: 'TutorialPage', index: 5, icon: 'help' }
   
  ];

  withLoginPages: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: 'HomePage', index: 0, icon: 'home' },
    { title: 'Edit Profile', name: 'Edit Profile', component: 'EditProfilePage', index: 1, icon: 'person' },
    { title: 'Settings', name: 'SettingsPage', component: 'SettingsPage', index: 2, icon: 'settings' },
    { title: 'Order List', name: 'OrderListPage', component: 'OrderListPage', index: 3, icon: 'reorder' },
    { title: 'Notification', name: 'Notification', component: 'NotificationPage', index: 4, icon: 'notifications' },    
    { title: 'Share', name: 'Share', component: SpeakerListPage, index: 5, icon: 'share-alt' },
    { title: 'Verification', name: 'VerificationPage', component: 'VerificationPage', index: 7, icon: 'checkmark-circle' },
    { title: 'MobileNo. Verification', name: 'MobileVerificationPage', component: 'MobileVerificationPage', index: 8, icon: 'checkmark-circle' },
    { title: 'Logout', name: 'LogoutPage', component: 'LoginPage', index: 6, icon: 'log-out' }

  ];

  withLoginPagestype: PageInterface[] = [
    { title: 'Home', name: 'HomePage', component: 'HomePage', index: 0, icon: 'home' },
    { title: 'Edit Profile', name: 'Edit Profile', component: 'EditProfilePage', index: 1, icon: 'person' },
    { title: 'MyOrderPage', name: 'MyOrderPage', component: 'MyOrderPage', index: 8, icon: 'reorder' },
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

  constructor(private translate: TranslateService, platform: Platform, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen,
  private broadCaster:Broadcaster) {
     let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      this.isloggedin = true;
      this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      console.log("LOGUOOOOOOO",this.loguserDet);
      if (this.loguserDet.first_name) {
        this.username = this.loguserDet.first_name;
        this.rootPage="HomePage";
      }
    } else {
      //this.profile_image = 'assets/img/default.jpeg';
      this.username = '';
      this.isloggedin = false;
    }
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.nav.setRoot('WelcomePage');
      this.rootPage="HomePage";
    });
    this.initTranslate(); 
    // this.broadCaster.on('userLoggedIn').subscribe((res)=>{
    //   this.isloggedin = true;
    //   this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
    // })
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
       
       console.log("USERINFOOOOO",this.loguser.type);
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
}
