import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

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
  public order:any;
  public getresult:any;
  public ordershow:any;
  public orderid:any;
  public orderdt:any;
  public orderzip:any;
  public ordername:any;
  public orderamount:any;
  public ordertransid:any;
  public orderticket:any;
  public orderviewid:any;
  public shopaddress:any;
  public modelname:any;
  public repaircatname:any;
  public storename:any;
  public barcode:any;
//  private range:Array<number> = [1,2,3,4,5];
  public rate:any;
  public review:any;
    responseData : any;
    public isjobdone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController) {
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
       
      this.ordershow = this.getresult.order_details;
      //  console.log("ordershow",this.ordershow);
      //  this.orderdt=this.ordershow.order_date;
      //  this.ordertransid=this.ordershow.transaction_id;
      //  this.orderamount=this.ordershow.amount;
      //  this.orderzip=this.ordershow.zipcode;
      //  this.ordername=this.ordershow.name;
      //  this.orderticket=this.ordershow.ticket_id;
      //  this.orderviewid=this.ordershow.order_view_id;
      //  this.shopaddress=this.ordershow.address;
      //  this.modelname=this.ordershow.phonemodelname;
      //  this.repaircatname=this.ordershow.repaircategoryname;
      //  this.storename=this.ordershow.shopname;
      //  this.barcode=this.ordershow.barcode_image_url;
      //  this.isjobdone=this.ordershow.is_job_done;
     
       
      //  console.log("storename",this.storename);
      //  console.log("repaircatname",this.repaircatname);
       
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
