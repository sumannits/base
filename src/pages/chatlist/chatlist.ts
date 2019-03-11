import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Api, ResponseMessage } from '../../providers';
import * as _ from 'lodash';

/**
 * Generated class for the ChatlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatlist',
  templateUrl: 'chatlist.html',
})
export class ChatlistPage {

  public loginUserId:any;
  public loginUserDet:any;
  public chatlist = [];
  public dbRef: any;
  public frmdbRef: any;
  public myRoomIdlist = [];

  constructor(
    public navCtrl: NavController, 
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    public serviceApi: Api,
    public navParams: NavParams,
    public loadingCtrl:LoadingController,
  ) {
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      let userDetailsJson:any = localStorage.getItem('userPrfDet');
      userDetailsJson = JSON.parse(userDetailsJson);
      this.loginUserId = userDetailsJson.id;
      this.loginUserDet = userDetailsJson;
    }
  }

  ionViewDidLoad() {
    localStorage.setItem('currentActivePage','ChatlistPage');
    this.getMyChatMessages();
  }

  getMyChatMessages() {
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    loading.present();
    this.serviceApi.postData({"user_id": this.loginUserId, "type":this.loginUserDet.user_type},'users/get_mychat_list').then((result:any) => {
      if(result.Ack == 1){
        loading.dismiss();
        //console.log(result.room_list);
        if(result.room_list.length >0){
          result.room_list.forEach(element => {
            if(element.id >0){
              this.getLastMsg(element.id, element);
              //this.myRoomIdlist.push(element.id);
            }
          });
        }
      }
      else{
        loading.dismiss();
      }
    }, (err) => {
      loading.dismiss();
    
    }); 
    
    //console.log(this.chatlist);
  }

  public getLastMsg(nRoomId: any, userData: any) {
    const messages1 = this.db.collection('livechat', ref => {
      return ref.where('room_id', '==', nRoomId).orderBy('cdate', 'desc').limit(1);
    }).snapshotChanges().map(actions => {
      return actions.map(action => {
        const data1 = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data1 };
      });
    });

    messages1.subscribe(data => {
      if (data.length > 0) {
        let msgData: any = data[0];
        //console.log(msgData.to_user_id); 
        if (msgData.to_user_id == this.loginUserId) {
          msgData.first_name = userData.first_name;
          msgData.last_name = userData.last_name;
          msgData.image_url = userData.image_url;
        } else {
          msgData.first_name = this.loginUserDet.first_name;
          msgData.last_name = this.loginUserDet.last_name;
          msgData.image_url = this.loginUserDet.image_url;
        }
        console.log('msgData',msgData);
        this.chatlist.push(msgData);      
        console.log('this.chatlist',this.chatlist);
        msgData= this.chatlist[this.chatlist.length-1];
        this.chatlist=[];
        console.log('msgData2',msgData);
        let chatCntlistUnique = _.uniqBy(this.chatlist, 'room_id');
        this.chatlist = chatCntlistUnique;      
        this.chatlist.push(msgData); 
        console.log('this.chatCntlist',this.chatlist)  
      }
     
    });

  }
  gotoChatDet(ordId){
    this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId})
  }
}
