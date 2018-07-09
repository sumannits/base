import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CateSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cate-search',
  templateUrl: 'cate-search.html',
})
export class CateSearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CateSearchPage');
  }

  goToCart()
  {
    this.navCtrl.push('CartPage');
  }

  goToSubCat()
  {
    this.navCtrl.push('SubCatePage');
  }

}
