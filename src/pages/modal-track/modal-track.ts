import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Api, ResponseMessage } from '../../providers';
import { concat } from 'rxjs/observable/concat';

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
  public loadingConst:any;
  parameter:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private builder:FormBuilder,public serviceApi: Api,
    public loadingCtrl: LoadingController,
    public toastCtrl:ToastController) {

    this.form = builder.group({  
      'description': ['', Validators.required],
      'price': ['', Validators.required]
    
    });

    this.description = this.form.controls['description'];
    this.price = this.form.controls['price'];
   
  }
  ionViewDidLoad() {
    localStorage.setItem('currentActivePage','ModalTrackPage');
   this.parameter= this.navParams.get('orderDetails');
   console.log('parameter',this.parameter)
   this.order=JSON.parse(this.parameter);
   console.log('PRICE',this.order,this.order.price)
   //console.log("ORDERDEtailssss",this.order);
   this.form.get('price').setValue(this.order.price);
  //  this.form.get('description').setValue(this.order.description);
    //console.log('ionViewDidLoad ModalTrackPage');
  }

  dismiss() {
    // this.viewCtrl.dismiss();
    this.navCtrl.pop();
   }

   
  save(data){
    this.loadingCustomModal('open');
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.id=this.order.id;
    console.log('data',data)
    this.serviceApi.postData(data,'users/change_rider_price').then((result) => { 
    //  console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
        
        this.tost_message('Saved Successfully')
        this.navCtrl.setRoot("MyOrderDetailPage",{'order_id':this.order.order_id});
        // this.navCtrl.pop();
        this.loadingCustomModal('close');
       //this.dismiss();
      }
      else{
        this.loadingCustomModal('close');
        this.tost_message('Not Found')
        // this.navCtrl.pop();
      }
    }, (err) => {
      this.loadingCustomModal('close');
      this.tost_message('Not Found')
      // this.navCtrl.pop();
    });
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present(); 
  }

  loadingCustomModal(type:any){
    if(type == 'open'){
      this.loadingConst = this.loadingCtrl.create({
        content: 'Please Wait...'
      });
      this.loadingConst.present();
    }else {
      this.loadingConst.dismiss();
    }
  }
}
