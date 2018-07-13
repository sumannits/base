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
    this.serviceApi.getData('category/list').then((result:any) => {
      if(result.Ack == 1){
        this.allCatList = result.cat_list;
        //console.log(this.allCatList);
      }
      //console.log(this.userDetails);
    }, (err) => {
     
    });
  }
}
