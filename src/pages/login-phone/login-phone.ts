import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController,ModalController,LoadingController,NavParams } from 'ionic-angular';
import { Api } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';

/**
 * Generated class for the LoginPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-phone',
  templateUrl: 'login-phone.html',
})
export class LoginPhonePage {
  private form: FormGroup;
  public phone: AbstractControl;
  public isd:AbstractControl;
  public isFrmValid:boolean = true;
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private fbuilder: FormBuilder,
     public alertCtrl: AlertController,
     public toastCtrl: ToastController,
     public modalCtrl: ModalController,
     public loadingCtrl:LoadingController,
     public serviceApi: Api

  ) {
    this.form = fbuilder.group({
      'phone': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      'isd' : ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern('^[0-9+]*$'),Validators.required])]
    });
    this.phone = this.form.controls['phone'];
    this.isd = this.form.controls['isd'];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPhonePage');
  }

 

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }



}
