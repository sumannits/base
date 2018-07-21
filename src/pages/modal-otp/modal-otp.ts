import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicPage, NavController, NavParams,ToastController,Platform } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
declare var SMS:any;

/**
 * Generated class for the ModalOtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-otp',
  templateUrl: 'modal-otp.html',
})
export class ModalOtpPage {

  public getresult:any;
  public orderdetail:any;
  public form:FormGroup;
  public otp:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController,private builder:FormBuilder,public androidPermissions: AndroidPermissions,public platform:Platform) {
  
    this.form = builder.group({  
      'otp': ['', Validators.compose([Validators.required])]
    });

    this.otp = this.form.controls['otp'];
  
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalOtpPage');
    this.ReadSMS();
    //let text = 'Hey! This is your otp : 1258 no for Base mobile verification';
    
  }


  ionViewWillEnter()
{
  if (this.platform.is('cordova')) {
this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
  success => console.log('Permission granted'),
err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
);

this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }
}

ReadSMS()
{
  if (this.platform.is('cordova')) {
this.platform.ready().then((readySource) => {

if(SMS) SMS.startWatch(()=>{
           console.log('watching started');
        }, Error=>{
       console.log('failed to start watching');
   });

  document.addEventListener('onSMSArrive', (e:any)=>{
       let sms = e.data;
       let splitstring =sms.body;
       if(splitstring!=''){
          let sptStr:any = splitstring.split(':');
          if(sptStr.length >0){
            let getOtp:any = sptStr[1].split(' ');
            if(getOtp.length > 0){
              getOtp.forEach(element => {
                if(element!='' && parseInt(element)){
                  this.form.controls['otp'].setValue(element);
                }
              });
            }
          }
       }
       //console.log("SMSMMS",sms.body);
       //this.form.controls['otp'].setValue(sms);

       });
     
    });
}
}
 
dismiss() {
  // this.viewCtrl.dismiss();
  this.navCtrl.pop();
 
 }
  verify(data){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.user_id=loguser.id;
    data.otp=data.otp.trim();
    this.serviceApi.postData(data,'users/phone_checkotp').then((result) => { 
      console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
        this.tost_message('Signup Successful');
       
        this.dismiss();
       
   
      }
      else{
        this.tost_message('Not Found');
      }
      
    }, (err) => {
      console.log(err);
    
    });


  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }

  

}
