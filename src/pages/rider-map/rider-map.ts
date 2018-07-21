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
 ref = firebase.database().ref('geolocations/');
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public db: AngularFirestore) {
  }

  ionViewDidLoad() {
    this.order=this.navParams.get('order_id');
    console.log('ionViewDidLoad RiderMapPage');
    //this.calculateAndDisplayRoute(22.717666, 88.478630);
    this.initMap();
  }

  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.maprider = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: mylocation
      });
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      this.addgeolocation(this.order,data.coords.latitude,data.coords.longitude);
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      this.calculateAndDisplayRoute(data.coords.latitude,data.coords.longitude);
      let image = 'assets/img/blue-dot.png';
      this.addMarker(updatelocation,image);
      this.setMapOnAll(this.maprider);
    });
  }

  addMarker(location, image) {
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
    const data = {
      order_id: order_id,
      latitude: lat,
      longitude : lng
    };
    this.db.collection('geolocations').add(data).then(res => {
      console.log();
      //this.getMessages();
    }).catch(err => {
      //console.log('error with fb: ', err);
    });
  }  
  

  // updateGeolocation(order_id,lat,lng) {
  //     firebase.database().ref('geolocations').set({
  //       order_id: order_id,
  //       latitude: lat,
  //       longitude : lng
  //     });
  //     let newData = this.ref.push();
  //     newData.set({
  //       order_id: order_id,
  //       latitude: lat,
  //       longitude: lng
  //     });
  //    // localStorage.setItem('mykey', newData.key);
    
  // }
  

  calculateAndDisplayRoute(latt,longg) {
     let that = this;
     let directionsService = new google.maps.DirectionsService;
     let directionsDisplay = new google.maps.DirectionsRenderer;
    //  const map = new google.maps.Map(document.getElementById('map'), {
    //    zoom: 10,
    //    center: {lat: 22.5726, lng: 88.3639}
    //  });
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
         directionsService.route({
           origin: this.MyLocation,
           destination: this.Destination,
           travelMode: 'WALKING'
         }, function(response, status) {
         
           console.log("DIRECTIONN",response);
           if (status === 'OK') {
             directionsDisplay.setDirections(response);
           } else {
             window.alert('Directions request failed due to ' + status);
           }
         });

   }


   

}
