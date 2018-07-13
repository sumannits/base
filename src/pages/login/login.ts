import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController,NavParams } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Broadcaster } from '../../providers/eventEmitter';
import { HomePage } from '../home/home';
import { ProductlistPage } from '../productlist/productlist';
import {DetailsPage} from '../details/details';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
 
  // Our translated text strings
  private loginErrorString: string;
  private form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
public catId:any;
public prdId:any;
  constructor(
    public navCtrl: NavController,
    //private device: Device,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userService: Api,
    private fbuilder: FormBuilder,
    public translateService: TranslateService,
    private broadCastre:Broadcaster
  ) {

   
    this.form = fbuilder.group({
      'email': ['', Validators.compose([Validators.required,Validators.email])],
      'password': ['', Validators.compose([Validators.required])],
    });
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ionViewDidLoad() {
    console.log("Previousss",this.navCtrl.getPrevious());
    console.log("activeeeee",this.navCtrl.getActive());
    this.catId = this.navParams.get('catid');
    this.prdId = this.navParams.get('prd_id');
  
  }
  // Attempt to login in through our User service
  doLogin() {

    let CheckvalidEmail = this.email.value.toString();
    let isValidEmail = this.validateEmail(CheckvalidEmail);
    if (this.form.valid && isValidEmail) {
      let signinJsonData={
        "email": this.email.value.toString(),
        "password": this.password.value.toString(),
        //"deviceToken": this.device.uuid,
        //"deviceType": this.device.platform
      };
      this.userService.postData(signinJsonData,'users/appsignin').then((result:any) => {
        //console.log(result);
        if(result.Ack == 1){
          let userId= result.UserDetails.id
          localStorage.setItem('userPrfDet', JSON.stringify(result.UserDetails));
          localStorage.setItem('isUserLogedin', '1');
          if(localStorage.getItem('userPrfDet')){

        //     if (this.navCtrl.getPrevious().component.name=="LoginPage"){
        //       let alert = this.alertCtrl.create({
        //        title: 'Success',
        //        subTitle: 'Login Successful',
        //        buttons: ['Ok']
        //      });
        //      alert.present();
        //      this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
        //      this.navCtrl.setRoot('HomePage');
        //        }

        //        else if (this.navCtrl.getActive().component.name=="HomePage"){
        //         let alert = this.alertCtrl.create({
        //          title: 'Success',
        //          subTitle: 'Login Successful',
        //          buttons: ['Ok']
        //        });
        //        alert.present();
        //        this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
        //        this.navCtrl.setRoot('HomePage');
        //          }
  

        //    // let componentName =this.navCtrl.getPrevious().component;
        //  else if (this.navCtrl.getPrevious().component.name=="ProductlistPage"){
        //     //console.log("Previousss22222",this.navCtrl.getPrevious().component);
        //     let alert = this.alertCtrl.create({
        //      title: 'Success',
        //      subTitle: 'Login Successful',
        //      buttons: ['Ok']
        //    });
        //    alert.present();
        //    this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
        //     this.navCtrl.push('ProductlistPage',{'catid':this.catId});
        //      }
        //      else if (this.navCtrl.getPrevious().component.name=="DetailsPage"){
        //      // console.log("Previousss22222",this.navCtrl.getPrevious().component);
        //       let alert = this.alertCtrl.create({
        //        title: 'Success',
        //        subTitle: 'Login Successful',
        //        buttons: ['Ok']
        //      });
        //      alert.present();
        //      this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
        //      this.navCtrl.push('DetailsPage',{'prd_id':this.prdId});
        //        }
           
              
                this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
             this.navCtrl.setRoot('HomePage');
               
              }
          // let toast = this.toastCtrl.create({
          //   message: 'You have successfully login.',
          //   duration: 4000,
          //   position: 'top'
          // });
          // toast.present();
         
        }else{
          if(result.msg != ''){
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: result.msg ,
              buttons: ['Ok']
            });
            alert.present();
          }else{
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Wrong Email or Password.Please try again.' ,
              buttons: ['Ok']
            });
            alert.present();
          }
        }
      }, (err) => {
        // let alert = this.alertCtrl.create({
        //   title: 'Error!',
        //   subTitle: this.jsonErrMsg.messageData(err),
        //   buttons: ['Ok']
        // });
        // alert.present();
      });
    }else if(!isValidEmail){
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Please enter valid email',
        buttons: ['Ok']
      });
      alert.present();
    }else{
      let toast = this.toastCtrl.create({
        message: 'You enter wrong email and password',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  public validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public gotoSignupPage(){
    this.navCtrl.setRoot('SignupPage');
  }
}
