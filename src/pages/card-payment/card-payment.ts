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
declare var Conekta:any;
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
  public loguser :any;
  public shipid:any;
  public pet:any;
  public orderdate:any;
  public chekoutresult:any;
  public myCartCnt:number = 0;
  public cardlist:any;
  public selectedSection:any;
  public card_id:any;
  public ordateto:any;
  public concat:any;

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
    Conekta.setPublicKey("key_Kyr3yqbbdxXSo6yYPGEu8pQ");

  }

  ionViewDidLoad() {
    this.orderdate=this.navParams.get('datefrom');
    this.ordateto=this.navParams.get('dateto');
    //console.log("CONCATTATATAT",this.ordateto);
    this.paycostamount=this.navParams.get('Payamount');
    //console.log("TOTalAMOUNTT",this.paycostamount)
    this.shipid=this.navParams.get('Shipment');
    let sign_val = JSON.parse(localStorage.getItem('userPrfDet'));
    this.id=sign_val.id;
   //console.log("0000000000",sign_val);
    //console.log('ionViewDidLoad CardPaymentPage');
    this.getMyCartCount();
    this.savedcard();
  }

  onchange(card){
    this.card_id=card;
  }
  savedcard(){
    this.serviceApi.postData({"user_id": this.id},'users/card_list').then((result:any) => {
      //console.log("anyyy",result);
      if(result.Ack == 1){
        this.cardlist = result.response;
        //console.log("cardsss",this.cardlist);
      }
    }, (err) => {
    
    }); 


  }

  savecardpayment(){
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    loading.present();
    let param={
      "user_id":this.id,
      "amount": this.paycostamount,
      "delivery_date": this.orderdate,
      "time":this.ordateto,
      "shipping_id":this.shipid,
      "payment_type":"card",
      "card_id":this.card_id
      };
  
      this.serviceApi.postData(param,'users/card_checkout').then((result) => {
        this.chekoutresult = result;
        if(this.chekoutresult.Ack=1){
          let toast = this.toastCtrl.create({
            message: 'Order has been successfully placed.',
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
          this.navCtrl.setRoot('OrderListPage');
          loading.dismiss();
        }
      });
  }

  savecashpayment(){
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    loading.present();
    let param={
      "user_id":this.id,
      "amount": this.paycostamount,
      "delivery_date": this.orderdate,
      "time":this.ordateto,
      "shipping_id":this.shipid,
      "payment_type":"cash",
      "card_id":""
      };
    
  //console.log("savedcard",param);
      this.serviceApi.postData(param,'users/card_checkout').then((result) => {
        this.chekoutresult = result;
        if(this.chekoutresult.Ack=1){
          let toast = this.toastCtrl.create({
            message: 'Order has been successfully placed.',
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
          this.navCtrl.setRoot('OrderListPage');
          loading.dismiss();
        }
      });
  }

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.id},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }


  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
  }

  pay(){
    let data:any=this.form.value;
    //console.log("datattatat",data);
    if (!data.user_name) {
      const alert = this.alertCtrl.create({
        title: 'Enter Card Holder Name!',
        subTitle: "Please Enter Card Details",
        buttons: ['OK']
      });
      alert.present();
    }
   else if (!data.card_no) {
      const alert = this.alertCtrl.create({
        title: 'Enter Card Number!',
        subTitle: "Please Enter Card Details",
        buttons: ['OK']
      });
      alert.present();
    }
    else if(data.exp_month>12){
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Please Select Month from 1 to 12',
        buttons: ['Ok']
      });
      alert.present();
    }else{
      let loading = this.loadingCtrl.create({
        content: 'Please Wait...'
      });
      loading.present();
  
      let tokenParams = {
        "card": {
          "number": data.card_no,
          "name": data.user_name,
          "exp_year": data.exp_year,
          "exp_month": data.exp_month,
          "cvc": data.cvv
          // "address": {
          //     "street1": "Calle 123 Int 404",
          //     "street2": "Col. Condesa",
          //     "city": "Ciudad de Mexico",
          //     "state": "Distrito Federal",
          //     "zip": "12345",
          //     "country": "Mexico"
          //  }
        }
      };
      Conekta.Token.create(tokenParams, successResponseHandler, errorResponseHandler);
      var successResponseHandler = function(token) {
        let tockenId = token.id;
        let card = {
          user_id:this.id,
          name:data.user_name,
          card_number: data.card_no,
          expairy_month: data.exp_month,
          expairy_year: data.exp_year,
          cvv:data.cvv,
          tockenId:tockenId
        };
        this.serviceApi.postData(card,'users/add_card').then((result) => { //console.log(result);
          this.getresult = result;
        //console.log("PAYYYYRESLT",result);
          if(this.getresult.Ack == 1){
          
            let param={
              "user_id":this.id,
              "amount": this.paycostamount,
              "delivery_date": this.orderdate,
              "shipping_id":this.shipid,
              "time":this.ordateto,
              "payment_type":"card",
              "card_id":this.getresult.user_savecardId
            };

            this.serviceApi.postData(param,'users/card_checkout').then((result) => {
              this.chekoutresult = result;
              if(this.chekoutresult.Ack=1){
                let toast = this.toastCtrl.create({
                  message: 'Order has been successfully placed.',
                  duration: 4000,
                  position: 'bottom'
                });
                toast.present();
                this.navCtrl.setRoot('OrderListPage');
              }
            });
            loading.dismiss();
          }else{
            loading.dismiss();
            this.tost_message('Not Found')
          }
        })
        //console.log(token);
      };

      var errorResponseHandler = function(error) {
        loading.dismiss();
        if(error.message){
          const alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: error.message,
            buttons: ['OK']
          });
          alert.present();
        }
      };

      // this.serviceApi.postData(card,'users/add_card').then((result) => { //console.log(result);
      //   this.getresult = result;
      // //console.log("PAYYYYRESLT",result);
      //   if(this.getresult.Ack == 1){
        
      //     let param={
      //       "user_id":this.id,
      //       "amount": this.paycostamount,
      //       "delivery_date": this.orderdate,
      //       "shipping_id":this.shipid,
      //       "time":this.ordateto,
      //       "payment_type":"card",
      //       "card_id":this.getresult.user_savecardId
      //     };

      //     this.serviceApi.postData(param,'users/card_checkout').then((result) => {
      //       this.chekoutresult = result;
      //       if(this.chekoutresult.Ack=1){
      //         let toast = this.toastCtrl.create({
      //           message: 'Order has been successfully placed.',
      //           duration: 4000,
      //           position: 'bottom'
      //         });
      //         toast.present();
      //         this.navCtrl.setRoot('OrderListPage');
      //       }
      //     });
      //    loading.dismiss();
      //   }else{
      //     loading.dismiss();
      //     this.tost_message('Not Found')
      //   }
      // })
    }
  }
  goToCart(){
    this.navCtrl.setRoot('CartPage');
  }

  goToSearch(){
    this.navCtrl.setRoot('SearchPage');
  }
}
