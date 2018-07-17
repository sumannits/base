import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import {MyApp} from '../../app/app.component';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public allCatList = [];
  public myCartCnt:number = 0;
  public loginUserId:number = 0;
  public subcatlist:any;
public catId:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public myApp:MyApp
  ) {
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
   // this.catId = this.navParams.get('catid');
    this.myApp.menuOpened();
    this.getCatList();
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
  }

  goToCart()
  {
    this.navCtrl.push('CartPage');
  }

  addToCart(catId,prdId){
    console.log("cat",catId);
    console.log("prd",prdId);
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
      this.navCtrl.push('LoginPage',{'catid':catId});
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

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }
  
  goToDetails(catId){
    this.navCtrl.push('ProductlistPage',{'catid':catId})
  }
  openCategories() {
    this.navCtrl.push('CateSearchPage');
  }
  goToSearch()
  {
    this.navCtrl.push('SearchPage');
  }

  getCatList(){
    this.serviceApi.getData('category/catwise_prd_list').then((result:any) => {
      if(result.Ack == 1){
        this.allCatList = result.cat_list;
        this.subcatlist=result.cat_list.product_list;
        console.log(this.allCatList);
        console.log("SUBCATTATAT",this.subcatlist);
      }
      //console.log(this.userDetails);
    }, (err) => {
     
    });
  }

  goToPrdDetails(prdId){
    this.navCtrl.push('DetailsPage',{'prd_id':prdId})
  }

}
