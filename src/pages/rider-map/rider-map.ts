import { Component ,ViewChild,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,LatLng
 } from '@ionic-native/google-maps';
 import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the RiderMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-rider-map',
  templateUrl: 'rider-map.html',
})
export class RiderMapPage {
  @ViewChild('map') mapElement: ElementRef;
  maprider: any;
  lat: number = 22.5726;
  lng: number = 88.3639;
  Destination:any;
  public order:any;
 MyLocation: any;
 responseData : any;
 public dbRef:any;
 markers = [];
 public getFbPId:any;
 public currentFireUserId: string;
 
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private geolocation: Geolocation, 
    private afAuth: AngularFireAuth,
    public db: AngularFirestore
  ) {
    this.order=this.navParams.get('order_id');
    // this.afAuth.authState.do(user => {
    //   if (user) {
    //     this.currentFireUserId = user.uid;
    //     //console.log(this.currentFireUserId);
    //     //this.updateTrackData();
    //   }
    // }).subscribe();
    console.log(this.afAuth.authState);
    //this.getgeolocationchanges();
  }

  ionViewDidLoad() {
    
    //this.calculateAndDisplayRoute(22.717666, 88.478630);
    this.initMap();
  }

  private updateTrackData(orderId, locLat, locLong) {
    //console.log('hi');
    let usersRef = firebase.database().ref('presence/' + this.currentFireUserId);
    let connectedRef = firebase.database().ref('.info/connected');
    //const orderId = this.order;
    connectedRef.on('value', function (snapshot) {
      if (snapshot.val()) {
        // User is online.
        //usersRef.onDisconnect().set({ online: false, userid: fUserId });
        usersRef.set({ longitude: locLong, latitude: locLat, order_id: orderId });
        //console.log('online');
      } else {
        // User is offline.
        // WARNING: This won't work! See an explanation below.
        //usersRef.set({ online: false, userid: fUserId });
      }
    });
  }

  getgeolocationchanges(){
    //console.log('hi');
    const getFBId = this.db.collection('geolocations', ref => { 
      return ref.where('order_id', '==', this.order);
    }).snapshotChanges().map(actions => { 
      return actions.map(action => { 
        const data1 = action.payload.doc.data();
        const id = action.payload.doc.id;
        //console.log(data1);
        return { id, ...data1 };
      });
    });

    getFBId.subscribe(data => {  
      if(data.length>0){
        this.getFbPId = data[0].id;
        //console.log(data);
      } 
    });

  }
  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.maprider = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: mylocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    });
    //this.calculateAndDisplayRoute(22.5837286,88.4695656);
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      //this.getgeolocationchanges();
      this.deleteMarkers();
      //this.updateTrackData(this.order,data.coords.latitude,data.coords.longitude);
      //this.addgeolocation(this.order,data.coords.latitude,data.coords.longitude);
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      this.calculateAndDisplayRoute(data.coords.latitude,data.coords.longitude);
      let image = 'assets/img/blue-dot.png';
    this.addMarker(updatelocation,image);
      this.setMapOnAll(this.maprider);
    });
  }

  addMarker(location,image) {
    // let image = {
    //   MyLocation: new google.maps.MarkerImage(
    //    'assets/img/mapicon.png'
    //   ),
    //   Destination: new google.maps.MarkerImage(
    //    'assets/img/blue-dot.png'
    //   )
    //  };
    let marker = new google.maps.Marker({
      position: location,
      map: this.maprider,
      icon: image
    });
    this.markers.push(marker);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }


  addgeolocation(order_id,lat,lng){
    const getFBId = this.db.collection('geolocations', ref => { 
      return ref.where('order_id', '==', order_id);
    }).snapshotChanges().map(actions => { 
      return actions.map(action => { 
        const data1 = action.payload.doc.data();
        const id = action.payload.doc.id;
        //console.log(data1);
        return { id, ...data1 };
      });
    });

    const data_fb = {
      order_id: order_id,
      latitude: lat,
      longitude : lng
    };
    getFBId.subscribe(data => {  
      if(data.length>0){
        this.getFbPId = data[0].id;
        this.db.collection('geolocations').doc(this.getFbPId).update(data_fb).then(res => {
        }).catch(err => {
        });
        
      }else{
        this.db.collection('geolocations').add(data_fb).then(res => {
          console.log(res);
          //console.log(res.id);
        }).catch(err => {
        });
      } 
      
    });
    
    
  }  
  

  calculateAndDisplayRoute(latt,longg) {
  
     let that = this;
     let directionsService = new google.maps.DirectionsService;
     let directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    // let image = {
    //   MyLocation: new google.maps.MarkerImage(
    //    'assets/img/mapicon.png'
    //   ),
    //   Destination: new google.maps.MarkerImage(
    //    'assets/img/blue-dot.png'
    //   )
    //  };
     directionsDisplay.setMap(this.maprider);
         console.log("CURRENTPOS",latt);
         console.log("CURRENTPOS",longg);
        
         var pos = {
           lat:latt,
           lng: longg
         };
      
         this.maprider.setCenter(pos);
         that.MyLocation = new google.maps.LatLng(pos);
      
         var posstore={
           lat: 22.5726,
           lng:88.3639
         };
         that.Destination=new google.maps.LatLng(posstore);
        
         directionsService.route({ origin: this.MyLocation,
          destination: this.Destination,
          travelMode: google.maps.TravelMode.DRIVING}, function(response, status) {
           //console.log("DIRECTIONN",response);
           if (status === 'OK') {
             directionsDisplay.setDirections(response);
            // var leg = response.routes[ 0 ].legs[ 0 ];
            //  this.addMarker(leg.start_location,image.MyLocation);
            //  this.addMarker(leg.end_location,image.Destination);
           } else {
             window.alert('Directions request failed due to ' + status);
           }
         });

   }

// cal(){
//   var directionsDisplay;
// var start = document.getElementById('start').value;
// var end = "1883 Walnut Cres, Coquitlam V3J 7T3";
// var directionsService = new google.maps.DirectionsService();
// var map = null;
//  var icons = {
//   start: new google.maps.MarkerImage(
//    // URL
//    'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png',
//    // (width,height)
//    new google.maps.Size( 44, 32 ),
//    // The origin point (x,y)
//    new google.maps.Point( 0, 0 ),
//    // The anchor point (x,y)
//    new google.maps.Point( 22, 32 )
//   ),
//   end: new google.maps.MarkerImage(
//    // URL
//    'https://maps.google.com/mapfiles/kml/shapes/schools_maps.png',
//    // (width,height)
//    new google.maps.Size( 44, 32 ),
//    // The origin point (x,y)
//    new google.maps.Point( 0, 0 ),
//    // The anchor point (x,y)
//    new google.maps.Point( 22, 32 )
//   )
//  };
//  function initialize() {
//   directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
//      // Start/Finish icons
//   directionsDisplay.setMap(this.maprider);
//   directionsDisplay.setPanel(document.getElementById('directions-panel'));
//   var control = document.getElementById('control');
//   control.style.display = 'block';
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
// }
// function calcRoute() {
    
  
    
//   var request = {
//     origin: start,
//     destination: end,
//     travelMode: google.maps.TravelMode.DRIVING
//   };
//   directionsService.route(request, function(response, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       directionsDisplay.setDirections(response);
//         var leg = response.routes[ 0 ].legs[ 0 ];
//   makeMarker( leg.start_location, icons.start, "title" );
//   makeMarker( leg.end_location, icons.end, 'title' );
//     }
//   });
// }
// function makeMarker( position, icon, title ) {
//  new google.maps.Marker({
//   position: position,
//   map: map,
//   icon: icon,
//   title: title
//  });
// }
// }
   

}