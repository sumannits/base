import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
/**
 * Generated class for the MobileVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mobile-verification',
  templateUrl: 'mobile-verification.html',
})
export class MobileVerificationPage {
  public getresult:any;
  public orderdetail:any;
  public form:FormGroup;
  public mobileno:any;
  public isd:any;
  public concat:any;
  public userid:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController,private builder:FormBuilder) {
  
    this.form = builder.group({  
      'mobileno': ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(13),Validators.pattern('^[0-9]*$'),Validators.required])],
      'isd' : ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.required])]
    });

    this.mobileno = this.form.controls['mobileno'];
    this.isd = this.form.controls['isd'];
  
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileVerificationPage');
  }

  verify(data){

    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.user_id=loguser.id;
  this.concat=data.isd+data.mobileno;
  this.userid=loguser.id
  
  let param={
'user_id':this.userid,
'phone_no':this.concat
  }
  //console.log("PARRAMM",param);
    this.serviceApi.postData(param,'users/phone_sentotp').then((result) => { 
     // console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
        this.navCtrl.push('VerificationPage');
       
 
      }
      else{
        this.tost_message('No Detail Found')
      }
      
    }, (err) => {
      console.log(err);
      this.tost_message('No Detail Found')
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
