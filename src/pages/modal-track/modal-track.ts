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
  public desc:any;
  public getresult:any;
  public cartId:any;
  public status:any;
  public price:any;
  public ordershow:any;
  public order:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private builder:FormBuilder,public serviceApi: Api,public toastCtrl:ToastController) {

    this.form = builder.group({  
      'desc': ['', Validators.required],
      'price': ['', Validators.required],
      'status': ['', Validators.required]
    
    });

    this.desc = this.form.controls['desc'];
    this.price = this.form.controls['price'];
    this.status = this.form.controls['status'];
   
  }
  ionViewDidLoad() {
   this.order= this.navParams.get('orderDetails');
   console.log("ORDERDEtailssss",this.order);
   this.form.get('price').setValue(this.order.price);
    console.log('ionViewDidLoad ModalTrackPage');
  }

  dismiss() {
    // this.viewCtrl.dismiss();
    this.navCtrl.pop();
   }

   
  save(data){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.user_id=loguser.id;
  //  data.id=this.cartId
  console.log("PARRAMM",data);
    this.serviceApi.postData(data,'users/additional_note').then((result) => { 
    //  console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
       this.dismiss();
       this.tost_message('Saved Successfully')
       this.navCtrl.push("MyOrderDetailPage");
      }
      else{
        this.tost_message('Not Found')
      }
    }, (err) => {
      console.log(err);
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

  
      // getnote(){
  //   const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
  // let param={
  //   "user_id": loguser.id,
  //   "id":this.cartId
  // }
  //    this.serviceApi.postData(param,'users/get_cartnote').then((result) => { 
  //    //  console.log("Result",result);
  //      this.getresult = result;
  //      if(this.getresult.Ack == 1)
  //      {
  //       this.form.controls['note'].setValue(this.getresult.cart_data[0].note);
  //      }
       
  //    }, (err) => {
  //      console.log(err);
  //      this.tost_message('No Detail Found')
  //    });  
  // }

}
