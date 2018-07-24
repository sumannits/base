import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { Ionic2RatingModule } from 'ionic2-rating';
/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  public DeliveryCharge:number = 25.00;
  public order:any;
  public getresult:any;
  public ordershow:any;
  public orderid:any;
  public orderdt:any;
  public orderzip:any;
  public ordername:any;
  public orderamount:any;
  public orderviewid:any;
  public shopaddress:any;
  public modelname:any;
  public repaircatname:any;
  public storename:any;
  public productquantity:any;
  public productshippingcost:any;
  public subtotal:any;
  public grandtotal:any;
  public productprice:any;
  public paymenttype:any;
  public type:any;
  public shipmentdetails:any;
  public shipmentzip:any;
  public landmark:any;
  public destination:any;
  public mobno:any;
  public sevtax:any;
  public deliverydate:any;
  public status:any;
   public buttonchange:any;
   public button:any;
//  private range:Array<number> = [1,2,3,4,5];
  public rate:any;
  public review:any;
    responseData : any;
    public isjobdone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public serviceApi: Api,public toastCtrl:ToastController) {
  
  this.DeliveryCharge=25.00
  }

  ionViewDidLoad() {
    
    this.order=this.navParams.get('order_id');
    console.log('ionViewDidLoad OrderDetailPage',this.order);
    let paramval={
      "details_id": this.order
     };
    this.serviceApi.postData(paramval,'users/orderdetails').then((result) => { //console.log(result);
      this.getresult = result;
      console.log("resulttt",this.getresult);
     if(this.getresult.Ack == 1)
      {
        this.status=this.getresult.order_details[0].order_status;
        if(this.status=='P'){
          this.buttonchange=1;
        }
        else if(this.status=='D'){
         this.buttonchange=0;
        }
      this.deliverydate=this.getresult.order_sub_details[0].delivery_date;
      console.log("this.deliverydate", this.deliverydate);
      this.ordershow = this.getresult.order_details;
      this.sevtax=this.getresult.order_details[0].service_charge;
      this.productquantity= this.getresult.order_details[0].quantity;
      this.productprice=this.getresult.order_details[0].price;
      this.productshippingcost=this.getresult.order_details[0].shipping_cost;
      this.subtotal=parseInt(this.productquantity)*parseInt(this.productprice);
      this.grandtotal=parseInt(this.subtotal)+parseInt(this.productshippingcost);
      this.paymenttype=this.getresult.order_details[0].payment_status;
      this.mobno=this.getresult.shipping_details[0].phone;
    this.destination=this.getresult.shipping_details[0].save_as;
   this.shipmentdetails=this.getresult.shipping_details[0].address;
   this.shipmentzip=this.getresult.shipping_details[0].zip;
   this.landmark=this.getresult.shipping_details[0].landmark;
      if(this.paymenttype==3){
        this.type=0;
      }
      else{
        this.type=1
      }
      console.log("SUBTOTALLL",this.subtotal)
    
       
     }
      else{
        this.tost_message('No Detail Found')
       }
      
    }, (err) => {
      console.log(err);
      // Error log
    });
    this.ratecheck();
  }

  gotoRate(){

    this.navCtrl.push('RatingPage',{'order_id': this.order});
  }

  track(){
    this.navCtrl.push('UserMapPage',{'order_id': this.order});
  }

  endtrack(){
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: 'Are You Want to Sure?' ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          role: 'Ok',
        handler: () => {
          let paramval={
            "id": this.order,
            "status":"C"
           };
          this.serviceApi.postData(paramval,'users/change_rider_order_status').then((result) => { //console.log(result);
            this.getresult = result;
          console.log("resulttt",this.getresult);
           if(this.getresult.Ack == 1)
            {
              this.buttonchange=2;
           //this.navCtrl.push('MyOrderDetailPage');
           }
            else{
              this.tost_message('No Detail Found')
             }
            
          }, (err) => {
            console.log(err);
            // Error log
          });
          }
        }
      ]
    });
    alert.present();
  }

 ratecheck(){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    let paramval={
      "order_id": this.order,
      "user_id":loguser.id
     };
     console.log("PARAMMMMM",paramval);
     this.serviceApi.postData(paramval,'users/check_ratting').then((result) => { //console.log(result);
      this.getresult = result;
      console.log("ratecheckkkkkk",this.getresult);
    
      if(this.getresult.Ack == 0)
      {
        this.button=0;
        
       this.tost_message('You have already given the ratting');
      }
      else{
        this.button=1;
      }
     
    },
    (err) => {
      console.log(err);
      // Error log
    });
}

  tost_message(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present(); 
  }

    gotoChatDet(ordId){
      this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId})
    }

}
