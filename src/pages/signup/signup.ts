import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';
import { Api } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  private form: FormGroup;
  private checkEmailExist:boolean=true;
  // Our translated text strings
  private signupErrorString: string;

  public first_name: AbstractControl;
  public last_name: AbstractControl;
  public email: AbstractControl;
  public phone: AbstractControl;
  public password: AbstractControl;
  public cpassword: AbstractControl;

  public isFrmValid:boolean = true;
   

  constructor(
    public navCtrl: NavController,
    public userService: Api,
    private fbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public translateService: TranslateService
  ) {

    this.form = fbuilder.group({
      'first_name': ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],
      'last_name': ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*')])],
      'email': ['', Validators.compose([Validators.required,Validators.email])],
      'phone': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'cpassword': ['', Validators.compose([Validators.required])]
    });
    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.phone = this.form.controls['phone'];
    this.password = this.form.controls['password'];
    this.cpassword = this.form.controls['cpassword'];
  }

  doSignup(val : any) {
    //console.log(val);
    let password = this.password.value.toString();
    let cpassword = this.cpassword.value.toString();
    let CheckvalidEmail = this.email.value.toString();
    CheckvalidEmail.trim();
    let isValidEmail = this.validateEmail(CheckvalidEmail);

    if(password==cpassword && isValidEmail){
      this.userService.postData({"email":CheckvalidEmail},'users/appsearchbyemail').then((result:any) => {
        if(result.Ack == 1){
          this.isFrmValid=false;
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'Email Id Already Exist',
            buttons: ['Ok']
          });
          alert.present();
        }else{
          this.isFrmValid=true;
        }
      }, (err) => {
        
      });

      //
    }else if(!isValidEmail){
      this.isFrmValid=false;
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Please enter valid email',
        buttons: ['Ok']
      });
      alert.present();
    }else if(password!=cpassword){
      this.isFrmValid=false;
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Password and confirm password must match.',
        buttons: ['Ok']
      });
      alert.present();
    }

    if (this.form.valid && this.isFrmValid) {
      let signupJsonData={
        "first_name": this.first_name.value.toString(),
        "last_name": this.last_name.value.toString(),
        "email": CheckvalidEmail,
        "password": this.password.value.toString(),
        "user_type":1,
        "is_active": 0,
        "phone": this.phone.value.toString(),
        "is_email_verified": 0,
        //"deviceToken": this.device.uuid,
        //"deviceType": this.device.platform
      };
      //console.log(filterIntData);
      this.userService.postData(signupJsonData,'users/appsignup').then((result:any) => {
        if(result.Ack ==1){
          
          let toast = this.toastCtrl.create({
            //message: 'You have successfully signup.Please Login.',
            message: result.msg,
            duration: 4000,
            position: 'top'
          });
          toast.present();

          this.navCtrl.setRoot('WelcomePage');
        }else{
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'Something wrong.Please try again.' ,
            buttons: ['Ok']
          });
          alert.present();
        }
      }, (err) => {
        // let alert = this.alertCtrl.create({
        //   title: 'Error!',
        //   subTitle: this.jsonErrMsg.messageData(err),
        //   buttons: ['Ok']
        // });
        // alert.present();
      });
    }
  }

  public validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public onLogin() {
    this.navCtrl.setRoot('LoginPage');
  }


}
