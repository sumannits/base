import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the MyOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order-detail',
  templateUrl: 'my-order-detail.html',
})
export class MyOrderDetailPage {
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
//  private range:Array<number> = [1,2,3,4,5];
  public rate:any;
  public review:any;
    responseData : any;
    public isjobdone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyOrderDetailPage');
    this.order=this.navParams.get('order_id');
    console.log('ionViewDidLoad OrderDetailPage',this.order);
    let paramval={
      "details_id": this.order
     };
    this.serviceApi.postData(paramval,'users/orderdetails').then((result) => { //console.log(result);
      this.getresult = result;
    //  console.log("resulttt",this.getresult);
     if(this.getresult.Ack == 1)
      {
       
      this.ordershow = this.getresult.order_details[0];
    //  console.log("result99999999999999tt",this.ordershow);
      this.productquantity= this.getresult.order_details[0].quantity;
      this.productprice=this.getresult.order_details[0].price;
      this.productshippingcost=this.getresult.order_details[0].shipping_cost;
      this.subtotal=parseInt(this.productquantity)*parseInt(this.productprice);
      this.grandtotal=parseInt(this.subtotal)+parseInt(this.productshippingcost);
      this.paymenttype=this.getresult.order_details[0].payment_status;
   this.shipmentdetails=this.getresult.shipping_details[0].address;

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
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }


}
