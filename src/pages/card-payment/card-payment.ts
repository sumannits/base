import { Component } from '@angular/core';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, LoadingController,ToastController,Platform } from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
/**
 * Generated class for the CardPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card-payment',
  templateUrl: 'card-payment.html',
})
export class CardPaymentPage {
  public form:FormGroup;
  public card_no:AbstractControl;
  public exp_month:AbstractControl;
  public user_name:AbstractControl;
  public exp_year:AbstractControl;
  public cvv:AbstractControl;
  public paycostamount:any;
  public id:any;
  public generate_token:any;
  public getresult:any;
  public modelid:any;
  public orderdata:any;
  public isenabled:boolean;
  public originalprice:any;
  public discount:any;
  public shopdetail:any;
  public shopname:any;
  public loguser :any;
  public shipid:any;
  public pet:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,private stripe:Stripe,public toastCtrl:ToastController, public loadingCtrl: LoadingController,public alertCtrl: AlertController,public serviceApi: Api,private builder:FormBuilder) {
    this.pet ='puppies';
    
    this.form = builder.group({
      'user_name': ['', Validators.compose([Validators.required])],
      'card_no': ['', Validators.compose([Validators.required,Validators.minLength(16),Validators.maxLength(16),Validators.pattern('^[0-9]*$'),Validators.required])],  
      'exp_month': ['', Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(2),Validators.pattern('^[0-9]*$'),Validators.required])],
      'exp_year': ['', Validators.compose([Validators.required,Validators.minLength(4),Validators.maxLength(4),Validators.pattern('^[0-9]*$'),Validators.required])],  
      'cvv': ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern('^[0-9]*$'),Validators.required])]
     
     
    });

    this.user_name = this.form.controls['user_name'];
    this.card_no = this.form.controls['card_no'];
    this.exp_month = this.form.controls['exp_month'];
    this.exp_year = this.form.controls['exp_year'];
    this.cvv = this.form.controls['cvv'];


  }

  ionViewDidLoad() {
    this.paycostamount=this.navParams.get('Payamount');
    console.log("TOTalAMOUNTT",this.paycostamount)
    this.shipid=this.navParams.get('Shipment');
    let sign_val = JSON.parse(localStorage.getItem('userPrfDet'));
    this.id=sign_val.id;
   console.log("0000000000",sign_val);
    console.log('ionViewDidLoad CardPaymentPage');
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
  }

  pay(data){
    if(data.exp_month>12){
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please Select Month from 1 to 12',
        buttons: ['Ok']
      });
      alert.present();
    }
    if(data.exp_month){
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      content: 'Please Wait...'
    });
    loading.present();
    this.stripe.setPublishableKey('pk_test_mUJGVSkQAUdfxflKl5AoVcVL');
    let card = {
      name:data.user_name,
      number: data.card_no,
      expMonth: data.exp_month,
      expYear: data.exp_year,
      cvc:data.cvv
     };
     //console.log('Payment Fromcontrol',card);
     this.stripe.createCardToken(card)
     .then(token => {console.log("TOKENNNN",token.id)
    
     this.generate_token=token.id;

     let param={
      "token": this.generate_token,
      "user_id":this.id,
      "amount": this.paycostamount,
      "phone_model_id":this.modelid,
      "ship_id":this.shipid
     };
     console.log("paymentdatat",param);
    
     this.serviceApi.postData(param,'webservice/brands/placeorder').then((result) => { //console.log(result);
      this.getresult = result;
      console.log("PAYYYYRESLT",result);
      if(this.getresult.Ack == 1)
      {
         this.orderdata=this.getresult.OrderDetails.id;
         console.log("ORDERDATAAAAAA",this.orderdata);
      localStorage.setItem('orderdata', JSON.stringify(this.orderdata));
         loading.dismiss();
       this.navCtrl.setRoot('PaymentSuccessPage');

      }
      else{
        loading.dismiss();
        this.tost_message('Not Found')
      }
    
      
    })

    
     })
     .catch(error => console.error(error));

    }

  }



}
