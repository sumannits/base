import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the ModalTrackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-track',
  templateUrl: 'modal-track.html',
})
export class ModalTrackPage {
  public form:FormGroup;
  public description:any;
  public getresult:any;
  public cartId:any;
  public status:any;
  public price:any;
  public ordershow:any;
  public order:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private builder:FormBuilder,public serviceApi: Api,public toastCtrl:ToastController) {

    this.form = builder.group({  
      'description': ['', Validators.required],
      'price': ['', Validators.required]
    
    });

    this.description = this.form.controls['description'];
    this.price = this.form.controls['price'];
   
  }
  ionViewDidLoad() {
   this.order= this.navParams.get('orderDetails');
   //console.log("ORDERDEtailssss",this.order);
   this.form.get('price').setValue(this.order.price);
    //console.log('ionViewDidLoad ModalTrackPage');
  }

  dismiss() {
    // this.viewCtrl.dismiss();
    this.navCtrl.pop();
   }

   
  save(data){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.id=this.order.id;
    this.serviceApi.postData(data,'users/change_rider_price').then((result) => { 
    //  console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
     
       this.tost_message('Saved Successfully')
       this.navCtrl.setRoot("MyOrderDetailPage",{'order_id':this.order.order_id});
       //this.dismiss();
      }
      else{
        this.tost_message('Not Found')
      }
    }, (err) => {
      //console.log(err);
      this.tost_message('Not Found')
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
