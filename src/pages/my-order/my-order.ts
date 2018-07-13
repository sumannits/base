import { Component } from '@angular/core';
import { Api, ResponseMessage } from '../../providers';
import { IonicPage, NavController, NavParams, AlertController, LoadingController,ToastController } from 'ionic-angular';

/**
 * Generated class for the MyOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order',
  templateUrl: 'my-order.html',
})
export class MyOrderPage {

  public getresult:any;
  public orderdetail:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    // this.usertype=loguser.utype
     this.serviceApi.postData({"user_id": loguser.id},'users/rider_assign_orderlist').then((result) => { 
       this.getresult = result;
       if(this.getresult.Ack == 1)
       {
        
         this.orderdetail = this.getresult.order_list;
       
       }
       else{
         this.tost_message('No Detail Found')
       }
       
     }, (err) => {
       //console.log(err);
       this.tost_message('No Detail Found')
     });
  }
  
  gotoChatDet(ordId){
    this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId})
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }

}