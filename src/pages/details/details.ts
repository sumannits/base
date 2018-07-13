import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
/**

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  public prdId:number = 0;
  public prdDetails:any;
  public loginUserId:number = 0;
  public myCartCnt:number = 0;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
    this.prdId = this.navParams.get('prd_id');
    this.getPrdDetails();
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
  }

  goToCart()
  {
    this.navCtrl.push('CartPage');
  }
  goToSearch()
  {
    this.navCtrl.push('SearchPage');
  }

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }

  getPrdDetails(){
    if(this.prdId > 0){
      this.serviceApi.getData('category/product_details/'+this.prdId).then((result:any) => {
        if(result.Ack == 1){
          this.prdDetails = result.product_details;
          //console.log(this.allPrdList);
        }
      }, (err) => {
      
      });
    }
  }

  addToCart(prdId){
    if(this.loginUserId > 0){
      this.serviceApi.postData({"user_id":this.loginUserId, "prd_id":prdId},'users/addto_cart').then((result:any) => {
        if(result.Ack == 1){
          let toast = this.toastCtrl.create({
            message: result.msg,
            duration: 4000,
            position: 'top'
          });
          toast.present();
        }else{
          let toast = this.toastCtrl.create({
            message: result.msg,
            duration: 4000,
            position: 'top'
          });
          toast.present();
        }
      }, (err) => {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Something wrong.Please try again.' ,
          buttons: ['Ok']
        });
        alert.present();
      });
    }else{
      let alert = this.alertCtrl.create({
        title: 'Alert!',
        subTitle: 'Please login first to add this product in your cart.' ,
        buttons: [
          {
            text: 'Ok',
            role: 'Ok',
          handler: () => {
            this.navCtrl.push('LoginPage',{'prd_id': this.prdId});
            }
          }
        ]
      });
      alert.present();
    }
    this.getMyCartCount();
  }
}
