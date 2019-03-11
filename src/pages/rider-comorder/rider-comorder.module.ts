import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiderComorderPage } from './rider-comorder';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    RiderComorderPage,
  ],
  imports: [
    IonicPageModule.forChild(RiderComorderPage),
    MomentModule
  ],
})
export class RiderComorderPageModule {}
