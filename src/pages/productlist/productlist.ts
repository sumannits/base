import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the ProductlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-productlist',
  templateUrl: 'productlist.html',
})
export class ProductlistPage {

  public catId:number = 0;
  public allPrdList = [];
  public catDet:any;
  public loginUserId:number = 0;
  public myCartCnt:number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ){
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
    this.catId = this.navParams.get('catid');
    this.getCatWisePrdList();
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
    //console.log(this.loginUserId);
  }

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }

  getCatWisePrdList(){
    //console.log(this.catId);
    if(this.catId > 0){
      this.serviceApi.getData('category/catwise_prdlist/'+this.catId).then((result:any) => {
        if(result.Ack == 1){
          this.allPrdList = result.product_list;
          this.catDet=result.category_details[0];
          console.log("allPrdList",result);
        }
      }, (err) => {
      
      });
    }
  }
  
  goToPrdDetails(prdId){
    this.navCtrl.push('DetailsPage',{'prd_id':prdId})
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
          this.getMyCartCount();
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
      this.navCtrl.push('LoginPage',{'catid':this.catId});
      // let alert = this.alertCtrl.create({
      //   title: 'Alert!',
      //   subTitle: 'Please login first to add this product in your cart.' ,
      //   buttons: [
      //     {
      //       text: 'Ok',
      //       role: 'Ok',
      //     handler: () => {
           
      //       }
      //     }
      //   ]
      // });
      // alert.present();
      
    }
    
  }
  
  goToCart(){
    this.navCtrl.push('CartPage');
  }
}
