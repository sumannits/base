import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiderPackedorderPage } from './rider-packedorder';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    RiderPackedorderPage,
  ],
  imports: [
    IonicPageModule.forChild(RiderPackedorderPage),
    MomentModule
  ],
})
export class RiderPackedorderPageModule {}
