import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  public allPrdList = [];
  public loginUserId:number = 0;
  public myCartCnt:number = 0;
  public searchItem: string = '';

  constructor(
    public navCtrl: NavController,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams
  ) { 
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
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

  getItems(ev) {
    let val = ev.target.value;
    let searchKeyWord = '';
    if (!val || !val.trim()) {
      searchKeyWord = ''
    }else{
      searchKeyWord = val
    } 
    this.serviceApi.postData({"keyword": searchKeyWord, "cat_id":""},'users/product_search').then((result:any) => {
      if(result.Ack == 1){
        this.allPrdList = result.product_list;
        //console.log(this.allPrdList);
      }
    }, (err) => {
    
    }); 
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
      let alert = this.alertCtrl.create({
        title: 'Alert!',
        subTitle: 'Please login first to add this product in your cart.' ,
        buttons: ['Ok']
      });
      alert.present();
    }
    
  }

  goToCart(){
    this.navCtrl.push('CartPage');
  }

}
