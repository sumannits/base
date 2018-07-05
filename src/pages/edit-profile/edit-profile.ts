import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  private form: FormGroup;
  public userDetails:any;
  public userId:number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userService: Api,
    private fbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) {
    let userDetailsJson:any = localStorage.getItem('userPrfDet');
    userDetailsJson = JSON.parse(userDetailsJson);
    this.userId = userDetailsJson.id;
    //console.log(this.userId);
    this.getUserDetails();

    this.form = this.fbuilder.group({
      first_name: new FormControl('', Validators.compose([
        Validators.pattern('([a-zA-Z])+([a-zA-Z ])+'),
        Validators.required
      ])),
      last_name: new FormControl('', Validators.compose([
        Validators.pattern('([a-zA-Z])+([a-zA-Z ])+'),
        Validators.required
      ])),
      /*paypal_email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),*/
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{10}')
      ])),
      city: new FormControl(''),
      address: new FormControl(''),
      about: new FormControl(''),
      //terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  getUserDetails(){
    if(this.userId > 0){
      this.userService.postData({"id":this.userId},'users/appuserdetails').then((result:any) => {
        if(result.Ack == 1){
          this.userDetails = result.UserDetails[0];
          this.form.get('first_name').setValue(this.userDetails.first_name);
          this.form.get('last_name').setValue(this.userDetails.last_name);
          this.form.get('email').setValue(this.userDetails.email);
          //this.form.get('paypal_email').setValue(this.userDetails.paypal_email);
          this.form.get('phone').setValue(this.userDetails.phone);
          this.form.get('city').setValue(this.userDetails.city);
          this.form.get('address').setValue(this.userDetails.address);
          this.form.get('about').setValue(this.userDetails.about);
        }
        //console.log(this.userDetails);
      }, (err) => {
       
      });
    }
  }

  goToEditAddress()
  {
    this.navCtrl.push('EditAddressPage');
  }

  updateProfileData(frmdata:any){
    //console.log(frmdata);
    frmdata.id = this.userId;
    this.userService.postData(frmdata,'users/appupdateaccount').then((result:any) => {
      if(result.Ack ==1){
        //console.log(result);
        localStorage.setItem('userPrfDet', JSON.stringify(result.UserDetails));
        let toast = this.toastCtrl.create({
          //message: 'You have successfully signup.Please Login.',
          message: result.msg,
          duration: 4000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('EditProfilePage');
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

}
