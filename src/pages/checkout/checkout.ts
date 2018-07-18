import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  public myAddressList = [];
  public myCartCnt:number = 0;
  public loginUserId:number = 0;
  public isEditFrm:boolean = false;
  private form: FormGroup;
  public loginUserDet:any;
  public dateselect:any;
  public dateselectto:any;
  public isdateselect:any;
  public isdateselectto:any;
  public paycost:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    private fbuilder: FormBuilder,
    public toastCtrl: ToastController
  ) {
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
        this.loginUserDet = userDetailsJson;
      }

      this.form = this.fbuilder.group({
        id: new FormControl(''),
        name: new FormControl('', Validators.compose([
          Validators.pattern('([a-zA-Z])+([a-zA-Z ])+'),
          Validators.required
        ])),
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        phone: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]{10}')
        ])),
        zip: new FormControl('', Validators.compose([
          Validators.required
        ])),
        address: new FormControl('', Validators.compose([
          Validators.required
        ])),
        landmark: new FormControl('', Validators.compose([
          Validators.required
        ])),
        save_as: new FormControl('', Validators.compose([
          Validators.pattern('([a-zA-Z])+([a-zA-Z ])+'),
          Validators.required,
        ]))
      

      });
  }

  ionViewDidLoad() {
    this.paycost=this.navParams.get('Total');
    console.log("AMOUNTT",this.paycost)
    this.getShippingAddList();
    if(this.loginUserId > 0){
      this.getMyCartCount();
      this.form.get('name').setValue(this.loginUserDet.first_name +' '+this.loginUserDet.last_name);
      this.form.get('email').setValue(this.loginUserDet.email);
    }
  
  }

  getShippingAddList(){
    this.serviceApi.postData({"user_id": this.loginUserId},'users/get_shipping_addresses').then((result:any) => {
      if(result.Ack == 1){
        this.myAddressList = result.shipping_list;
        if(this.myAddressList.length >0){
          //this.isEditFrm = true;
        }
        console.log(this.myAddressList);
      }
    }, (err) => {
    
    }); 
  }

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }

  dateselct(data){

   // this.form.get('date').setValue(this.dateselect);
    this.isdateselect=this.dateselect;
    console.log("DATEET",this.isdateselect);
  }
  dateselctto(data){
     this.isdateselectto=this.dateselectto;
     console.log("DATEET",this.isdateselectto);
   }
  goToPayment(datefrom,dateto,shipping)
  {
    //this.isdateselect=this.dateselect;
    console.log("DATEET",datefrom);
    console.log("DATEET",dateto);
    console.log("shipping",shipping);
    this.navCtrl.push('CardPaymentPage',{'datefrom':datefrom,'dateto':dateto,'Shipment':shipping,'Payamount':this.paycost});
  }

  goToCart(){
    this.navCtrl.push('CartPage');
  }

  goToSearch(){
    this.navCtrl.push('SearchPage');
  }

  updateShippingData(frmdata:any){
    frmdata.user_id = this.loginUserId;
    this.serviceApi.postData(frmdata,'users/shipping_address').then((result:any) => {
      if(result.Ack ==1){
        let toast = this.toastCtrl.create({
          message: result.msg,
          duration: 4000,
          position: 'top'
        });
        toast.present();
        this.isEditFrm = false;
        this.getShippingAddList();
      }else{
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Something wrong.Please try again.' ,
          buttons: ['Ok']
        });
        alert.present();
      }
    }, (err) => {
      
    });
  }
  
  deliveringEditdata(fdata:any){
    this.form.get('id').setValue(fdata.id);
    this.form.get('save_as').setValue(fdata.save_as);
    this.form.get('name').setValue(fdata.name);
    this.form.get('email').setValue(fdata.email);
    this.form.get('phone').setValue(fdata.phone);
    this.form.get('zip').setValue(fdata.zip);
    this.form.get('address').setValue(fdata.address);
    this.form.get('landmark').setValue(fdata.landmark);
    this.isEditFrm = true;
  }
}
