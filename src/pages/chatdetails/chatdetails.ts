import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';

/**
 * Generated class for the ChatdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatdetails',
  templateUrl: 'chatdetails.html',
})
export class ChatdetailsPage {

  public chatlist = [];
  public dbRef: any;
  public room_id: string;
  public loginUserId:any;

  constructor(
    public navCtrl: NavController, 
    public db: AngularFirestore,
    public navParams: NavParams
  ) {
    this.room_id = '100_10';
    this.getMessages();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChatdetailsPage');
    // firebase.database().ref('chatrooms/'+this.room_id+'/chats').on('value', resp => {
    //   console.log(resp);
    //   // this.chats = [];
    //   // this.chats = snapshotToArray(resp);
    //   // setTimeout(() => {
    //   //   if(this.offStatus === false) {
    //   //     this.content.scrollToBottom(300);
    //   //   }
    //   // }, 1000);
    // });
  }

  getMessages() {
    this.dbRef = this.db.collection('livechat', ref => {
      return ref.where('room_id', '==', this.room_id).orderBy("cdate", "asc");
    }).snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        //console.log(id);
        // if (data.to_user_id == this.loginUserId) {
        //   //console.log(id);
        //   setTimeout(() => {
        //     this.db.collection('livechat').doc(id).update({ is_read: true }).then(res => {
              
        //     }).catch(err => {
        //       //console.log(err);
        //     });
        //   }, 3000);
        // }
        return { id, ...data };
      });
    });
    this.dbRef.subscribe(data => {
      this.chatlist = data;
      
      //this.updateUserOfMessages();
      //this.scrollToBottomOnListen();
    });
    console.log(this.chatlist);
  }
}
